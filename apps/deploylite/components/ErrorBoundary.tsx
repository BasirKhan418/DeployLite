"use client";

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{error?: Error; resetError?: () => void}>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary Caught Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    
    this.setState({
      error,
      errorInfo
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen bg-red-50 dark:bg-red-900/20 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Something went wrong!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <>
                <details className="mb-4">
                  <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded text-sm overflow-auto">
                    {this.state.error && this.state.error.toString()}
                  </pre>
                </details>
                <details>
                  <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300">
                    Component Stack (Development Only)
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded text-sm overflow-auto">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </>
            )}
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={this.resetError}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Refresh page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{error?: Error; resetError?: () => void}>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export function safeRender(element: React.ReactNode): React.ReactNode {
  try {
    if (React.isValidElement(element)) {
      return element;
    }
    
    if (typeof element === 'function' && 'call' in element) {
      try {
        const result = (element as () => any)();
        return React.isValidElement(result) ? result : String(result);
      } catch (error) {
        console.error('Error calling function element:', error);
        return String(element);
      }
    }
    
    if (typeof element === 'object' && element !== null) {
      return JSON.stringify(element);
    }
    
    return element;
  } catch (error) {
    console.error('Error in safeRender:', error);
    return 'Render Error';
  }
}

export default ErrorBoundary;