import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthState } from '../auth.state';

/**
 * Login component
 * Handles user authentication
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthState);

  readonly formGroup: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  readonly loading = this.authState.loading;
  readonly error = this.authState.error;

  ngOnInit(): void {
    // If already authenticated, redirect to home
    if (this.authState.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.valid) {
      this.authState.setLoading(true);
      this.authState.clearError();

      try {
        const credentials = {
          email: this.formGroup.value.email,
          password: this.formGroup.value.password,
          rememberMe: this.formGroup.value.rememberMe || false
        };

        const result = await this.authService.login(credentials);
        
        if (result.success && result.data) {
          this.authState.setAuthData(result.data);
          // إعادة التوجيه إلى الصفحة الرئيسية أو الصفحة السابقة
          const returnUrl = this.router.url === '/auth/login' ? '/' : this.router.url;
          this.router.navigate([returnUrl]);
        } else {
          this.authState.setError(result.error || 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.');
        }
      } catch (error) {
        this.authState.setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      } finally {
        this.authState.setLoading(false);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.formGroup.controls).forEach(key => {
        this.formGroup.get(key)?.markAsTouched();
      });
    }
  }

  get emailControl() {
    return this.formGroup.get('email');
  }

  get passwordControl() {
    return this.formGroup.get('password');
  }

  get emailErrors() {
    const control = this.emailControl;
    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        return 'البريد الإلكتروني مطلوب';
      }
      if (control.errors?.['email']) {
        return 'يرجى إدخال عنوان بريد إلكتروني صحيح';
      }
    }
    return null;
  }

  get passwordErrors() {
    const control = this.passwordControl;
    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        return 'كلمة المرور مطلوبة';
      }
      if (control.errors?.['minlength']) {
        return 'يجب أن تكون كلمة المرور 6 أحرف على الأقل';
      }
    }
    return null;
  }
}
