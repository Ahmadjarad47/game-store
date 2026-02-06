import { Injectable, signal, computed, Signal } from '@angular/core';
import { BaseModel } from '../models/base.model';
import { CrudResult, PaginatedResponse, QueryParams } from '../interfaces/crud.interface';

/**
 * Generic signal-based state management service
 * Provides reactive state management using Angular Signals
 */
@Injectable({
  providedIn: 'root'
})
export class SignalStateService<T extends BaseModel> {
  // State signals
  private readonly _items = signal<T[]>([]);
  private readonly _selectedItem = signal<T | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _total = signal<number>(0);
  private readonly _page = signal<number>(1);
  private readonly _limit = signal<number>(10);

  // Public readonly signals
  readonly items: Signal<T[]> = this._items.asReadonly();
  readonly selectedItem: Signal<T | null> = this._selectedItem.asReadonly();
  readonly loading: Signal<boolean> = this._loading.asReadonly();
  readonly error: Signal<string | null> = this._error.asReadonly();
  readonly total: Signal<number> = this._total.asReadonly();
  readonly page: Signal<number> = this._page.asReadonly();
  readonly limit: Signal<number> = this._limit.asReadonly();

  // Computed signals
  readonly hasItems = computed(() => this._items().length > 0);
  readonly isEmpty = computed(() => this._items().length === 0);
  readonly totalPages = computed(() => Math.ceil(this._total() / this._limit()));
  readonly hasNextPage = computed(() => this._page() < this.totalPages());
  readonly hasPreviousPage = computed(() => this._page() > 1);

  /**
   * Set items directly
   */
  setItems(items: T[]): void {
    this._items.set(items);
  }

  /**
   * Update items (add, replace, or remove)
   */
  updateItems(updater: (items: T[]) => T[]): void {
    this._items.update(updater);
  }

  /**
   * Add item to the list
   */
  addItem(item: T): void {
    this._items.update((items) => [...items, item]);
  }

  /**
   * Update item in the list
   */
  updateItem(id: T['id'], updater: (item: T) => T): void {
    this._items.update((items) =>
      items.map((item) => (item.id === id ? updater(item) : item))
    );
  }

  /**
   * Remove item from the list
   */
  removeItem(id: T['id']): void {
    this._items.update((items) => items.filter((item) => item.id !== id));
  }

  /**
   * Set selected item
   */
  setSelectedItem(item: T | null): void {
    this._selectedItem.set(item);
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  /**
   * Set error message
   */
  setError(error: string | null): void {
    this._error.set(error);
  }

  /**
   * Set pagination data
   */
  setPaginationData(response: PaginatedResponse<T>): void {
    this._items.set(response.data);
    this._total.set(response.total);
    this._page.set(response.page);
    this._limit.set(response.limit);
  }

  /**
   * Set page
   */
  setPage(page: number): void {
    this._page.set(page);
  }

  /**
   * Set limit
   */
  setLimit(limit: number): void {
    this._limit.set(limit);
  }

  /**
   * Reset all state
   */
  reset(): void {
    this._items.set([]);
    this._selectedItem.set(null);
    this._loading.set(false);
    this._error.set(null);
    this._total.set(0);
    this._page.set(1);
    this._limit.set(10);
  }

  /**
   * Clear error
   */
  clearError(): void {
    this._error.set(null);
  }
}
