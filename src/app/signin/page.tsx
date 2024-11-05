'use client';

import { Page } from '@/components/Page';
import { Button, Input } from '@telegram-apps/telegram-ui';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useShapleAuth } from '@/hooks/shaple';
import { useState } from 'react';
import _ from 'lodash-es';

export default function SignInPage() {
  const router = useRouter();
  const { shapleClient } = useShapleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: signIn, isPending: IsPendingSignIn } = useMutation({
    mutationKey: [
      'shaple.auth.signIn',
      { shapleClient, email, password, router },
    ] as const,
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { error } = await shapleClient.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }
    },
    onError: (err) => {
      alert(err.message);
      console.error(err);
    },
    onSuccess: () => router.push('/home'),
  });

  return (
    <Page>
      <div className="flex flex-col flex-1 w-full h-full justify-center items-center select-none">
        <div className="text-2xl">Ticle Mini App</div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={_.throttle((e) => setEmail(e.target.value))}
          disabled={IsPendingSignIn}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={_.throttle((e) => setPassword(e.target.value))}
          disabled={IsPendingSignIn}
        />
        <div className="flex flex-row gap-2">
          <Button
            size="m"
            mode="filled"
            onClick={() => signIn({ email, password })}
          >
            Sign In
          </Button>
          <Button size="m" mode="plain" onClick={() => router.push('/signup')}>
            Sign Up
          </Button>
        </div>
      </div>
    </Page>
  );
}
