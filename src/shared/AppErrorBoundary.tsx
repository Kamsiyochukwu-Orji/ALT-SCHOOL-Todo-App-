import { Component } from "react";
import type {ReactNode, ErrorInfo} from 'react'

interface AppErrorBoundaryProps{
  children: ReactNode;
}

interface AppErrorBoundaryState{
  hasError: boolean;
  error: Error | null;
}



export class AppErrorBoundary extends Component<AppErrorBoundaryProps,AppErrorBoundaryState> {
  constructor(props:AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error:Error, info:ErrorInfo):void {
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
