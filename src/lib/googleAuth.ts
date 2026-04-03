import { apiService } from '../services/api';

interface GoogleCredentialResponse {
  credential: string;
}

interface GooglePromptMomentNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
}

interface GoogleAccountsId {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  prompt: (momentListener: (notification: GooglePromptMomentNotification) => void) => void;
  renderButton: (
    container: HTMLElement | null,
    options: {
      theme?: string;
      size?: string;
      type?: string;
      shape?: string;
    }
  ) => void;
  disableAutoSelect: () => void;
}

interface GoogleNamespace {
  accounts: {
    id: GoogleAccountsId;
  };
}

declare global {
  interface Window {
    google?: GoogleNamespace;
  }
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

export interface AuthResponse {
  user: GoogleUser;
  token: string;
}

export class GoogleAuthService {
  private clientId: string;

  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    if (!this.clientId) {
      console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
    }
  }

  async initialize(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve();

      // Check if Google Identity Services is already loaded
      if (window.google && window.google.accounts) {
        resolve();
      } else {
        // Wait for the script to load
        const checkGoogle = () => {
          if (window.google && window.google.accounts) {
            resolve();
          } else {
            setTimeout(checkGoogle, 100);
          }
        };
        checkGoogle();
      }
    });
  }

  async signIn(): Promise<AuthResponse | null> {
    if (!this.clientId) {
      throw new Error('Google Client ID not configured');
    }

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.google) {
        reject(new Error('Google Identity Services not loaded'));
        return;
      }

      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: async (response: GoogleCredentialResponse) => {
          try {
            const result = await apiService.googleLogin(response.credential);

            if (result.error) {
              reject(new Error(result.error));
            } else {
              resolve(result.data || null);
            }
          } catch (error) {
            reject(error);
          }
        },
      });

      // Prompt the user to sign in
      window.google.accounts.id.prompt((notification: GooglePromptMomentNotification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // User cancelled or skipped
          resolve(null);
        }
      });
    });
  }

  renderButton(elementId: string, onSuccess?: (response: AuthResponse) => void, onError?: (error: Error) => void): void {
    if (typeof window === 'undefined' || !window.google) {
      console.error('Google Identity Services not loaded');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: async (response: GoogleCredentialResponse) => {
        try {
          const result = await apiService.googleLogin(response.credential);

          if (result.error) {
            onError?.(new Error(result.error));
          } else if (result.data) {
            onSuccess?.(result.data);
          }
        } catch (error) {
          onError?.(error as Error);
        }
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
      }
    );
  }

  async signOut(): Promise<void> {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  }
}

export const googleAuthService = new GoogleAuthService();