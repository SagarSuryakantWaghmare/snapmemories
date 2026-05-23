'use client';

import { ReactNode, Component, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error, this.reset) ?? (
          <div className="flex min-h-screen w-full items-center justify-center p-5">
            <div className="w-full max-w-md rounded-3xl border border-line bg-card p-7 shadow-card">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-accent-soft">
                <svg
                  className="h-6 w-6 text-accent-deep"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-center font-display text-2xl text-ink">Something went wrong</h2>
              <p className="mt-2 text-center text-sm text-ink-soft">
                The booth hit an unexpected snag. Try again, or head back home.
              </p>
              <p className="mt-4 max-h-24 overflow-auto break-words rounded-xl bg-paper-deep p-3 font-mono text-xs text-ink-soft">
                {this.state.error.message}
              </p>
              <div className="mt-5 flex gap-2.5">
                <button
                  type="button"
                  onClick={this.reset}
                  className="min-h-12 flex-1 rounded-full bg-accent px-4 text-sm font-semibold text-white shadow-accent transition-[background-color,box-shadow,transform] hover:bg-accent-deep active:scale-[0.98]"
                  aria-label="Try again"
                >
                  Try again
                </button>
                <button
                  type="button"
                  onClick={() => (window.location.href = '/')}
                  className="min-h-12 flex-1 rounded-full border border-line bg-card px-4 text-sm font-semibold text-ink transition-[background-color,box-shadow,transform] hover:bg-paper-soft active:scale-[0.98]"
                  aria-label="Go home"
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
