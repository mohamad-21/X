import "@/app/_styles/globals.css";
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import chirp from "@/app/_ui/fonts/chirp";
import Providers from "@/app/_ui/providers/providers";
import type { Metadata } from "next";
import NextTopLoader from 'nextjs-toploader';
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    template: '%s / X',
    default: 'X'
  },
  description: "X social media portfolio",
  keywords: ['twitter', 'x', 'social media', 'chatroom', 'vercel x', 'vercel twitter']
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={`${chirp.className}`}>
        <Providers>
          <NextTopLoader zIndex={100} showSpinner={false} />
          <div className="w-full p-1 text-center bg-default/20 z-[6]">
            <p className="text-xs"><span className="text-success">**Disclaimer**:</span> This project is a personal, non-commercial portfolio piece. all trademarks belong to <a href="https://x.com" target="_blank">their</a> respective owners.</p>
          </div>
          <div className="min-h-[100dvh] flex flex-col mx-auto xl:max-w-full lg:max-w-[1100px] max-w-3xl pb-4 bg-background text-forground">
            <main className="flex-1 flex flex-col justify-center sm:flex-row">
              <Suspense fallback={
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <img src="/default_white.jpg" width={370} height={370} />
                </div>
              }>
                {children}
              </Suspense>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
