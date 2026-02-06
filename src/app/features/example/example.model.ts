import { BaseModel, CreateModel } from '../../core/models/base.model';

/**
 * Example model demonstrating CRUD architecture usage
 */
export interface ExampleModel extends BaseModel {
  name: string;
  description?: string;
  status: 'active' | 'inactive';
}

// Re-export CreateModel for convenience
export type { CreateModel };
