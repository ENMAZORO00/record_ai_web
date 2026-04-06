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

interface SignupResponse {
  message: string;
  email: string;
  tempData: { name: string; password: string };
}

interface VerifyOtpResponse {
  user: User;
  token: string;
}

interface RegisterCompanyResponse {
  company: {
    id: string;
    name: string;
    verified: boolean;
  };
  user: User & {
    companyId: string;
    companyRole: string;
    companyName: string;
    companyVerified: boolean;
  };
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
    return this.request<SignupResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async verifyOtp(email: string, otp: string, name: string, password: string) {
    return this.request<VerifyOtpResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, name, password }),
    });
  }

  async registerCompanyPublic(email: string, companyName: string) {
    return this.request<RegisterCompanyResponse>('/companies/register', {
      method: 'POST',
      body: JSON.stringify({ email, companyName }),
    });
  }

  async forgotPassword(email: string) {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
    confirmPassword: string
  ) {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
    });
  }

  async logout(token: string) {
    return this.request('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();
