'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Wraps a component to prevent server-side rendering
 * This is useful for components that depend on browser APIs or Firebase
 */
export function withClientOnly<P extends object>(
  Component: ComponentType<P>,
  fallback: React.ReactNode = <div>Loading...</div>
) {
  const ClientOnlyComponent = dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: () => <>{fallback}</>,
  });

  return ClientOnlyComponent;
}
