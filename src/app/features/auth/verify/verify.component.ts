import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthState } from '../auth.state';

/**
 * مكون التحقق من الحساب
 * Verify account component
 */
@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthState);

  readonly formGroup: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    verificationCode: ['', [Validators.required]]
  });

  readonly loading = this.authState.loading;
  readonly error = this.authState.error;

  ngOnInit(): void {
    // الحصول على البريد الإلكتروني من query params
    const email = this.route.snapshot.queryParams['email'];
    if (email) {
      this.formGroup.patchValue({ email });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.valid) {
      this.authState.setLoading(true);
      this.authState.clearError();

      try {
        const result = await this.authService.verifyAccount({
          email: this.formGroup.value.email,
          verificationCode: this.formGroup.value.verificationCode
        });
        
        if (result.success && result.data) {
          // إعادة التوجيه إلى صفحة تسجيل الدخول
          this.router.navigate(['/auth/login'], {
            queryParams: { verified: 'success' }
          });
        } else {
          this.authState.setError(result.error || 'فشل التحقق من الحساب.');
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

  async resendCode(): Promise<void> {
    const email = this.formGroup.value.email;
    if (!email || !this.emailControl?.valid) {
      this.emailControl?.markAsTouched();
      return;
    }

    this.authState.setLoading(true);
    this.authState.clearError();

    try {
      const result = await this.authService.resendVerification({ email });
      
      if (result.success && result.data) {
        // يمكن إضافة رسالة نجاح هنا
        this.authState.setError(null);
      } else {
        this.authState.setError(result.error || 'فشل إعادة إرسال رمز التحقق.');
      }
    } catch (error) {
      this.authState.setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    } finally {
      this.authState.setLoading(false);
    }
  }

  get emailControl() {
    return this.formGroup.get('email');
  }

  get verificationCodeControl() {
    return this.formGroup.get('verificationCode');
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

  get verificationCodeErrors() {
    const control = this.verificationCodeControl;
    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        return 'رمز التحقق مطلوب';
      }
    }
    return null;
  }
}
