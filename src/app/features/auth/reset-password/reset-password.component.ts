import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthState } from '../auth.state';

/**
 * مكون إعادة تعيين كلمة المرور
 * Reset password component
 */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthState);

  readonly formGroup: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    token: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  readonly loading = this.authState.loading;
  readonly error = this.authState.error;

  ngOnInit(): void {
    // الحصول على البريد الإلكتروني والرمز من query params
    const email = this.route.snapshot.queryParams['email'];
    const token = this.route.snapshot.queryParams['token'];
    
    if (email) {
      this.formGroup.patchValue({ email });
    }
    if (token) {
      this.formGroup.patchValue({ token });
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.valid) {
      this.authState.setLoading(true);
      this.authState.clearError();

      try {
        const result = await this.authService.resetPassword({
          email: this.formGroup.value.email,
          token: this.formGroup.value.token,
          newPassword: this.formGroup.value.newPassword,
          confirmPassword: this.formGroup.value.confirmPassword
        });
        
        if (result.success && result.data) {
          // إعادة التوجيه إلى صفحة تسجيل الدخول
          this.router.navigate(['/auth/login'], {
            queryParams: { passwordReset: 'success' }
          });
        } else {
          this.authState.setError(result.error || 'فشل إعادة تعيين كلمة المرور.');
        }
      } catch (error) {
        this.authState.setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      } finally {
        this.authState.setLoading(false);
      }
    } else {
      Object.keys(this.formGroup.controls).forEach(key => {
        this.formGroup.get(key)?.markAsTouched();
      });
    }
  }

  get emailControl() {
    return this.formGroup.get('email');
  }

  get tokenControl() {
    return this.formGroup.get('token');
  }

  get newPasswordControl() {
    return this.formGroup.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.formGroup.get('confirmPassword');
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

  get tokenErrors() {
    const control = this.tokenControl;
    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        return 'رمز إعادة التعيين مطلوب';
      }
    }
    return null;
  }

  get newPasswordErrors() {
    const control = this.newPasswordControl;
    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        return 'كلمة المرور الجديدة مطلوبة';
      }
      if (control.errors?.['minlength']) {
        return 'يجب أن تكون كلمة المرور 6 أحرف على الأقل';
      }
      if (control.errors?.['maxlength']) {
        return 'يجب ألا تتجاوز كلمة المرور 100 حرف';
      }
    }
    return null;
  }

  get confirmPasswordErrors() {
    const control = this.confirmPasswordControl;
    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        return 'تأكيد كلمة المرور مطلوب';
      }
    }
    if (this.formGroup.errors?.['passwordMismatch'] && this.confirmPasswordControl?.touched) {
      return 'كلمات المرور غير متطابقة';
    }
    return null;
  }
}
