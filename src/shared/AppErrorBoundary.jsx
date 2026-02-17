import { Component } from "react";

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled application error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="state-card" role="alert">
          <h1>Something went wrong</h1>
          <p>There was an unexpected application error.</p>
          {this.state.error?.message ? (
            <p className="state-card__subtle">{this.state.error.message}</p>
          ) : null}
          <button type="button" className="button button--primary" onClick={() => window.location.reload()}>
            Reload app
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
