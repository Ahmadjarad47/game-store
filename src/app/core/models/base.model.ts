/**
 * Base model interface for all entities
 * All CRUD entities should extend this interface
 */
export interface BaseModel {
  id: string | number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Generic type for entity creation (without id and timestamps)
 */
export type CreateModel<T extends BaseModel> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Generic type for entity updates (all fields optional except id)
 */
export type UpdateModel<T extends BaseModel> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>> & { id: T['id'] };
