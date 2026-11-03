const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8087';
const BACKOFFICE_URL = import.meta.env.VITE_BACKOFFICE_URL || 'http://localhost:8086';
const STORAGE_KEY = 'admin_courses';

const DEFAULT_COURSES = [];

const UNNECESSARY_TITLES = [
  'junior science',
  'elementary mathematics',
  'english grammar',
  'science explorer',
  'test course 999',
  'test new course',
  'direct gateway'
];

export const isLegacyDefaultCourse = (course) => {
  if (!course) return false;
  const t = (course.title || course.name || '').trim().toLowerCase();
  return UNNECESSARY_TITLES.some(p => t.includes(p));
};

export const purgeJunkCourses = () => {
  try {
    const keys = [STORAGE_KEY, 'courses', 'creator_courses', 'student_courses', 'user_courses'];
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(c => !isLegacyDefaultCourse(c));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(key, JSON.stringify(cleaned));
          }
        }
      }
    }
  } catch (_) { }
};

if (typeof window !== 'undefined') {
  purgeJunkCourses();
}

const broadcastCourseChange = (type = 'COURSES_UPDATED', payload = null) => {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('edugenai_channel');
      channel.postMessage({ type, payload, timestamp: Date.now() });
      channel.close();
    }
  } catch (_) { }

  try {
    // Only dispatch custom event, do NOT trigger synthetic window 'storage' event which causes infinite loops
    window.dispatchEvent(new CustomEvent('coursesUpdated', { detail: { type, payload } }));
  } catch (_) { }
};

const isJwtToken = (tok) => {
  if (!tok || typeof tok !== 'string') return false;
  const parts = tok.split('.');
  return parts.length === 3 && parts[0].length > 10;
};

const getStoredLocalCourses = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('courses') || localStorage.getItem('creator_courses');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(c => !isLegacyDefaultCourse(c));
      }
    }
  } catch (e) {
    console.error('Failed reading courses from localStorage:', e);
  }
  return [];
};

export const deduplicateCourses = (courses = []) => {
  const seen = new Set();
  const result = [];
  for (const c of courses) {
    if (!c || isLegacyDefaultCourse(c)) continue;
    const key = (c.title || c.name || '').trim().toLowerCase();
    const idKey = String(c.id || c.courseId || '');
    if (key && seen.has(key)) continue;
    if (idKey && seen.has(`id_${idKey}`)) continue;
    if (key) seen.add(key);
    if (idKey) seen.add(`id_${idKey}`);
    result.push(c);
  }
  return result;
};

const saveStoredLocalCourses = (courses) => {
  try {
    const deduped = deduplicateCourses(courses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped));
    localStorage.setItem('courses', JSON.stringify(deduped));
    localStorage.setItem('creator_courses', JSON.stringify(deduped));
    broadcastCourseChange('COURSES_UPDATED', deduped);
  } catch (e) {
    console.error('Failed saving courses to localStorage:', e);
  }
};

/**
 * Normalizes course status for Admin UI view
 */
const normalizeAdminCourse = (c) => {
  let status = c.status || 'Approved';
  if (status.equalsIgnoreCase ? status.equalsIgnoreCase('published') : status.toLowerCase() === 'published') {
    status = 'Approved';
  } else if (status.equalsIgnoreCase ? status.equalsIgnoreCase('draft') : status.toLowerCase() === 'draft') {
    status = 'Pending';
  }

  return {
    id: c.id || c.courseId,
    courseId: c.courseId || c.id,
    title: c.title || c.name || 'Untitled Course',
    creator: c.creator || c.author || 'Content Creator',
    subject: c.subject || 'General',
    grade: c.grade || c.gradeLevel || 'Grade 3',
    status: status,
    date: c.date || c.createdAt || new Date().toISOString().slice(0, 10),
    description: c.description || '',
    lessons: c.lessons || 10,
    activities: c.activities || 5
  };
};

