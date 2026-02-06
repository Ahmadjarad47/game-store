import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zoneless change detection for optimal performance
    provideZonelessChangeDetection(),
    
    // Global error handling
    provideBrowserGlobalErrorListeners(),
    
    // Router configuration with optimizations
    provideRouter(
      routes,
      withComponentInputBinding(), // Enable component input binding from route params
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withViewTransitions() // Smooth page transitions
    ),
    
    // Client-side hydration for SSR
    provideClientHydration(withEventReplay()),
    
    // HTTP client with fetch API for better performance
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),
    
    // Animations support
    provideAnimations()
  ]
};
