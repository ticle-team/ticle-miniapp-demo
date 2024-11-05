'use client';

import {
  initData,
  miniApp,
  useLaunchParams,
  useSignal,
} from '@telegram-apps/sdk-react';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { AppRoot, Breadcrumbs } from '@telegram-apps/telegram-ui';
import { init } from '@/core/init';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ErrorPage } from '@/components/ErrorPage';
import { useDidMount } from '@/hooks/useDidMount';

function RootInner({ children }: PropsWithChildren) {
  const router = useRouter();
  const lp = useLaunchParams();
  const debug = lp.startParam === 'debug';
  const [initialized, setInitialized] = useState(false);

  // Initialize the library.
  useEffect(() => {
    if (initialized) return;

    const timeoutId = setTimeout(() => {
      init(false);
      setInitialized(true);
    });

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const isDark = useSignal(miniApp.isDark);

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    debug && import('eruda').then((lib) => lib.default.init());
  }, [debug]);

  return (
    <AppRoot
      className="flex flex-1 flex-col w-full h-full"
      appearance={isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <Breadcrumbs divider="chevron" className="flex p-1">
        <Breadcrumbs.Item onClick={() => router.push('/')}>/</Breadcrumbs.Item>
        <Breadcrumbs.Item onClick={() => router.push('/home')}>
          Home
        </Breadcrumbs.Item>
      </Breadcrumbs>
      {children}
    </AppRoot>
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
