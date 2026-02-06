import { BaseModel, CreateModel, UpdateModel } from '../models/base.model';

/**
 * CRUD operation result wrapper
 */
export interface CrudResult<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Filter parameters
 */
export interface FilterParams {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Query parameters combining pagination and filters
 */
export interface QueryParams extends PaginationParams {
  filters?: FilterParams;
  search?: string;
}

/**
 * CRUD service interface
 */
export interface ICrudService<T extends BaseModel> {
  getAll(params?: QueryParams): Promise<PaginatedResponse<T>>;
  getById(id: T['id']): Promise<CrudResult<T>>;
  create(data: CreateModel<T>): Promise<CrudResult<T>>;
  update(id: T['id'], data: UpdateModel<T>): Promise<CrudResult<T>>;
  delete(id: T['id']): Promise<CrudResult<boolean>>;
}
