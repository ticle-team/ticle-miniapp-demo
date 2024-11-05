'use client';

import { PropsWithChildren, Suspense, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { backButton } from '@telegram-apps/sdk-react';
import { useTelegramInit } from '@/hooks/tma';
import LoadingSpinner from '@/components/LoadingSpinner';

export function Page({
  children,
  back = true,
}: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   * @default true
   */
  back?: boolean;
}>) {
  const router = useRouter();
  const { mounted } = useTelegramInit();

  useEffect(() => {
    if (!mounted) return;

    if (back) {
      backButton.show();
    } else {
      backButton.hide();
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    return backButton.onClick(() => {
      router.back();
    });
  }, [router, mounted]);

  return <>{children}</>;
}
