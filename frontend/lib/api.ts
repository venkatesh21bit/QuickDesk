const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://attractive-transformation-production-c76f.up.railway.app/api'
  : 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register/`,
    LOGIN: `${API_BASE_URL}/auth/login/`,
    LOGOUT: `${API_BASE_URL}/auth/logout/`,
    PROFILE: `${API_BASE_URL}/auth/profile/`,
  },
  
  // Tickets
  TICKETS: {
    LIST: `${API_BASE_URL}/tickets/`,
    CREATE: `${API_BASE_URL}/tickets/`,
    DETAIL: (id: string) => `${API_BASE_URL}/tickets/${id}/`,
    UPDATE: (id: string) => `${API_BASE_URL}/tickets/${id}/`,
    ASSIGN: (id: string) => `${API_BASE_URL}/tickets/${id}/assign/`,
    VOTE: (id: string) => `${API_BASE_URL}/tickets/${id}/vote/`,
    SEARCH: `${API_BASE_URL}/tickets/search/`,
    COMMENTS: (id: string) => `${API_BASE_URL}/tickets/${id}/comments/`,
    ATTACHMENTS: (id: string) => `${API_BASE_URL}/tickets/${id}/attachments/`,
  },
  
  // Categories & Priorities
  CATEGORIES: `${API_BASE_URL}/categories/`,
  PRIORITIES: `${API_BASE_URL}/priorities/`,
  
  // Dashboard
  DASHBOARD: {
    STATS: `${API_BASE_URL}/dashboard/stats/`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: `${API_BASE_URL}/notifications/`,
    MARK_READ: (id: string) => `${API_BASE_URL}/notifications/${id}/mark_read/`,
    MARK_ALL_READ: `${API_BASE_URL}/notifications/mark_all_read/`,
  },
  
  // Admin
  ADMIN: {
    STATS: `${API_BASE_URL}/admin/stats/`,
    USERS: `${API_BASE_URL}/admin/users/`,
    USER_DETAIL: (id: string) => `${API_BASE_URL}/admin/users/${id}/`,
    TOGGLE_ACTIVE: (id: string) => `${API_BASE_URL}/admin/users/${id}/toggle_active/`,
    CHANGE_ROLE: (id: string) => `${API_BASE_URL}/admin/users/${id}/change_role/`,
  },
};

// Default headers for API requests
export const getDefaultHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add CSRF token if available
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  return headers;
};

// Get CSRF token from cookies
export const getCsrfToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrftoken') {
      return value;
    }
  }
  return null;
};

// API helper function with error handling
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const defaultOptions: RequestInit = {
    headers: getDefaultHeaders(),
    credentials: 'include', // Include cookies for session authentication
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Specific API methods
export const api = {
  // Authentication
  login: (username: string, password: string) =>
    apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
    
  logout: () =>
    apiRequest(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    }),
    
  register: (userData: any) =>
    apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    
  getProfile: () =>
    apiRequest(API_ENDPOINTS.AUTH.PROFILE),
    
  updateProfile: (profileData: any) =>
    apiRequest(API_ENDPOINTS.AUTH.PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  // Tickets
  getTickets: (params?: URLSearchParams) => {
    const url = params ? `${API_ENDPOINTS.TICKETS.LIST}?${params}` : API_ENDPOINTS.TICKETS.LIST;
    return apiRequest(url);
  },
  
  createTicket: (ticketData: any) =>
    apiRequest(API_ENDPOINTS.TICKETS.CREATE, {
      method: 'POST',
      body: JSON.stringify(ticketData),
    }),
    
  getTicket: (id: string) =>
    apiRequest(API_ENDPOINTS.TICKETS.DETAIL(id)),
    
  updateTicket: (id: string, ticketData: any) =>
    apiRequest(API_ENDPOINTS.TICKETS.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    }),
    
  assignTicket: (id: string, agentId: string) =>
    apiRequest(API_ENDPOINTS.TICKETS.ASSIGN(id), {
      method: 'POST',
      body: JSON.stringify({ agent_id: agentId }),
    }),
    
  voteTicket: (id: string, voteType: 'up' | 'down') =>
    apiRequest(API_ENDPOINTS.TICKETS.VOTE(id), {
      method: 'POST',
      body: JSON.stringify({ vote_type: voteType }),
    }),
    
  searchTickets: (params: URLSearchParams) =>
    apiRequest(`${API_ENDPOINTS.TICKETS.SEARCH}?${params}`),

  // Comments
  getComments: (ticketId: string) =>
    apiRequest(API_ENDPOINTS.TICKETS.COMMENTS(ticketId)),
    
  getTicketComments: (ticketId: string) =>
    apiRequest(API_ENDPOINTS.TICKETS.COMMENTS(ticketId)),
    
  addComment: (ticketId: string, commentData: any) =>
    apiRequest(API_ENDPOINTS.TICKETS.COMMENTS(ticketId), {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),
    
  createComment: (ticketId: string, commentData: any) =>
    apiRequest(API_ENDPOINTS.TICKETS.COMMENTS(ticketId), {
      method: 'POST',
      body: JSON.stringify(commentData),
    }),

  // Categories & Priorities
  getCategories: () =>
    apiRequest(API_ENDPOINTS.CATEGORIES),
    
  createCategory: (categoryData: any) =>
    apiRequest(API_ENDPOINTS.CATEGORIES, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    }),
    
  getPriorities: () =>
    apiRequest(API_ENDPOINTS.PRIORITIES),

  // Dashboard
  getDashboardStats: () =>
    apiRequest(API_ENDPOINTS.DASHBOARD.STATS),

  // Notifications
  getNotifications: () =>
    apiRequest(API_ENDPOINTS.NOTIFICATIONS.LIST),
    
  markNotificationRead: (id: string) =>
    apiRequest(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id), {
      method: 'POST',
    }),
    
  markAllNotificationsRead: () =>
    apiRequest(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {
      method: 'POST',
    }),

  // Admin
  getUsers: () =>
    apiRequest(API_ENDPOINTS.ADMIN.USERS),
    
  getAdminStats: () =>
    apiRequest(API_ENDPOINTS.ADMIN.STATS),
    
  toggleUserActive: (id: string) =>
    apiRequest(API_ENDPOINTS.ADMIN.TOGGLE_ACTIVE(id), {
      method: 'POST',
    }),
    
  changeUserRole: (id: string, role: string) =>
    apiRequest(API_ENDPOINTS.ADMIN.CHANGE_ROLE(id), {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),
};

export default api;
