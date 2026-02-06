import { Injectable } from '@angular/core';
import { BaseCrudService } from '../../core/services/base-crud.service';
import { ExampleModel } from './example.model';

/**
 * Example service demonstrating CRUD service usage
 * Extends BaseCrudService with specific endpoint
 */
@Injectable({
  providedIn: 'root'
})
export class ExampleService extends BaseCrudService<ExampleModel> {
  protected override readonly endpoint = 'examples';
}
