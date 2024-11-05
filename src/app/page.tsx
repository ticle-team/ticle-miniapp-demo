'use client';

import { Button, Placeholder } from '@telegram-apps/telegram-ui';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Page } from '@/components/Page';

export default function RootPage() {
  const router = useRouter();
  return (
    <Placeholder
      header={<div className="text-white">Ticle Miniapp Demo</div>}
      description="Ticle Miniapp Demo is a demo miniapp for Ticle."
      action={
        <Button onClick={() => router.push('/home')}>Go to miniapp</Button>
      }
    >
      <Image
        unoptimized
        alt="Telegram sticker"
        src="https://xelene.me/telegram.gif"
        style={{ display: 'block', width: '144px', height: '144px' }}
        width={144}
        height={144}
      />
    </Placeholder>
  );
}
