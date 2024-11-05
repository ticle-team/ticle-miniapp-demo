'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Progress } from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page';
import { useShapleAuth } from '@/hooks/shaple';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const event = useRef<HTMLDivElement | null>(null);
  const [outlined, setOutlined] = useState(false);
  const [counter, setCounter] = useState(0);
  const { session } = useShapleAuth();

  useEffect(() => {
    if (!session) {
      router.push('/signin');
    }
  }, [session, router]);

  const onEvent = useCallback(() => {
    setCounter((c) => c + 10);
    event.current?.setAttribute('data-event', '');
    setTimeout(() => {
      event.current?.removeAttribute('data-event');
    }, 500);
  }, [event]);

  return (
    <Page back={true}>
      <div className="flex flex-col flex-1 w-full h-full justify-center items-center select-none">
        <div className="flex text-6xl text-amber-300 animate-pulse">
          ${counter}
        </div>
        <br />
        <br />
        <br />
        <div
          className="flex flex-col items-center justify-center gap-4 transition ease-in-out data-[event]:scale-125 duration-150"
          ref={event}
        >
          <Image
            unoptimized
            src={
              outlined
                ? '/img/kkuti_dog_outlined_1.png'
                : '/img/kkuti_dog_1.png'
            }
            alt="kkuti dig"
            onMouseOver={() => setOutlined(true)}
            onMouseOut={() => setOutlined(false)}
            className="max-w-40"
            onClick={() => onEvent()}
            draggable="false"
            width={200}
            height={200}
          />
        </div>
      </div>
    </Page>
  );
}
