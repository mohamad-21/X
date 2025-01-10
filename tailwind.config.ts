import type { Config } from "tailwindcss";
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'darkgray': '#202327',
      }
    },
  },
  // darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#000",
            foreground: "#e7e9ea",
            primary: {
              DEFAULT: "#1d9bf0",
              foreground: "#e7e9ea",
            },
            secondary: {
              DEFAULT: "#e7e9ea",
              foreground: "#000",
            },
            danger: '#f4212e',
          },
        },
        dark: {
          colors: {
            background: "#000",
            foreground: "#e7e9ea",
            primary: {
              DEFAULT: "#1d9bf0",
              foreground: "#e7e9ea",
            },
            secondary: {
              DEFAULT: "#e7e9ea",
              foreground: "#000",
            },
            danger: '#f4212e',
          },
        },
      },
    }),
  ],
};
export default config;
