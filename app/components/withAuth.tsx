"use client";
import React, { useEffect, ComponentType, useState } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAuthComponent = (props: P) => {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      let unsubscribe: (() => void) | null = null;

      // Lazy load Firebase and set up auth listener
      import('../../firebase').then(async ({ default: firebaseModule }) => {
        try {
          const { onAuthStateChanged } = await import('firebase/auth');
          const { auth } = await import('../../firebase');
          
          unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
              router.push('/login');
            }
          });
          
          setIsLoaded(true);
        } catch (error) {
          console.error('Failed to set up auth:', error);
          setIsLoaded(true);
        }
      }).catch((error) => {
        console.error('Failed to load Firebase:', error);
        setIsLoaded(true);
      });

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }, [router]);

    // Don't render wrapped component until auth is loaded
    if (!isLoaded) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
