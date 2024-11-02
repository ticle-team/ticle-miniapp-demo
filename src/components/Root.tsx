'use client';

import {
  initData,
  miniApp,
  useLaunchParams,
  useSignal,
} from '@telegram-apps/sdk-react';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { AppRoot, Breadcrumbs } from '@telegram-apps/telegram-ui';
import { useClientOnce } from '@/hooks/useClientOnce';
import { init } from '@/core/init';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Root({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const lp = useLaunchParams();
  const debug = lp.startParam === 'debug';

  // Initialize the library.
  useClientOnce(() => {
    init(false);
  });

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
