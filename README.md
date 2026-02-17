# Altodo - React Todo Application

## Project Description
Altodo is a Todo application built with React that demonstrates:

- API integration with a remote Todos service
- Client-side routing with nested details pages
- React patterns such as hooks, Suspense, and Error Boundaries
- Search, filtering, and pagination
- Accessible and responsive interface patterns
- Create, edit, and delete Todo operations

## Features Implemented

### Required Features
- Task list fetched from `https://api.oluwasetemi.dev/tasks`
- Pagination (10 items per page)
- Search by title and status filtering (`all`, `TODO`, `IN_PROGRESS`, `DONE`, `CANCELLED`)
- Nested route for task details (`/todos/:todoId`)
- Loading states and API error states
- App-level Error Boundary and route error fallback
- Dedicated test route to trigger error handling (`/test-error`)
- Custom 404 page
- Semantic HTML, skip link, accessible labels, ARIA attributes, and keyboard-focus styles
- Responsive design for mobile and desktop

### Bonus Feature Implemented
- CRUD operations:
  - Create Todo (modal form)
  - Update Todo (modal form)
  - Delete Todo (confirmation dialog)
- API authentication:
  - Register page (`POST /auth/register`)
  - Login page (`POST /auth/login`)
  - Session bootstrap with `GET /auth/me`
  - Automatic access-token refresh with `POST /auth/refresh`
  - Protected app routes
  - Logout from top navigation

## Technology Choices
- **React 19**: Functional components and hooks for composable UI logic
- **React Router**: Route layouts, nested routes, route-level fallback handling
- **TanStack Query**: Data fetching, caching, invalidation after mutations
- **Axios**: API client with a shared base URL and concise request helpers
- **react-helmet-async**: Route/page metadata management for SEO title and description
- **Vanilla CSS**: Single consistent styling approach with reusable component classes

## Setup Instructions

### Prerequisites
- Node.js 20+
- npm 10+

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## Available Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Create optimized production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

## Routes
- `/todos` - Main list page with search, filters, pagination, and CRUD actions
- `/todos/:todoId` - Nested details view for a selected task
- `/login` - API email/password authentication page
- `/signup` - API account creation page
- `/test-error` - Throws an intentional runtime error to validate Error Boundary behavior
- Any unknown route - Custom 404 page

## SEO and Accessibility
- Page-specific document title and description metadata
- Semantic structures (`header`, `nav`, `main`, `section`, `article`, `form`)
- Skip-to-content link
- Focus-visible styles for keyboard users
- Form labels and live regions for status updates
- Confirmation dialogs and modal semantics

## Screenshots / GIFs
Add screenshots or GIFs to `docs/` and reference them here.

Example placeholders:
- `docs/todos-list.png` - Todo list with filters and pagination
- `docs/todo-details.png` - Nested details panel
- `docs/create-todo.gif` - Create flow
- `docs/edit-delete-todo.gif` - Edit/Delete flow

## Known Issues
- API response shapes may vary; normalization is implemented, but uncommon payload differences may require additional mapping.
- WebSocket real-time updates are not included.

## Future Improvements
- Add real-time task updates via `ws://api.oluwasetemi.dev/ws/tasks`
- Add optimistic updates for mutations
- Add offline support with persistent query cache
- Add comprehensive unit/integration tests
