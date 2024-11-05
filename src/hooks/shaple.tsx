'use client';

import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { createClient, Session, ShapleClient } from '@shaple/shaple';
import { createClientComponentClient } from '@shaple/auth-helpers-nextjs';
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { cloudStorage } from '@telegram-apps/sdk-react';

const shapleAuthContext = createContext<{ shapleClient?: ShapleClient }>({});

export function ShapleAuthProvider({ children }: PropsWithChildren) {
  const [shapleClient] = useState(() => {
    console.log('cloudStorage is supported: ', cloudStorage.isSupported());
    return createClient(
      process.env.NEXT_PUBLIC_SHAPLE_URL ?? '',
      process.env.NEXT_PUBLIC_SHAPLE_API_KEY ?? '',
      {
        auth: {
          storage: {
            ...cloudStorage,
            removeItem: cloudStorage.deleteItem,
          },
        },
      },
    );
  });

  return (
    <shapleAuthContext.Provider value={{ shapleClient }}>
      {children}
    </shapleAuthContext.Provider>
  );
}

export function useShapleAuth() {
  const { shapleClient } = useContext(shapleAuthContext);

  if (!shapleClient) {
    throw new Error('useShapleAuth must be used within a ShapleAuthProvider');
  }

  const { data: session, refetch: refetchSession } = useSuspenseQuery({
    queryKey: ['shaple.auth.session', { shapleClient }] as const,
    queryFn: async () => {
      const {
        data: { session },
        error,
      } = await shapleClient.auth.getSession();

      if (error) {
        throw error;
      }

      return session;
    },
  });

  const { mutate: signOut } = useMutation({
    mutationKey: ['shaple.auth.signOut', { shapleClient }] as const,
    mutationFn: async () => {
      const { error } = await shapleClient.auth.signOut();

      if (error) {
        throw error;
      }
    },
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => refetchSession(),
  });

  return {
    shapleClient,
    session,
    signOut,
  };
}
