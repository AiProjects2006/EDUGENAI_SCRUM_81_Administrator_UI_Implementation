const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8087';
const BACKOFFICE_URL = import.meta.env.VITE_BACKOFFICE_URL || 'http://localhost:8086';
const STORAGE_KEY = 'admin_courses';

const DEFAULT_COURSES = [
  {
    id: 1,
    title: 'Primary Mathematics',
    creator: 'Alex Rivers',
    subject: 'Mathematics',
    grade: 'Grade 6',
    status: 'Approved',
    date: '2026-08-01',
    description: 'Learn basic mathematics concepts, problem solving, and numbers.',
    lessons: 12,
    activities: 8
  },
  {
    id: 2,
    title: 'Junior Science',
    creator: 'Kasun Perera',
    subject: 'Science',
    grade: 'Grade 6',
    status: 'Approved',
    date: '2026-08-01',
    description: 'Learn basic science concepts, living things, and the environment through simple lessons and activities.',
    lessons: 12,
    activities: 8
  },
  {
    id: 3,
    title: 'Elementary Mathematics',
    creator: 'Nimal Silva',
    subject: 'Mathematics',
    grade: 'Grade 8',
    status: 'Pending',
    date: '2026-08-02',
    description: 'Improve mathematical skills through numbers, algebra, geometry, and problem-solving exercises.',
    lessons: 15,
    activities: 10
  },
  {
    id: 4,
    title: 'ICT Basics',
    creator: 'Amal Fernando',
    subject: 'Technology',
    grade: 'Grade 9',
    status: 'Approved',
    date: '2026-08-03',
    description: 'Understand computer fundamentals, information technology, and basic digital skills through practical learning.',
    lessons: 10,
    activities: 5
  },
  {
    id: 5,
    title: 'English Grammar',
    creator: 'Sanduni Perera',
    subject: 'English',
    grade: 'Grade 7',
    status: 'Archived',
    date: '2026-08-04',
    description: 'Develop English grammar skills through sentence formation, tenses, vocabulary, and language exercises.',
    lessons: 14,
    activities: 9
  }
];

const getStoredLocalCourses = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('courses');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading courses from localStorage:', e);
  }
  return DEFAULT_COURSES;
};

export const deduplicateCourses = (courses = []) => {
  const seen = new Set();
  const result = [];
  for (const c of courses) {
    if (!c) continue;
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
    window.dispatchEvent(new Event('storage'));
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
    grade: c.grade || c.gradeLevel || 'Grade 6',
    status: status,
    date: c.date || c.createdAt || new Date().toISOString().slice(0, 10),
    description: c.description || '',
    lessons: c.lessons || 10,
    activities: c.activities || 5
  };
};

const requestBackoffice = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const isMutation = options.method && options.method.toUpperCase() !== 'GET';

  try {
    const res = await fetch(`${GATEWAY_URL}/api/v1/backoffice${endpoint}`, {
      ...options,
      headers
    });
    if (res.ok) {
      const json = await res.json();
      return json.data !== undefined ? json.data : json;
    }
    if (isMutation && res.status < 500) {
      const errJson = await res.json().catch(() => null);
      throw new Error((errJson && errJson.message) || `Request failed with status ${res.status}`);
    }
  } catch (gatewayErr) {
    if (isMutation && !gatewayErr.message?.includes('Failed to fetch') && !gatewayErr.message?.includes('NetworkError')) {
      throw gatewayErr;
    }
  }

  try {
    const res = await fetch(`${BACKOFFICE_URL}/api/v1/backoffice${endpoint}`, {
      ...options,
      headers
    });
    if (res.ok) {
      const json = await res.json();
      return json.data !== undefined ? json.data : json;
    }
    const errJson = await res.json().catch(() => null);
    throw new Error((errJson && errJson.message) || `Request failed with status ${res.status}`);
  } catch (backofficeErr) {
    throw new Error(backofficeErr.message || 'Backoffice API currently unreachable');
  }
};

export const fetchCoursesFromBackoffice = async (status = '', search = '') => {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const data = await requestBackoffice(`/courses${qs}`);
    if (Array.isArray(data) && data.length > 0) {
      const normalized = deduplicateCourses(data.map(normalizeAdminCourse));
      saveStoredLocalCourses(normalized);
      return normalized;
    }
  } catch (err) {
    console.warn('Using local courses fallback in Admin UI:', err.message);
  }

  let list = getStoredLocalCourses().map(normalizeAdminCourse);
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
