# Architecture Documentation

## Overview

This Angular 21 application follows modern best practices with standalone components, zoneless change detection, and signal-based state management.

## Key Features

### 1. Zoneless Change Detection
- Enabled via `provideExperimentalZonelessChangeDetection()` in `app.config.ts`
- Improves performance by eliminating Zone.js overhead
- All components use `ChangeDetectionStrategy.OnPush` for optimal performance

### 2. Signal-Based State Management
- No NgRx dependency
- Uses Angular Signals for reactive state management
- `SignalStateService<T>` provides generic state management for any entity type
- Signals can be set or updated directly using `set()` and `update()` methods

### 3. Generic CRUD Architecture

#### Core Components

**Base Model** (`core/models/base.model.ts`)
```typescript
interface BaseModel {
  id: string | number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
```

**CRUD Service** (`core/services/base-crud.service.ts`)
- Generic HTTP-based CRUD operations
- Extend for specific entities by setting the `endpoint` property
- Returns typed `CrudResult<T>` and `PaginatedResponse<T>`

**Signal State Service** (`core/services/signal-state.service.ts`)
- Manages loading, error, and data states using Signals
- Provides computed signals for derived state
- Methods: `setItems()`, `updateItems()`, `addItem()`, `updateItem()`, `removeItem()`

#### Shared Components

**CrudListComponent**
- Displays list of items with loading/error states
- Supports custom item rendering via content projection
- Handles edit/delete actions

**CrudFormComponent**
- Generic form wrapper with validation
- Handles form submission and cancellation
- Supports loading and error states

**CrudDetailComponent**
- Displays detailed information about a single item
- Supports edit and delete actions
- Handles loading and error states

### 4. Folder Structure

```
src/app/
├── core/                    # Core functionality (models, services, interfaces)
│   ├── models/
│   ├── interfaces/
│   └── services/
├── shared/                  # Shared components and directives
│   ├── components/
│   └── directives/
└── features/                # Feature modules
    └── example/             # Example feature implementation
```

### 5. Routing & Lazy Loading

- All feature routes are lazy loaded using `loadChildren` or `loadComponent`
- Route configuration in `app.routes.ts` uses modern Angular routing features
- Component input binding enabled for route parameters

### 6. Styling System

**SCSS Architecture**
- `_variables.scss` - Theme variables and design tokens
- `_mixins.scss` - Reusable SCSS mixins
- `styles.scss` - Global styles and base styles

**Theme Colors**
- Background: `#ffffff`
- Primary/Interactive: `#002623`
- Text: `#161616`

### 7. Environment Configuration

- `environment.ts` - Development settings
- `environment.prod.ts` - Production settings
- API URL configuration per environment

### 8. Build Optimization

**Production Build Settings**
- Script optimization enabled
- Style minification with inline critical CSS
- Font optimization
- Source maps disabled
- Build optimizer enabled
- Vendor chunk disabled for smaller bundles

## Usage Examples

### Creating a New CRUD Feature

1. **Define the Model**
```typescript
export interface Product extends BaseModel {
  name: string;
  price: number;
  category: string;
}
```

2. **Create the Service**
```typescript
@Injectable({ providedIn: 'root' })
export class ProductService extends BaseCrudService<Product> {
  protected override readonly endpoint = 'products';
}
```

3. **Create the State Service**
```typescript
@Injectable({ providedIn: 'root' })
export class ProductState extends SignalStateService<Product> {}
```

4. **Use in Component**
```typescript
export class ProductListComponent {
  private productService = inject(ProductService);
  private productState = inject(ProductState);

  readonly products = this.productState.items;
  readonly loading = this.productState.loading;

  async loadProducts() {
    this.productState.setLoading(true);
    const response = await this.productService.getAll({ page: 1, limit: 10 });
    this.productState.setPaginationData(response);
    this.productState.setLoading(false);
  }
}
```

## Best Practices

1. **Always use standalone components** - No NgModules
2. **Use OnPush change detection** - Required for zoneless mode
3. **Use Signals for state** - Prefer signals over RxJS observables for state
4. **Type everything** - Strict TypeScript configuration
5. **Follow accessibility guidelines** - WCAG AA compliance
6. **Lazy load features** - All feature routes should be lazy loaded
7. **Use providedIn: 'root'** - For singleton services
8. **Extend base classes** - Use BaseCrudService and SignalStateService

## Performance Considerations

- Zoneless change detection reduces overhead
- OnPush change detection minimizes change detection cycles
- Lazy loading reduces initial bundle size
- Signal-based state management is more efficient than observables
- Production builds are optimized for size and performance

## Accessibility

- All interactive elements have proper ARIA attributes
- Focus management implemented
- Keyboard navigation supported
- Color contrast meets WCAG AA standards
- Skip links for screen readers
