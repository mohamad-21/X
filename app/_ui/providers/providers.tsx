"use client";

import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import NextThemeProvider from "./NextThemeProvider";
import StoreProvider from "./StoreProvider";
import { SessionProvider } from 'next-auth/react';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreProvider>
        <NextUIProvider>
          <NextThemeProvider>
            {children}
          </NextThemeProvider>
        </NextUIProvider>
      </StoreProvider>
    </SessionProvider>
  );
};

export default Providers;
