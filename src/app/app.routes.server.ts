import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // المسارات الديناميكية تحتاج إلى Server rendering
  {
    path: 'examples/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'examples/:id/edit',
    renderMode: RenderMode.Server
  },
  // المسارات الثابتة يمكن استخدام Prerender
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
