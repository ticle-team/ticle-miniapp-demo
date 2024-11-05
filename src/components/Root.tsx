'use client';

import '@telegram-apps/telegram-ui/dist/styles.css';
import { AppRoot, Breadcrumbs } from '@telegram-apps/telegram-ui';
import { init } from '@/core/init';
import { PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorPage } from '@/components/ErrorPage';
import { useDidMount } from '@/hooks/useDidMount';
import { ReactQueryProvider } from '@/hooks/reactQuery';
import { TelegramInit, useTelegramInit } from '@/hooks/tma';
import { ShapleAuthProvider } from '@/hooks/shaple';
import { miniApp, useLaunchParams, useSignal } from '@telegram-apps/sdk-react';
import LoadingSpinner from '@/components/LoadingSpinner';

function Layout({ children }: PropsWithChildren) {
  return (
    <ReactQueryProvider>
      <ShapleAuthProvider>
        <Suspense
          fallback={
            <LoadingSpinner className="flex m-auto w-1/4 h-1/4 justify-center items-center" />
          }
        >
          {children}
        </Suspense>
      </ShapleAuthProvider>
    </ReactQueryProvider>
  );
}

function RootInner2({ children }: PropsWithChildren) {
  const lp = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);
  const { mounted } = useTelegramInit();

  return mounted ? (
    <AppRoot
      className="flex flex-1 flex-col w-full h-full"
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <Layout>{children}</Layout>
    </AppRoot>
  ) : (
    <LoadingSpinner className="flex m-auto size-1/4 justify-center items-center" />
  );
}

function RootInner({ children }: PropsWithChildren) {
  return (
    <TelegramInit>
      <RootInner2>{children}</RootInner2>
    </TelegramInit>
  );
}

export default function Root(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of
  // the Server Side Rendering. That's why we are showing loader on the server
  // side.
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
      Loading
    </div>
  );
}
