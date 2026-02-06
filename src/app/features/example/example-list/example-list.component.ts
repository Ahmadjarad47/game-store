import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExampleService } from '../example.service';
import { ExampleState } from '../example.state';
import { ExampleModel } from '../example.model';

/**
 * Example list component demonstrating CRUD list usage
 */
@Component({
  selector: 'app-example-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './example-list.component.html',
  styleUrl: './example-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleListComponent implements OnInit {
  private readonly exampleService = inject(ExampleService);
  private readonly exampleState = inject(ExampleState);

  // Expose signals to template
  readonly items = this.exampleState.items;
  readonly loading = this.exampleState.loading;
  readonly error = this.exampleState.error;

  ngOnInit(): void {
    this.loadExamples();
  }

  async loadExamples(): Promise<void> {
    this.exampleState.setLoading(true);
    this.exampleState.clearError();

    try {
      const response = await this.exampleService.getAll({ page: 1, limit: 10 });
      this.exampleState.setPaginationData(response);
    } catch (error) {
      this.exampleState.setError('Failed to load examples');
    } finally {
      this.exampleState.setLoading(false);
    }
  }

  onItemClick(item: ExampleModel): void {
    // Handle item click
    console.log('Item clicked:', item);
  }

  onEditClick(item: ExampleModel): void {
    // Navigation handled by routerLink in template
  }

  async onDeleteClick(item: ExampleModel): Promise<void> {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      this.exampleState.setLoading(true);
      try {
        const result = await this.exampleService.delete(item.id);
        if (result.success) {
          this.exampleState.removeItem(item.id);
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

  onRefreshClick(): void {
    this.loadExamples();
  }
}
