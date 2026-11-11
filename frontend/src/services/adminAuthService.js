/**
 * adminAuthService.js
 * Keycloak OIDC Authentication & EduGenAI User Service Integration for Platform Administrators
 */

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8090';
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM || 'ai-learning-platform';
const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'edugenai-frontend';
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8087';
const BACKOFFICE_URL = import.meta.env.VITE_BACKOFFICE_URL || 'http://localhost:8086';

/**
 * Safely parse a base64 encoded JWT payload
 */
export function parseJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * Authenticate Administrator via Keycloak Direct Access Grant or User Service backend
 */
export async function loginAdmin({ usernameOrEmail, password }) {
  if (!usernameOrEmail || !password) {
    throw new Error('Please enter both your email/username and password.');
  }

  const cleanUser = usernameOrEmail.trim();
  let tokenData = null;
  let decodedToken = null;

  // 1. Direct Grant to Keycloak OIDC endpoint (:8090)
  try {
    const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', KEYCLOAK_CLIENT_ID);
    params.append('username', cleanUser);
    params.append('password', password);
    params.append('scope', 'openid profile email');

    const kcResp = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    if (kcResp.ok) {
      tokenData = await kcResp.json();
      decodedToken = parseJwtPayload(tokenData.access_token);
    } else {
      const errBody = await kcResp.json().catch(() => ({}));
      if (errBody.error === 'invalid_grant') {
        throw new Error('Invalid username/email or password.');
      }
    }
  } catch (kcErr) {
    if (kcErr.message.includes('Invalid username/email')) {
      throw kcErr;
    }
    console.warn('Keycloak direct grant unreachable from browser, falling back to User Service:', kcErr.message);
  }

  // 2. If Keycloak Direct Grant succeeded, verify ADMIN role
  if (tokenData && tokenData.access_token) {
    const roles = decodedToken?.realm_access?.roles || [];
    const isAdmin = roles.includes('ADMIN');

    if (!isAdmin) {
      const isCreator = roles.includes('CONTENT_CREATOR');
      const isStudent = roles.includes('STUDENT');
      const roleName = isCreator ? 'Content Creator' : (isStudent ? 'Student' : 'Non-Admin');
      throw new Error(`Access denied. This account has the ${roleName} role and lacks Administrator privileges.`);
    }

    const adminUser = {
      username: decodedToken?.preferred_username || cleanUser,
      email: decodedToken?.email || (cleanUser.includes('@') ? cleanUser : `${cleanUser}@admin.edugenai.local`),
      fullName: decodedToken?.name || decodedToken?.preferred_username || 'System Administrator',
      role: 'ADMIN'
    };

    localStorage.setItem('access_token', tokenData.access_token);
    if (tokenData.refresh_token) {
      localStorage.setItem('refresh_token', tokenData.refresh_token);
    }
    localStorage.setItem('user_role', 'ADMIN');
    localStorage.setItem('current_user', JSON.stringify(adminUser));

    // Background sync with User Service
    syncSessionWithBackend(tokenData.access_token, tokenData.refresh_token).catch(() => {});

    return {
      success: true,
      token: tokenData.access_token,
      user: adminUser,
      provider: 'keycloak'
    };
  }

  // 3. Fallback: Authenticate via API Gateway (:8087) -> Backoffice API (:8086) -> User Service (:8081)
  const endpoints = [
    `${GATEWAY_URL}/api/v1/backoffice/auth/login`,
    `${BACKOFFICE_URL}/api/v1/backoffice/auth/login`,
    `${GATEWAY_URL}/api/users/login`
  ];

  let lastError = null;
  for (const url of endpoints) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrUsername: cleanUser,
          password: password,
          expectedRole: 'ADMIN'
        })
      });

      if (resp.ok) {
        const body = await resp.json();
        const profile = body.user || {
          username: cleanUser,
          email: cleanUser.includes('@') ? cleanUser : `${cleanUser}@admin.edugenai.com`,
          fullName: 'System Administrator',
          role: 'ADMIN'
        };

        const token = body.accessToken || `session_${Date.now()}`;
        localStorage.setItem('access_token', token);
        if (body.refreshToken) {
          localStorage.setItem('refresh_token', body.refreshToken);
        }
        localStorage.setItem('user_role', 'ADMIN');
        localStorage.setItem('current_user', JSON.stringify(profile));

        return {
          success: true,
          token: token,
          user: profile,
          provider: body.authProvider || 'user-service'
        };
      } else {
        const contentType = resp.headers.get('content-type') || '';
        const errText = await resp.text().catch(() => '');

        // If intermediate proxy returns 404 or HTML, continue to next fallback
        if (resp.status === 404 || contentType.includes('text/html') || errText.includes('<html>')) {
          console.warn(`Endpoint ${url} returned ${resp.status} (HTML/404), trying next fallback...`);
          lastError = new Error('Invalid administrator credentials.');
          continue;
        }

        let errMsg = 'Invalid admin credentials.';
        try {
          const parsed = JSON.parse(errText);
          errMsg = parsed.message || parsed.error || errMsg;
        } catch (_) {
          if (errText && !errText.includes('<html>')) errMsg = errText;
        }
        lastError = new Error(errMsg);
        break;
      }
    } catch (netErr) {
      lastError = netErr;
    }
  }

  throw lastError || new Error('Invalid username or password. Please verify your administrator credentials.');
}

async function syncSessionWithBackend(accessToken, refreshToken) {
  const syncUrls = [
    `${GATEWAY_URL}/api/v1/backoffice/auth/keycloak-sync`,
    `${BACKOFFICE_URL}/api/v1/backoffice/auth/keycloak-sync`,
    `${GATEWAY_URL}/api/users/keycloak-sync`
  ];
  for (const url of syncUrls) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, refreshToken, expectedRole: 'ADMIN' })
      });
      if (resp.ok) return;
    } catch (_) {}
  }
}

export async function logoutAdmin() {
  const refreshToken = localStorage.getItem('refresh_token');

  if (refreshToken) {
    try {
      const logoutUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout`;
      const params = new URLSearchParams();
      params.append('client_id', KEYCLOAK_CLIENT_ID);
      params.append('refresh_token', refreshToken);

      await fetch(logoutUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });
    } catch (e) {
      console.debug('Background Keycloak logout note:', e.message);
    }
  }

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('current_user');
  sessionStorage.clear();
}

export function isAdminAuthenticated() {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('user_role');
  if (!token) return false;
  return role === 'ADMIN';
}

export function getCurrentAdminUser() {
  try {
    const raw = localStorage.getItem('current_user');
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

export function getAdminAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default {
  loginAdmin,
  logoutAdmin,
  isAdminAuthenticated,
  getCurrentAdminUser,
  getAdminAuthHeaders,
  parseJwtPayload
};
