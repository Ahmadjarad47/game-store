import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CrudFormComponent } from '../../../shared/components/crud-form/crud-form.component';
import { ExampleService } from '../example.service';
import { ExampleState } from '../example.state';
import { ExampleModel, CreateModel } from '../example.model';

/**
 * Example form component demonstrating CRUD form usage
 */
@Component({
  selector: 'app-example-form',
  imports: [CommonModule, ReactiveFormsModule, CrudFormComponent],
  templateUrl: './example-form.component.html',
  styleUrl: './example-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly exampleService = inject(ExampleService);
  private readonly exampleState = inject(ExampleState);

  readonly formGroup: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    status: ['active', Validators.required]
  });

  readonly loading = this.exampleState.loading;
  readonly error = this.exampleState.error;
  readonly isEditMode = this.route.snapshot.params['id'] !== undefined;
  private itemId: string | number | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.itemId = id;
      this.loadItem(id);
    }
  }

  async loadItem(id: string | number): Promise<void> {
    this.exampleState.setLoading(true);
    this.exampleState.clearError();

    try {
      const result = await this.exampleService.getById(id);
      if (result.success && result.data) {
        this.formGroup.patchValue(result.data);
      } else {
        this.exampleState.setError(result.error || 'Failed to load item');
      }
    } catch (error) {
      this.exampleState.setError('Failed to load item');
    } finally {
      this.exampleState.setLoading(false);
    }
  }

  async onSubmit(formGroup: FormGroup): Promise<void> {
    if (formGroup.valid) {
      this.exampleState.setLoading(true);
      this.exampleState.clearError();

      try {
        const formValue = formGroup.value;

        if (this.isEditMode && this.itemId) {
          const result = await this.exampleService.update(this.itemId, formValue);
          if (result.success && result.data) {
            this.exampleState.updateItem(this.itemId, () => result.data!);
            this.router.navigate(['/examples']);
          } else {
            this.exampleState.setError(result.error || 'Failed to save item');
          }
        } else {
          const result = await this.exampleService.create(formValue as CreateModel<ExampleModel>);
          if (result.success && result.data) {
            this.exampleState.addItem(result.data);
            this.router.navigate(['/examples']);
          } else {
            this.exampleState.setError(result.error || 'Failed to save item');
          }
        }
      } catch (error) {
        this.exampleState.setError('Failed to save item');
      } finally {
        this.exampleState.setLoading(false);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/examples']);
  }
}
