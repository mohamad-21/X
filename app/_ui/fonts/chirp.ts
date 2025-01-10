import localFont from "next/font/local";

const chirp = localFont({
  src: [
    {
      path: "../../../public/fonts/chirp-regular-web.woff",
      weight: "400",
    },
    {
      path: "../../../public/fonts/chirp-medium-web.woff",
      weight: "500",
    },
    {
      path: "../../../public/fonts/chirp-bold-web.woff",
      weight: "600",
    },
  ],
});

export default chirp;