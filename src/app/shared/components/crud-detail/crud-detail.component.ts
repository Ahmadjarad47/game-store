import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseModel } from '../../../core/models/base.model';

/**
 * Generic CRUD detail component
 * Displays detailed information about a single item
 */
@Component({
  selector: 'app-crud-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './crud-detail.component.html',
  styleUrl: './crud-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrudDetailComponent<T extends BaseModel> {
  // Inputs
  readonly item = input<T | null>(null);
  readonly loading = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly editRoute = input<string>(''); // Base route for edit view
  readonly showActions = input<boolean>(true);

  // Outputs
  readonly editClick = output<T>();
  readonly deleteClick = output<T>();
  readonly backClick = output<void>();

  onEditClick(): void {
    const item = this.item();
    if (item) {
      this.editClick.emit(item);
    }
  }

  onDeleteClick(): void {
    const item = this.item();
    if (item) {
      this.deleteClick.emit(item);
    }
  }

  onBackClick(): void {
    this.backClick.emit();
  }
}
