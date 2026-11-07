/**
 * creatorManagementService.js
 * Admin API service for Content Creator approval, review, and provisioning
 * Routed via API Gateway (:8087) -> Backoffice API (:8086) -> User Service (:8081)
 */

const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8087';
const BACKOFFICE_URL = import.meta.env.VITE_BACKOFFICE_URL || 'http://localhost:8086';

// Initial fallback creators for offline / mock testing
const INITIAL_CREATORS = [
  {
    id: 101,
    firstName: "Sarah",
    lastName: "Jenkins",
    username: "sarah_physics",
    email: "sarah.jenkins@oxford-edu.org",
    contactNumber: "0771234567",
    role: "CONTENT_CREATOR",
    accountStatus: "PENDING_VERIFICATION",
    qualifications: "MSc in Applied Physics (University of Cambridge)",
    experienceYears: 6,
    preferredSubjects: "Physics, Advanced Mechanics, STEM",
    skills: "Interactive Simulations, Problem Sets, Video Lectures",
    portfolioUrl: "https://youtube.com/@sarahphysicsexplained",
    bio: "Passionate physics educator with 6 years experience in Cambridge curriculum. Specializes in visual simulations and breakdown of complex gravitational concepts.",
    createdAt: "2026-11-04T10:30:00"
  },
  {
    id: 102,
    firstName: "Marcus",
    lastName: "Vance",
    username: "marcus_cs",
    email: "marcus.vance@tech-academy.io",
    contactNumber: "0772345678",
    role: "CONTENT_CREATOR",
    accountStatus: "PENDING_VERIFICATION",
    qualifications: "BSc in Computer Science & Certified AI Instructor",
    experienceYears: 4,
    preferredSubjects: "Computer Science, Python, AI Foundations",
    skills: "Python Coding Labs, Gamified Quizzes, Algorithmic Thinking",
    portfolioUrl: "https://github.com/marcusvance-edu",
    bio: "Former software engineer turned full-time STEM educator. Authored 3 interactive Python courses for junior high and high school students.",
    createdAt: "2026-11-05T08:15:00"
  },
  {
    id: 103,
    firstName: "Alex",
    lastName: "Rivers",
    username: "creator",
    email: "creator@edugenai.com",
    contactNumber: "0770000002",
    role: "CONTENT_CREATOR",
    accountStatus: "ACTIVE",
    qualifications: "M.Ed in Curriculum Design & Mathematics",
    experienceYears: 8,
    preferredSubjects: "Pure Mathematics, Algebra, Statistics",
    skills: "Curriculum Alignment, Video Production, Diagnostic Quizzes",
    portfolioUrl: "https://linkedin.com/in/alex-rivers-math",
    bio: "Lead content designer for EduGenAI core math curriculum.",
    createdAt: "2026-10-15T14:00:00"
  },
  {
    id: 104,
    firstName: "Elena",
    lastName: "Rostova",
    username: "elena_chem",
    email: "elena.rostova@sci-learn.net",
    contactNumber: "0773456789",
    role: "CONTENT_CREATOR",
    accountStatus: "SUSPENDED",
    qualifications: "PhD in Chemistry",
    experienceYears: 10,
    preferredSubjects: "Organic Chemistry, Laboratory Safety",
    skills: "Lab Demonstrations, Molecule 3D Models",
    portfolioUrl: "https://elenarostova-chem.org",
    bio: "Published author and senior lecturer.",
    createdAt: "2026-09-20T11:45:00"
  }
];

const LOCAL_STORAGE_KEY = 'edugenai_admin_creators_cache';

function buildAuthHeaders(extra = {}) {
  const token = localStorage.getItem('access_token');
  const isJwt = typeof token === 'string' && token.split('.').length === 3;
  return {
    Accept: 'application/json',
    ...(isJwt ? { Authorization: `Bearer ${token}` } : {}),
    ...extra
  };
}

function getCachedCreators() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return INITIAL_CREATORS;
}

function setCachedCreators(creators) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(creators));
  } catch (_) {}
}

/**
 * Fetch all content creators via API Gateway (:8087) -> Backoffice API (:8086) -> User Service (:8081)
 */
