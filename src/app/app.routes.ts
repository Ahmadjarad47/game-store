import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/examples',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'examples',
    loadChildren: () => import('./features/example/example.routes').then(m => m.exampleRoutes)
  },
  {
    path: '**',
    redirectTo: '/examples'
  }
];
