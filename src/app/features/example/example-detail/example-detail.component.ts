import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudDetailComponent } from '../../../shared/components/crud-detail/crud-detail.component';
import { ExampleService } from '../example.service';
import { ExampleState } from '../example.state';
import { ExampleModel } from '../example.model';

/**
 * Example detail component demonstrating CRUD detail usage
 */
@Component({
  selector: 'app-example-detail',
  imports: [CommonModule, CrudDetailComponent, DatePipe],
  templateUrl: './example-detail.component.html',
  styleUrl: './example-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleDetailComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly exampleService = inject(ExampleService);
  private readonly exampleState = inject(ExampleState);

  readonly item = this.exampleState.selectedItem;
  readonly loading = this.exampleState.loading;
  readonly error = this.exampleState.error;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadItem(id);
    }
  }

  async loadItem(id: string | number): Promise<void> {
    this.exampleState.setLoading(true);
    this.exampleState.clearError();

    try {
      const result = await this.exampleService.getById(id);
      if (result.success && result.data) {
        this.exampleState.setSelectedItem(result.data);
      } else {
        this.exampleState.setError(result.error || 'Failed to load item');
      }
    } catch (error) {
      this.exampleState.setError('Failed to load item');
    } finally {
      this.exampleState.setLoading(false);
    }
  }

  onEditClick(): void {
    const item = this.item();
    if (item) {
      this.router.navigate(['/examples', item.id, 'edit']);
    }
  }

  async onDeleteClick(): Promise<void> {
    const item = this.item();
    if (item && confirm(`Are you sure you want to delete "${item.name}"?`)) {
      this.exampleState.setLoading(true);
      try {
        const result = await this.exampleService.delete(item.id);
        if (result.success) {
          this.router.navigate(['/examples']);
        } else {
          this.exampleState.setError(result.error || 'Failed to delete item');
        }
      } catch (error) {
        this.exampleState.setError('Failed to delete item');
      } finally {
        this.exampleState.setLoading(false);
      }
    }
  }

  onBackClick(): void {
    this.router.navigate(['/examples']);
  }
}
