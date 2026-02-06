import { Routes } from '@angular/router';

export const exampleRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./example-list/example-list.component').then(m => m.ExampleListComponent),
    title: 'Examples'
  },
  {
    path: 'new',
    loadComponent: () => import('./example-form/example-form.component').then(m => m.ExampleFormComponent),
    title: 'New Example'
  },
  {
    path: ':id',
    loadComponent: () => import('./example-detail/example-detail.component').then(m => m.ExampleDetailComponent),
    title: 'Example Details'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./example-form/example-form.component').then(m => m.ExampleFormComponent),
    title: 'Edit Example'
  }
];
