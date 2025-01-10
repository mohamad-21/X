import chirp from "@/app/_ui/fonts/chirp";
import Providers from "@/app/_ui/providers/providers";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import TopHeader from "./_ui/TopHeader";
import "@/app/_styles/globals.css";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import shabnam from "./_ui/fonts/shabnam";

export const metadata: Metadata = {
  title: {
    template: "%s / X",
    default: "X",
  },
  description: "X social media portfolio",
  keywords: [
    "twitter",
    "x",
    "social media",
    "chatroom",
    "vercel x",
    "vercel twitter",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const texts = await getMessages();
  const fontfamily = locale === "fa" ? shabnam.className : chirp.className;

  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : undefined}
      suppressHydrationWarning
    >
      <head>
      </head>
      <body className={`${fontfamily}`}>
        <NextIntlClientProvider messages={texts}>
          <Providers>
            <NextTopLoader zIndex={100} showSpinner={false} />
            <TopHeader />
            <div className="min-h-[100dvh] flex flex-col mx-auto xl:max-w-full lg:max-w-[1100px] max-w-3xl pb-4 bg-background text-forground">
              <main className="flex-1 flex flex-col justify-center sm:flex-row">
                {children}
              </main>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
