const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface User {
  id: string;
  name: string;
  email: string;
}

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'An error occurred' };
      }

      return { data };
    } catch {
      return { error: 'Network error' };
    }
  }

  async googleLogin(idToken: string) {
    return this.request<{ user: User; token: string }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(name: string, email: string, password: string) {
    return this.request<{ user: User; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }
}

export const apiService = new ApiService();
