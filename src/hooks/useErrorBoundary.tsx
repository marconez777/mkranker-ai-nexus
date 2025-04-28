
import { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';

export const useErrorBoundary = (fallback?: ReactNode) => {
  return {
    withErrorBoundary: (children: ReactNode) => (
      <ErrorBoundary fallback={fallback}>
        {children}
      </ErrorBoundary>
    )
  };
};
