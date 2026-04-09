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

export interface Conversation {
  id: string;
  speaker: string;
  text: string;
  transcriptId: string;
}

export interface Transcript {
  id: string;
  recordingUrl?: string;
  status: string;
  userId: string;
  meetingId?: string;
  createdAt: string;
  Conversation: Conversation[];
  isOwner?: boolean;
}

class ApiService {
  public async request<T = unknown>(
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

  async getInformation(token: string) {
    return this.request<
      {
        id: string;
        title: string | null;
        text: string;
        createdAt: string;
      }[]
    >('/information', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createInformation(
    data: { title?: string; text: string },
    token: string
  ) {
    return this.request<{
      id: string;
      title: string | null;
      text: string;
      createdAt: string;
    }>('/information', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  }

  async deleteInformation(id: string, token: string) {
    return this.request(`/information/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // GET ALL TRANSCRIPTS
  async getTranscripts(token: string) {
    return this.request<Transcript[]>('/transcripts', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // GET SINGLE TRANSCRIPT
  async getTranscriptById(id: string, token: string) {
    return this.request<Transcript>(`/transcripts/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // SEARCH TRANSCRIPTS
  async searchTranscripts(query: string, token: string) {
    return this.request<Transcript[]>('/transcripts/search', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });
  }

  // DELETE TRANSCRIPT
  async deleteTranscript(id: string, token: string) {
    return this.request(`/transcripts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // GET SHARES
  async getTranscriptShares(id: string, token: string) {
    return this.request<{ email: string; name: string }[]>(
      `/transcripts/${id}/shares`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // SHARE TRANSCRIPT
  async shareTranscript(id: string, email: string, token: string) {
    return this.request(`/transcripts/${id}/share`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });
  }

  // UNSHARE TRANSCRIPT
  async unshareTranscript(id: string, email: string, token: string) {
    return this.request(`/transcripts/${id}/share?email=${email}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // UPLOAD RECORDING
  async uploadRecording(file: Blob, token?: string) {
    const formData = new FormData();
    formData.append('recording', file, 'recording.webm');

    try {
      const response = await fetch(`${API_BASE_URL}/transcripts/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Upload failed' };
      }

      return { data };
    } catch {
      return { error: 'Network error' };
    }
  }

  // CHAT APIS
  // GET /chats (list, optional search)
  async getChats(token: string, search?: string) {
    const url = search
      ? `/chats?search=${encodeURIComponent(search)}`
      : '/chats';
    return this.request<{
      chats: { id: string; title: string; updatedAt: string }[];
    }>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // GET /chats/:id (single chat with messages)
  async getChatById(id: string, token: string) {
    return this.request<{
      chat: {
        id: string;
        title: string;
        messages: {
          id: string;
          role: string;
          text: string;
          content: string;
          createdAt: string;
        }[];
        updatedAt: string;
      };
    }>(`/chats/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // POST /chats (create new chat)
  async createChat(data: { title?: string; content: string }, token: string) {
    return this.request<{
      chat: {
        id: string;
        title: string;
        messages: {
          id: string;
          role: string;
          text: string;
          content: string;
          createdAt: string;
        }[];
        updatedAt: string;
      };
    }>('/chats', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  // POST /chats/:id/messages (add user message, get assistant reply)
  async sendMessageToChat(chatId: string, content: string, token: string) {
    return this.request<{ content: string }>(`/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
  }

  // DELETE /chats/:id
  async deleteChat(id: string, token: string) {
    return this.request<{ success: boolean }>(`/chats/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();
