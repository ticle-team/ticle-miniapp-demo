'use client';

import { Poppins } from 'next/font/google';
import './globals.css';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const Root = dynamic(() => import('@/components/Root'), { ssr: false });

  return (
    <html lang="en" className="w-full h-full text-white">
      <head>
        <title>Ticle Miniapp Demo</title>
        <meta name="description" content="Ticle Miniapp Demo" />
      </head>
      <body className={classNames(poppins.className, 'w-full h-full')}>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
