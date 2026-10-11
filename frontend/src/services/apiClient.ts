const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
  status: number;
  validationErrors?: Array<{ loc: string; msg: string }>;

  constructor(message: string, status: number, validationErrors?: any[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T; message?: string; pagination?: any }> {
  const token = localStorage.getItem('kaamconnect_token');
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      // Clear token if invalid or expired
      localStorage.removeItem('kaamconnect_token');
    }
    const errorMsg = json.error || json.message || `Request failed with status ${response.status}`;
    throw new ApiError(errorMsg, response.status, json.validation_errors);
  }

  return json;
}
