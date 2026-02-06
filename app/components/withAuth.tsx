"use client";
import React, { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../firebase';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAuthComponent = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const auth = getAuth(app);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push('/login');
        }
      });

      return () => unsubscribe();
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
