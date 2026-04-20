import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

export const RouteErrorFallback = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <section className="state-card" role="alert">
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>
        <Link to="/todos" className="button button--primary">
          Back to todos
        </Link>
      </section>
    );
  }
  const message = error instanceof Error ? error.message : 'Unknown route error.'

  return (
    <section className="state-card" role="alert">
      <h1>Route failed to load</h1>
      <p>{message}</p>
      <Link to="/todos" className="button button--primary">
        Back to todos
      </Link>
    </section>
  );
};
