import React from 'react';

/**
 * Global Fallback Error Boundary 
 * Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI natively.
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // In Phase 2: Pipe this error directly to Sentry or another logging system
    console.error('Uncaught React Rendering Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-slate-800 dark:text-slate-200">
          <h1 className="text-3xl font-extrabold text-danger-600 dark:text-danger-400 mb-4">
            A System Error Occurred
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
            Our app encountered an unexpected issue while attempting to render this interface. 
            If you are in an emergency, please refresh the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-med-600 hover:bg-med-700 text-white font-bold rounded-lg transition-colors"
          >
            Refresh Interface
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
