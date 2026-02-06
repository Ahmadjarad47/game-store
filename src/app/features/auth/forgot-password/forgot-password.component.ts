import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthState } from '../auth.state';

/**
 * مكون نسيان كلمة المرور
 * Forgot password component
 */
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthState);

  readonly formGroup: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  readonly loading = this.authState.loading;
  readonly error = this.authState.error;
  readonly success = this.authState.error; // We'll use a separate signal for success

  async onSubmit(): Promise<void> {
    if (this.formGroup.valid) {
      this.authState.setLoading(true);
      this.authState.clearError();

      try {
        const result = await this.authService.forgotPassword({
          email: this.formGroup.value.email
        });
        
        if (result.success && result.data) {
          // إعادة التوجيه إلى صفحة إعادة تعيين كلمة المرور
          this.router.navigate(['/auth/reset-password'], {
            queryParams: { email: this.formGroup.value.email }
          });
        } else {
          this.authState.setError(result.error || 'فشل إرسال رابط إعادة تعيين كلمة المرور.');
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
}
