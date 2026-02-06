import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseModel, CreateModel, UpdateModel } from '../models/base.model';
import {
  CrudResult,
  PaginatedResponse,
  QueryParams,
  ICrudService
} from '../interfaces/crud.interface';
import { environment } from '../../../environments/environment';

/**
 * Generic base CRUD service implementation
 * Provides standard CRUD operations using Angular Signals for state management
 */
@Injectable({
  providedIn: 'root'
})
export abstract class BaseCrudService<T extends BaseModel> implements ICrudService<T> {
  protected readonly http = inject(HttpClient);
  protected abstract readonly endpoint: string;

  /**
   * Get full API URL for the endpoint
   */
  protected get apiUrl(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }

  /**
   * Get all entities with optional pagination and filtering
   */
  getAll(params?: QueryParams): Promise<PaginatedResponse<T>> {
    let httpParams = new HttpParams();

    if (params) {
      httpParams = httpParams.set('page', params.page.toString());
      httpParams = httpParams.set('limit', params.limit.toString());

      if (params.sortBy) {
        httpParams = httpParams.set('sortBy', params.sortBy);
        httpParams = httpParams.set('sortOrder', params.sortOrder || 'asc');
      }

      if (params.search) {
        httpParams = httpParams.set('search', params.search);
      }

      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            httpParams = httpParams.set(`filter[${key}]`, value.toString());
          }
        });
      }
    }

    return this.http
      .get<PaginatedResponse<T>>(this.apiUrl, { params: httpParams })
      .pipe(
        catchError(this.handleError<PaginatedResponse<T>>('getAll'))
      )
      .toPromise() as Promise<PaginatedResponse<T>>;
  }

  /**
   * Get entity by ID
   */
  getById(id: T['id']): Promise<CrudResult<T>> {
    return this.http
      .get<T>(`${this.apiUrl}/${id}`)
      .pipe(
        map((data) => ({ data, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: null,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<CrudResult<T>>;
  }

  /**
   * Create new entity
   */
  create(data: CreateModel<T>): Promise<CrudResult<T>> {
    return this.http
      .post<T>(this.apiUrl, data)
      .pipe(
        map((response) => ({ data: response, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: null,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<CrudResult<T>>;
  }

  /**
   * Update existing entity
   */
  update(id: T['id'], data: UpdateModel<T>): Promise<CrudResult<T>> {
    return this.http
      .put<T>(`${this.apiUrl}/${id}`, data)
      .pipe(
        map((response) => ({ data: response, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: null,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<CrudResult<T>>;
  }

  /**
   * Delete entity by ID
   */
  delete(id: T['id']): Promise<CrudResult<boolean>> {
    return this.http
      .delete<boolean>(`${this.apiUrl}/${id}`)
      .pipe(
        map(() => ({ data: true, error: null, success: true })),
        catchError((error) =>
          throwError(() => ({
            data: false,
            error: this.extractErrorMessage(error),
            success: false
          }))
        )
      )
      .toPromise() as Promise<CrudResult<boolean>>;
  }

  /**
   * Handle HTTP errors
   */
  protected handleError<T>(operation: string) {
    return (error: unknown): Observable<T> => {
      const errorMessage = this.extractErrorMessage(error);
      if (environment.enableDebug) {
        console.error(`${operation} failed:`, errorMessage);
      }
      return throwError(() => error);
    };
  }

  /**
   * Extract error message from HTTP error
   */
  protected extractErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'error' in error) {
      const httpError = error as { error?: { message?: string } | string };
      if (typeof httpError.error === 'string') {
        return httpError.error;
      }
      if (httpError.error && typeof httpError.error === 'object' && 'message' in httpError.error) {
        return httpError.error.message as string;
      }
    }
    return 'An unexpected error occurred';
  }
}
