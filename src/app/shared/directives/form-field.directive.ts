import { Directive, input, computed } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * Form field directive for consistent form field styling and validation display
 */
@Directive({
  selector: '[appFormField]',
  standalone: true,
  host: {
    '[class.form-field]': 'true',
    '[class.form-field-invalid]': 'isInvalid()',
    '[class.form-field-required]': 'isRequired()'
  }
})
export class FormFieldDirective {
  readonly control = input<AbstractControl | null>(null);
  readonly label = input<string>('');
  readonly required = input<boolean>(false);

  readonly isInvalid = computed(() => {
    const ctrl = this.control();
    return ctrl ? ctrl.invalid && (ctrl.dirty || ctrl.touched) : false;
  });

  readonly isRequired = computed(() => this.required());
}
