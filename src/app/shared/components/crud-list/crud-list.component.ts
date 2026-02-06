import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseModel } from '../../../core/models/base.model';

/**
 * Generic CRUD list component
 * Displays a list of items with actions
 */
@Component({
  selector: 'app-crud-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './crud-list.component.html',
  styleUrl: './crud-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrudListComponent<T extends BaseModel> {
  // Inputs
  readonly items = input.required<T[]>();
  readonly loading = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly emptyMessage = input<string>('No items found');
  readonly showActions = input<boolean>(true);
  readonly detailRoute = input<string>(''); // Base route for detail view
  readonly editRoute = input<string>(''); // Base route for edit view

  // Outputs
  readonly itemClick = output<T>();
  readonly editClick = output<T>();
  readonly deleteClick = output<T>();
  readonly refreshClick = output<void>();

  // Computed
  readonly hasItems = computed(() => this.items().length > 0);
  readonly isEmpty = computed(() => !this.loading() && this.items().length === 0);

  onItemClick(item: T): void {
    this.itemClick.emit(item);
  }

  onEditClick(item: T, event: Event): void {
    event.stopPropagation();
    this.editClick.emit(item);
  }

  onDeleteClick(item: T, event: Event): void {
    event.stopPropagation();
    this.deleteClick.emit(item);
  }

  onRefreshClick(): void {
    this.refreshClick.emit();
  }
}
