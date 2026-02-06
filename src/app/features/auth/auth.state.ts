import { Injectable, signal, computed, Signal } from '@angular/core';
import { User, LoginResponse } from './auth.model';

/**
 * خدمة إدارة حالة المصادقة
 * Authentication state management service - Manages authentication state using Angular Signals
 */
@Injectable({
  providedIn: 'root'
})
export class AuthState {
  // Private state signals
  private readonly _user = signal<User | null>(null);
  private readonly _token = signal<string | null>(null);
  private readonly _refreshToken = signal<string | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly user: Signal<User | null> = this._user.asReadonly();
  readonly token: Signal<string | null> = this._token.asReadonly();
  readonly refreshToken: Signal<string | null> = this._refreshToken.asReadonly();
  readonly loading: Signal<boolean> = this._loading.asReadonly();
  readonly error: Signal<string | null> = this._error.asReadonly();

  // Computed signals
  readonly isAuthenticated = computed(() => this._user() !== null && this._token() !== null);
  readonly userEmail = computed(() => this._user()?.email ?? null);
  readonly userName = computed(() => {
    const user = this._user();
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username ?? user?.email ?? null;
  });

  /**
   * Set authentication data after successful login
   */
  setAuthData(response: LoginResponse): void {
    this._user.set(response.user);
    this._token.set(response.token);
    if (response.refreshToken) {
      this._refreshToken.set(response.refreshToken);
    }
    this._error.set(null);
    
    // Store token in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('auth_refresh_token', response.refreshToken);
      }
      localStorage.setItem('auth_user', JSON.stringify(response.user));
    }
  }

  /**
   * Set user data
   */
  setUser(user: User | null): void {
    this._user.set(user);
    if (user && typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
    }
  }

  /**
   * Set token
   */
  setToken(token: string | null): void {
    this._token.set(token);
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Set refresh token
   */
  setRefreshToken(refreshToken: string | null): void {
    this._refreshToken.set(refreshToken);
    if (refreshToken && typeof window !== 'undefined') {
      localStorage.setItem('auth_refresh_token', refreshToken);
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_refresh_token');
    }
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  /**
   * Set error message
   */
  setError(error: string | null): void {
    this._error.set(error);
  }

  /**
   * Clear error
   */
  clearError(): void {
    this._error.set(null);
  }

  /**
   * Initialize auth state from localStorage
   */
  initializeFromStorage(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('auth_refresh_token');
      const userStr = localStorage.getItem('auth_user');

      if (token) {
        this._token.set(token);
      }
      if (refreshToken) {
        this._refreshToken.set(refreshToken);
      }
      if (userStr) {
        try {
          const user = JSON.parse(userStr) as User;
          this._user.set(user);
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
          this.clearAuth();
        }
      }
    }
  }

  /**
   * Clear all authentication data (logout)
   */
  clearAuth(): void {
    this._user.set(null);
    this._token.set(null);
    this._refreshToken.set(null);
    this._error.set(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_user');
    }
  }
}
