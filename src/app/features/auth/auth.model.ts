/**
 * نماذج وواجهات المصادقة
 * Authentication models and interfaces
 */

export interface User {
  id: string | number;
  email: string;
  username?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Login DTO
export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Register DTO
export interface RegisterDto {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

// Verify Account DTO
export interface VerifyAccountDto {
  email: string;
  verificationCode: string;
}

// Resend Verification DTO
export interface ResendVerificationDto {
  email: string;
}

// Change Password DTO
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Forgot Password DTO
export interface ForgotPasswordDto {
  email: string;
}

// Reset Password DTO
export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Update Username DTO
export interface UpdateUsernameDto {
  username: string;
}

// Update Phone Number DTO
export interface UpdatePhoneNumberDto {
  phoneNumber: string;
}

// Refresh Token DTO
export interface RefreshTokenDto {
  refreshToken: string;
}

// Login Response
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthToken {
  token: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
}