export async function getCreators() {
  const endpoints = [
    `${GATEWAY_URL}/api/v1/backoffice/users?role=CONTENT_CREATOR`,
    `${BACKOFFICE_URL}/api/v1/backoffice/users?role=CONTENT_CREATOR`,
    `${GATEWAY_URL}/api/users?role=CONTENT_CREATOR`
  ];

  for (const url of endpoints) {
    try {
      let resp = await fetch(url, { headers: buildAuthHeaders() });
      if (resp.status === 401) {
        resp = await fetch(url, { headers: { Accept: 'application/json' } });
      }
      if (resp.ok) {
        const raw = await resp.json();
        const data = Array.isArray(raw) ? raw : (raw && Array.isArray(raw.data) ? raw.data : null);
        if (Array.isArray(data)) {
          const cached = getCachedCreators();
          const merged = [...data];
          for (const item of cached) {
            if (!merged.some(m => m.id === item.id || m.username === item.username || m.email === item.email)) {
              merged.push(item);
            }
          }
          setCachedCreators(merged);
          return merged;
        }
      }
    } catch (_) {
      // Continue to next endpoint or offline cache
    }
  }

  return getCachedCreators();
}

/**
 * Update a Content Creator's account status (ACTIVE, SUSPENDED, PENDING_VERIFICATION)
 * via API Gateway (:8087) -> Backoffice API (:8086) -> User Service (:8081)
 */
export async function updateCreatorStatus(creatorId, newStatus) {
  const endpoints = [
    `${GATEWAY_URL}/api/v1/backoffice/users/${creatorId}/status`,
    `${BACKOFFICE_URL}/api/v1/backoffice/users/${creatorId}/status`,
    `${GATEWAY_URL}/api/users/${creatorId}/status`
  ];

  let updatedServer = false;
  for (const url of endpoints) {
    try {
      let resp = await fetch(url, {
        method: 'PATCH',
        headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status: newStatus })
      });
      if (resp.status === 401) {
        resp = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
      }
      if (resp.ok) {
        updatedServer = true;
        break;
      }
    } catch (_) {}
  }

  const cached = getCachedCreators();
  const updatedList = cached.map(c => c.id === creatorId ? { ...c, accountStatus: newStatus } : c);
  setCachedCreators(updatedList);

  return { success: true, status: newStatus, serverSynced: updatedServer };
}

/**
 * Directly provision and register a Content Creator by Admin
 * via API Gateway (:8087) -> Backoffice API (:8086) -> User Service (:8081)
 */
export async function addCreatorDirectly(creatorData) {
  const payload = {
    firstName: creatorData.firstName,
    lastName: creatorData.lastName,
    username: creatorData.username || creatorData.email.split('@')[0],
    email: creatorData.email.trim().toLowerCase(),
    password: creatorData.password || 'Creator@123',
    contactNumber: creatorData.contactNumber || '0770000000',
    role: 'CONTENT_CREATOR',
    accountStatus: 'ACTIVE',
    qualifications: creatorData.qualifications || '',
    experienceYears: creatorData.experienceYears ? parseInt(creatorData.experienceYears, 10) : 3,
    preferredSubjects: creatorData.preferredSubjects || '',
    skills: creatorData.skills || '',
    portfolioUrl: creatorData.portfolioUrl || '',
    bio: creatorData.bio || ''
  };

  const endpoints = [
    `${GATEWAY_URL}/api/v1/backoffice/users/register`,
    `${BACKOFFICE_URL}/api/v1/backoffice/users/register`,
    `${GATEWAY_URL}/api/users/register`
  ];

  let serverCreator = null;
  for (const url of endpoints) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        const body = await resp.json();
        serverCreator = body.user || body.data || null;
        break;
      }
    } catch (_) {}
  }

  const newCreator = serverCreator || {
    id: Date.now(),
    ...payload,
    createdAt: new Date().toISOString()
  };

  const cached = getCachedCreators();
  const updated = [newCreator, ...cached];
  setCachedCreators(updated);

  return newCreator;
}

export default {
  getCreators,
  updateCreatorStatus,
  addCreatorDirectly
};
