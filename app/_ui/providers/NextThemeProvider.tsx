"use client";

import { ThemeProvider } from 'next-themes';
import { usePathname } from "next/navigation";
import React from "react";

function NextThemeProvider({ children }: { children: React.ReactNode }) {
  const reviewRoutes = ['/', '/i/flow/login', '/i/flow/signup'];
  const pathname = usePathname();
  const allowedProvideTheme = !reviewRoutes.includes(pathname);
  const defaultTheme = 'dark';

  return (
    <ThemeProvider defaultTheme="dark" forcedTheme={defaultTheme} themes={['dark']} attribute="class">
      {children}
    </ThemeProvider >
  );
};

export default NextThemeProvider;