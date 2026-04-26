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
          <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md bg-white rounded-2xl p-6 shadow-lg border border-gray-300">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              <p className="text-xs text-gray-500 bg-gray-50 rounded p-3 mb-4 font-mono break-words max-h-24 overflow-auto">
                {this.state.error.message}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={this.reset}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 active:scale-95 font-medium text-sm transition-colors"
                  aria-label="Try again"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => (window.location.href = '/')}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 active:scale-95 font-medium text-sm transition-colors"
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