const requestBackoffice = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  const validToken = isJwtToken(token) ? token : null;
  const isMutation = options.method && options.method.toUpperCase() !== 'GET';
  const headers = {
    'Content-Type': 'application/json',
    ...(isMutation && validToken ? { Authorization: `Bearer ${validToken}` } : {}),
    ...(options.headers || {})
  };

  // Primary: Direct Backoffice API port 8086 as per system architecture diagram
  try {
    let res = await fetch(`${BACKOFFICE_URL}/api/v1/backoffice${endpoint}`, {
      ...options,
      headers
    });

    if (res.status === 401 && headers.Authorization) {
      const retryHeaders = { ...headers };
      delete retryHeaders.Authorization;
      res = await fetch(`${BACKOFFICE_URL}/api/v1/backoffice${endpoint}`, {
        ...options,
        headers: retryHeaders
      });
    }

    if (res.ok) {
      const json = await res.json();
      return json.data !== undefined ? json.data : json;
    }
    if (isMutation && res.status < 500) {
      const errJson = await res.json().catch(() => null);
      throw new Error((errJson && errJson.message) || `Request failed with status ${res.status}`);
    }
  } catch (backofficeErr) {
    if (isMutation && !backofficeErr.message?.includes('Failed to fetch') && !backofficeErr.message?.includes('NetworkError')) {
      throw backofficeErr;
    }
  }

  // Fallback: via API Gateway
  try {
    let res = await fetch(`${GATEWAY_URL}/api/v1/backoffice${endpoint}`, {
      ...options,
      headers
    });

    if (res.status === 401 && headers.Authorization) {
      const retryHeaders = { ...headers };
      delete retryHeaders.Authorization;
      res = await fetch(`${GATEWAY_URL}/api/v1/backoffice${endpoint}`, {
        ...options,
        headers: retryHeaders
      });
    }

    if (res.ok) {
      const json = await res.json();
      return json.data !== undefined ? json.data : json;
    }
    const errJson = await res.json().catch(() => null);
    throw new Error((errJson && errJson.message) || `Request failed with status ${res.status}`);
  } catch (gatewayErr) {
    throw new Error(gatewayErr.message || 'Backoffice API currently unreachable');
  }
};

export const fetchCoursesFromBackoffice = async (status = '', search = '') => {
  let combined = [];

  // 1. Try Backoffice API
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const data = await requestBackoffice(`/courses${qs}`);
    if (Array.isArray(data) && data.length > 0) {
      combined = [...combined, ...data];
    }
  } catch (err) {
    console.warn('Backoffice API request skipped/failed in Admin UI:', err.message);
  }

  // 2. Supplement from Course Service
  try {
    const csRes = await fetch(`${GATEWAY_URL}/api/v1/courses`).catch(() =>
      fetch('http://localhost:8082/api/v1/courses')
    );
    if (csRes && csRes.ok) {
      const csJson = await csRes.json();
      const csList = Array.isArray(csJson) ? csJson : csJson.data || [];
      if (Array.isArray(csList) && csList.length > 0) {
        combined = [...combined, ...csList];
      }
    }
  } catch (_) { }

  // 3. Supplement from localStorage
  const local = getStoredLocalCourses();
  if (Array.isArray(local) && local.length > 0) {
    combined = [...local, ...combined];
  }

  let list = deduplicateCourses(combined.map(normalizeAdminCourse));

  if (status) {
    list = list.filter((c) => (c.status || '').toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (c) =>
        (c.title || '').toLowerCase().includes(q) ||
        (c.subject || '').toLowerCase().includes(q) ||
        (c.creator || '').toLowerCase().includes(q)
    );
  }
  return list;
};

export const updateCourseInBackoffice = async (id, courseData) => {
  let updatedCourse = null;
  try {
    updatedCourse = await requestBackoffice(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData)
    });
  } catch (err) {
    console.warn('Network error updating course:', err.message);
  }

  const current = getStoredLocalCourses();
  const updated = current.map((c) => {
    if (String(c.id) === String(id)) {
      return { ...c, ...courseData, ...(updatedCourse || {}) };
    }
    return c;
  });
  saveStoredLocalCourses(updated);
  return updatedCourse || courseData;
};

export const updateCourseStatusInBackoffice = async (id, status) => {
  try {
    await requestBackoffice(`/courses/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  } catch (err) {
    console.warn('Network error updating course status:', err.message);
  }

  const current = getStoredLocalCourses();
  const updated = current.map((c) =>
    String(c.id) === String(id) ? { ...c, status } : c
  );
  saveStoredLocalCourses(updated);
};

export const deleteCourseInBackoffice = async (id) => {
  try {
    await requestBackoffice(`/courses/${id}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('Network error deleting course:', err.message);
  }

  const current = getStoredLocalCourses();
  const updated = current.filter((c) => String(c.id) !== String(id));
  saveStoredLocalCourses(updated);
};

export const fetchCourseStatsFromBackoffice = async () => {
  try {
    const stats = await requestBackoffice('/courses/stats');
    if (stats) return stats;
  } catch (err) {
    console.warn('Using local stats computation in Admin UI:', err.message);
  }

  const all = getStoredLocalCourses();
  return {
    totalCourses: all.length,
    approvedCourses: all.filter((c) => (c.status || '').toLowerCase() === 'approved' || (c.status || '').toLowerCase() === 'published').length,
    pendingCourses: all.filter((c) => (c.status || '').toLowerCase() === 'pending' || (c.status || '').toLowerCase() === 'draft').length,
    archivedCourses: all.filter((c) => (c.status || '').toLowerCase() === 'archived').length
  };
};
