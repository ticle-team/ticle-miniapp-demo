'use client';

import { Page } from '@/components/Page';
import { Button, Input } from '@telegram-apps/telegram-ui';
import { useRouter } from 'next/navigation';
import { useShapleAuth } from '@/hooks/shaple';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { validateEmail } from '@/core/validateEmail';
import _ from 'lodash-es';

type Status = 'error' | undefined;

export default function SignUpPage() {
  const router = useRouter();
  const { shapleClient } = useShapleAuth();
  const [email, setEmail] = useState({
    value: '',
    status: undefined as Status,
  });
  const [password, setPassword] = useState({
    value: '',
    status: undefined as Status,
  });
  const [passwordConfirm, setPasswordConfirm] = useState({
    value: '',
    status: undefined as Status,
  });

  const { mutate: signUp, ...signUpMeta } = useMutation({
    mutationKey: ['shaple.auth.signIn', { shapleClient }] as const,
    mutationFn: async ({
      email,
      password,
      passwordConfirm,
    }: {
      email: string;
      password: string;
      passwordConfirm: string;
    }) => {
      email = email.trim();
      password = password.trim();
      passwordConfirm = passwordConfirm.trim();

      if (!email || !password || !passwordConfirm) {
        return {
          type: 'empty',
          target: {
            password: !password,
            email: !email,
            passwordConfirm: !passwordConfirm,
          },
        };
      }

      if (!validateEmail(email)) {
        return { type: 'invalid-email' };
      }

      if (password !== passwordConfirm) {
        return { type: 'password-not-match' };
      }

      const { error } = await shapleClient.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      return { type: 'success' };
    },
    onError: (e) => {
      alert(e.message);
      console.error({
        name: e.name,
        message: e.message,
        stack: e.stack,
      });
    },
    onSuccess: ({ type, target }) => {
      switch (type) {
        case 'empty':
          if (target?.email) {
            setEmail((v) => {
              return { ...v, status: 'error' };
            });
          }
          if (target?.password) {
            setPassword((v) => {
              return { ...v, status: 'error' };
            });
          }
          if (target?.passwordConfirm) {
            setPasswordConfirm((v) => {
              return { ...v, status: 'error' };
            });
          }
          break;
        case 'invalid-email':
          setEmail((v) => {
            return { ...v, status: 'error' };
          });
          break;
        case 'password-not-match':
          setPassword((v) => {
            return { ...v, status: 'error' };
          });
          setPasswordConfirm((v) => {
            return { ...v, status: 'error' };
          });
          break;
        case 'success':
          router.push('/home');
      }
    },
  });

  return (
    <Page>
      <div className="flex flex-col flex-1 w-full h-full justify-center items-center select-none">
        <div className="text-2xl">Ticle Mini App</div>
        <Input
          type="email"
          value={email.value}
          onChange={_.throttle((e) =>
            setEmail({ value: e.target.value, status: undefined }),
          )}
          status={email.status}
          header="email"
          disabled={signUpMeta.isPending}
        />
        <Input
          type="password"
          value={password.value}
          onChange={_.throttle((e) =>
            setPassword({
              value: e.target.value,
              status: undefined,
            }),
          )}
          status={password.status}
          header="password"
          disabled={signUpMeta.isPending}
        />
        <Input
          type="password"
          value={passwordConfirm.value}
          onChange={_.throttle((e) =>
            setPasswordConfirm({
              value: e.target.value,
              status: undefined,
            }),
          )}
          status={passwordConfirm.status}
          header="password confirm"
          disabled={signUpMeta.isPending}
        />
        <br />
        <Button
          size="m"
          mode="filled"
          onClick={() =>
            signUp({
              email: email.value,
              password: password.value,
              passwordConfirm: passwordConfirm.value,
            })
          }
        >
          Sign Up
        </Button>
      </div>
    </Page>
  );
}
