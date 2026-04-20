import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "./shared/AppLayout";
import { ProtectedRoute } from "./shared/ProtectedRoute";
import { RouteErrorFallback } from "./shared/RouteErrorFallback";

const TodosPage = lazy(() => import("./views/TodosPage"));
const TodoDetailsPage = lazy(() => import("./views/TodoDetailsPage"));
const NotFoundPage = lazy(() => import("./views/NotFoundPage"));
const TestErrorPage = lazy(() => import("./views/TestErrorPage"));
const LoginPage = lazy(() => import("./views/LoginPage"));
const SignupPage = lazy(() => import("./views/SignupPage"));

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true, element: <Navigate to="/todos" replace /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      {
        path: "todos",
        element: <TodosPage />,
        children: [{ path: ":todoId", element: <TodoDetailsPage /> }],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "my-tasks",
            element: <TodosPage />,
            children: [{ path: ":todoId", element: <TodoDetailsPage /> }],
          },
          { path: "test-error", element: <TestErrorPage /> },
        ],
      },
      {
        path: "logout",
        element: <Navigate to="/login" replace />,
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
