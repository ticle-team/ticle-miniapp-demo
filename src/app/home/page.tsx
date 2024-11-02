'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Progress } from '@telegram-apps/telegram-ui';

export default function Page() {
  const event = useRef<HTMLDivElement | null>(null);
  const [outlined, setOutlined] = useState(false);
  const [counter, setCounter] = useState(0);
  const [clickerTick, setClickerTick] = useState(100);

  const canClick = useMemo(() => {
    return clickerTick === 100;
  }, [clickerTick]);

  useEffect(() => {
    if (clickerTick === 100) return;
    const timeoutId = setTimeout(() => {
      setClickerTick((t) => Math.min(t + 1, 100));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [clickerTick]);

  const onEvent = useCallback(() => {
    setCounter((c) => c + 10);
    event.current?.setAttribute('data-event', '');
    setTimeout(() => {
      event.current?.removeAttribute('data-event');
    }, 500);

    // setClickerTick(0);
  }, [event]);

  return (
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
            outlined ? '/img/kkuti_dog_outlined_1.png' : '/img/kkuti_dog_1.png'
          }
          alt="kkuti dig"
          onMouseOver={() => setOutlined(true)}
          onMouseOut={() => setOutlined(false)}
          className="max-w-40"
          onClick={canClick ? () => onEvent() : undefined}
          draggable="false"
          width={200}
          height={200}
        />
      </div>
      {/*<br />*/}
      {/*<div className="flex px-12 w-full">*/}
      {/*  <Progress className="flex w-full" value={clickerTick} />*/}
      {/*</div>*/}
    </div>
  );
}
