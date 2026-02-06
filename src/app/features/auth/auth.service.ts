import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginDto,
  RegisterDto,
  VerifyAccountDto,
  ResendVerificationDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateUsernameDto,
  UpdatePhoneNumberDto,
  RefreshTokenDto,
  LoginResponse,
  User,
  ApiResponse
} from './auth.model';

/**
 * خدمة المصادقة
 * Authentication service - Handles all authentication-related API calls
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Auth`;

  /**
   * تسجيل الدخول
   * Login user with email and password
   */
  login(credentials: LoginDto): Promise<{ data: LoginResponse | null; error: string | null; success: boolean }> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map((response) => ({ data: response, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: null,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<{ data: LoginResponse | null; error: string | null; success: boolean }>;
  }

  /**
   * تسجيل حساب جديد
   * Register new user
   */
  register(data: RegisterDto): Promise<{ data: ApiResponse | null; error: string | null; success: boolean }> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        map((response) => ({ data: response, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: null,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<{ data: ApiResponse | null; error: string | null; success: boolean }>;
  }

  /**
   * التحقق من الحساب
   * Verify account
   */
  verifyAccount(data: VerifyAccountDto): Promise<{ data: ApiResponse | null; error: string | null; success: boolean }> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/verify`, data)
      .pipe(
        map((response) => ({ data: response, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: null,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<{ data: ApiResponse | null; error: string | null; success: boolean }>;
  }

  /**
   * إعادة إرسال رمز التحقق
   * Resend verification code
   */
  resendVerification(data: ResendVerificationDto): Promise<{ data: ApiResponse | null; error: string | null; success: boolean }> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/resend-verification`, data)
      .pipe(
        map((response) => ({ data: response, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: null,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<{ data: ApiResponse | null; error: string | null; success: boolean }>;
  }

  /**
   * تغيير كلمة المرور
   * Change password
   */
  changePassword(data: ChangePasswordDto): Promise<{ data: ApiResponse | null; error: string | null; success: boolean }> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/change-password`, data)
      .pipe(
        map((response) => ({ data: response, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: null,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<{ data: ApiResponse | null; error: string | null; success: boolean }>;
  }

  /**
   * نسيان كلمة المرور
   * Forgot password
   */
  forgotPassword(data: ForgotPasswordDto): Promise<{ data: ApiResponse | null; error: string | null; success: boolean }> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/forgot-password`, data)
      .pipe(
        map((response) => ({ data: response, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: null,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<{ data: ApiResponse | null; error: string | null; success: boolean }>;
  }

  /**
   * إعادة تعيين كلمة المرور
   * Reset password
   */
  resetPassword(data: ResetPasswordDto): Promise<{ data: ApiResponse | null; error: string | null; success: boolean }> {
    return this.http
      .post<ApiResponse>(`${this.apiUrl}/reset-password`, data)
      .pipe(
        map((response) => ({ data: response, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: null,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<{ data: ApiResponse | null; error: string | null; success: boolean }>;
  }

  /**
   * تسجيل الخروج
   * Logout user
   */
  logout(): Promise<{ data: boolean | null; error: string | null; success: boolean }> {
    return this.http
      .post<{ success: boolean }>(`${this.apiUrl}/logout`, {})
      .pipe(
        map(() => ({ data: true, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: false,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<{ data: boolean | null; error: string | null; success: boolean }>;
  }

  /**
   * الحصول على معلومات المستخدم الحالي
   * Get current user information
   */
  getCurrentUser(): Promise<{ data: User | null; error: string | null; success: boolean }> {
    return this.http
      .get<User>(`${this.apiUrl}/me`)
      .pipe(
        map((user) => ({ data: user, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: null,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<{ data: User | null; error: string | null; success: boolean }>;
  }

  /**
   * تحديث اسم المستخدم
   * Update username
   */
  updateUsername(data: UpdateUsernameDto): Promise<{ data: ApiResponse | null; error: string | null; success: boolean }> {
    return this.http
      .put<ApiResponse>(`${this.apiUrl}/me/username`, data)
      .pipe(
        map((response) => ({ data: response, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: null,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<{ data: ApiResponse | null; error: string | null; success: boolean }>;
  }

  /**
   * تحديث رقم الهاتف
   * Update phone number
   */
  updatePhoneNumber(data: UpdatePhoneNumberDto): Promise<{ data: ApiResponse | null; error: string | null; success: boolean }> {
    return this.http
      .put<ApiResponse>(`${this.apiUrl}/me/phone`, data)
      .pipe(
        map((response) => ({ data: response, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: null,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<{ data: ApiResponse | null; error: string | null; success: boolean }>;
  }

  /**
   * تحديث رمز المصادقة
   * Refresh authentication token
   */
  refreshToken(data: RefreshTokenDto): Promise<{ data: LoginResponse | null; error: string | null; success: boolean }> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/refresh-token`, data)
      .pipe(
        map((response) => ({ data: response, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: null,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<{ data: LoginResponse | null; error: string | null; success: boolean }>;
  }

  /**
   * التحقق من حالة المصادقة
   * Check if user is authenticated
   */
  isAuthenticated(): Promise<{ data: boolean | null; error: string | null; success: boolean }> {
    return this.http
      .get<boolean>(`${this.apiUrl}/isAuth`)
      .pipe(
        map((isAuth) => ({ data: isAuth, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: false,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<{ data: boolean | null; error: string | null; success: boolean }>;
  }

  /**
   * التحقق من صلاحيات المدير
   * Check if user is admin
   */
  isAdmin(): Promise<{ data: boolean | null; error: string | null; success: boolean }> {
    return this.http
      .get<boolean>(`${this.apiUrl}/isAdmin`)
      .pipe(
        map((isAdmin) => ({ data: isAdmin, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: false,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<{ data: boolean | null; error: string | null; success: boolean }>;
  }

  /**
   * استخراج رسالة الخطأ من خطأ HTTP
   * Extract error message from HTTP error
   */
  private extractErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'error' in error) {
      const httpError = error as { error?: { message?: string } | string };
      if (typeof httpError.error === 'string') {
        return httpError.error;
      }
      if (httpError.error && typeof httpError.error === 'object' && 'message' in httpError.error) {
        return httpError.error.message as string;
      }
    }
    return 'حدث خطأ غير متوقع';
  }
}
