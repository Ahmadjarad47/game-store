import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthState } from '../auth.state';

/**
 * مكون التسجيل
 * Register component - Handles user registration
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly authState = inject(AuthState);

  readonly formGroup: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  readonly loading = this.authState.loading;
  readonly error = this.authState.error;

  ngOnInit(): void {
    // إذا كان المستخدم مسجلاً بالفعل، إعادة التوجيه إلى الصفحة الرئيسية
    if (this.authState.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.valid) {
      this.authState.setLoading(true);
      this.authState.clearError();

      try {
        const registerData = {
          username: this.formGroup.value.username,
          email: this.formGroup.value.email,
          phoneNumber: this.formGroup.value.phoneNumber,
          password: this.formGroup.value.password,
          confirmPassword: this.formGroup.value.confirmPassword
        };

        const result = await this.authService.register(registerData);
        
        if (result.success && result.data) {
          // إعادة التوجيه إلى صفحة التحقق
          this.router.navigate(['/auth/verify'], { 
            queryParams: { email: registerData.email } 
          });
        } else {
          this.authState.setError(result.error || 'فشل التسجيل. يرجى المحاولة مرة أخرى.');
        }
      } catch (error) {
        this.authState.setError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      } finally {
        this.authState.setLoading(false);
      }
    } else {
      // وضع علامة على جميع الحقول كملموسة لإظهار أخطاء التحقق
      Object.keys(this.formGroup.controls).forEach(key => {
        this.formGroup.get(key)?.markAsTouched();
      });
    }
  }

  get usernameControl() {
    return this.formGroup.get('username');
  }

  get emailControl() {
    return this.formGroup.get('email');
  }

  get phoneNumberControl() {
    return this.formGroup.get('phoneNumber');
  }

  get passwordControl() {
    return this.formGroup.get('password');
  }

  get confirmPasswordControl() {
    return this.formGroup.get('confirmPassword');
  }

  get usernameErrors() {
    const control = this.usernameControl;
    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        return 'اسم المستخدم مطلوب';
      }
      if (control.errors?.['minlength']) {
        return 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل';
      }
      if (control.errors?.['maxlength']) {
        return 'يجب ألا يتجاوز اسم المستخدم 50 حرفاً';
      }
    }
    return null;
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

  get phoneNumberErrors() {
    const control = this.phoneNumberControl;
    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        return 'رقم الهاتف مطلوب';
      }
      if (control.errors?.['minlength']) {
        return 'يجب أن يكون رقم الهاتف 10 أرقام على الأقل';
      }
      if (control.errors?.['maxlength']) {
        return 'يجب ألا يتجاوز رقم الهاتف 20 رقماً';
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
