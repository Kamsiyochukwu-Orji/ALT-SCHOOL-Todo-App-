import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { appRouter } from "./router";
import { AppErrorBoundary } from "./shared/AppErrorBoundary";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
const rootElement = document.getElementById('root') 
if(!rootElement){
  throw new Error("Root element not found. Ensure index.html contains <div id=root></div>")
}
createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <AppErrorBoundary>
            <Suspense fallback={<p className="app-loading">Loading application...</p>}>
              <RouterProvider router={appRouter} />
            </Suspense>
          </AppErrorBoundary>
        </QueryClientProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);
