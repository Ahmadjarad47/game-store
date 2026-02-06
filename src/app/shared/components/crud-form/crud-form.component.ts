import { Component, input, output, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseModel, CreateModel } from '../../../core/models/base.model';

/**
 * Generic CRUD form component
 * Provides a reusable form structure for create and edit operations
 */
@Component({
  selector: 'app-crud-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crud-form.component.html',
  styleUrl: './crud-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrudFormComponent<T extends BaseModel> {
  // Inputs
  readonly formGroup = input.required<FormGroup>();
  readonly loading = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly submitLabel = input<string>('Submit');
  readonly cancelLabel = input<string>('Cancel');
  readonly showCancel = input<boolean>(true);

  // Outputs
  readonly formSubmit = output<FormGroup>();
  readonly formCancel = output<void>();

  constructor() {
    // Clear error when form is submitted
    effect(() => {
      if (this.loading()) {
        // Error will be cleared by parent component
      }
    });
  }

  onSubmit(): void {
    if (this.formGroup().valid) {
      this.formSubmit.emit(this.formGroup());
    } else {
      this.markFormGroupTouched(this.formGroup());
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  /**
   * Mark all form controls as touched to show validation errors
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
