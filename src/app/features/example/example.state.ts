import { Injectable } from '@angular/core';
import { SignalStateService } from '../../core/services/signal-state.service';
import { ExampleModel } from './example.model';

/**
 * Example state service demonstrating signal-based state management
 */
@Injectable({
  providedIn: 'root'
})
export class ExampleState extends SignalStateService<ExampleModel> {}
