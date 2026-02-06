# Store UI - Angular 21 Standalone Application

A modern Angular 21 application built with standalone components, zoneless change detection, and signal-based state management.

## Features

- ✅ **Zoneless Change Detection** - Optimal performance with experimental zoneless change detection
- ✅ **Signal-Based State Management** - Reactive state management using Angular Signals (no NgRx)
- ✅ **Generic CRUD Architecture** - Reusable CRUD components and services
- ✅ **Lazy Loading** - Optimized route loading
- ✅ **SCSS Theme System** - Customizable theme with design tokens
- ✅ **Accessibility (a11y)** - WCAG AA compliant
- ✅ **TypeScript Strict Mode** - Type-safe development
- ✅ **SSR Support** - Server-side rendering enabled

## Project Structure

```
src/
├── app/
│   ├── core/                    # Core functionality
│   │   ├── models/              # Base models and interfaces
│   │   ├── interfaces/          # Type definitions
│   │   └── services/            # Base services (CRUD, State)
│   ├── shared/                  # Shared components and directives
│   │   ├── components/          # Reusable CRUD components
│   │   └── directives/          # Shared directives
│   ├── features/                # Feature modules
│   │   └── example/             # Example feature implementation
│   ├── app.config.ts            # Application configuration
│   └── app.routes.ts            # Route configuration
├── environments/                # Environment configurations
├── styles/                      # Global styles
│   ├── _variables.scss         # Theme variables
│   └── _mixins.scss            # SCSS mixins
└── styles.scss                  # Main stylesheet
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Navigate to `http://localhost:4200/`

### Build

```bash
# Development build
npm run build

# Production build
npm run build -- --configuration production
```

## Architecture

### CRUD Architecture

The application includes a generic, reusable CRUD architecture:

1. **Base Model** (`core/models/base.model.ts`)
   - `BaseModel` interface with common fields
   - `CreateModel` and `UpdateModel` utility types

2. **CRUD Service** (`core/services/base-crud.service.ts`)
   - Generic HTTP-based CRUD operations
   - Extend for specific entities

3. **Signal State Service** (`core/services/signal-state.service.ts`)
   - Reactive state management with Signals
   - Provides loading, error, and data signals

4. **CRUD Components**
   - `CrudListComponent` - Display list of items
   - `CrudFormComponent` - Create/edit forms
   - `CrudDetailComponent` - Detail view

### Example Usage

```typescript
// 1. Create a model
export interface Product extends BaseModel {
  name: string;
  price: number;
}

// 2. Create a service
@Injectable({ providedIn: 'root' })
export class ProductService extends BaseCrudService<Product> {
  protected override readonly endpoint = 'products';
}

// 3. Create state service
@Injectable({ providedIn: 'root' })
export class ProductState extends SignalStateService<Product> {}

// 4. Use in component
export class ProductListComponent {
  private productService = inject(ProductService);
  private productState = inject(ProductState);

  readonly products = this.productState.items;
  readonly loading = this.productState.loading;

  async loadProducts() {
    this.productState.setLoading(true);
    try {
      const response = await this.productService.getAll({ page: 1, limit: 10 });
      this.productState.setPaginationData(response);
    } catch (error) {
      this.productState.setError('Failed to load products');
    } finally {
      this.productState.setLoading(false);
    }
  }
}
```

## Theme Configuration

Theme colors and design tokens are defined in `src/styles/_variables.scss`:

- **Background**: `#ffffff`
- **Primary/Interactive**: `#002623`
- **Text**: `#161616`

Customize these variables to match your brand.

## Environment Configuration

- `src/environments/environment.ts` - Development settings
- `src/environments/environment.prod.ts` - Production settings

## Best Practices

1. **Standalone Components** - All components are standalone
2. **OnPush Change Detection** - Used in all components
3. **Signals for State** - Use signals instead of RxJS observables for state
4. **Type Safety** - Strict TypeScript configuration
5. **Accessibility** - All components follow WCAG AA standards
6. **Lazy Loading** - Feature routes are lazy loaded

## License

Private project
