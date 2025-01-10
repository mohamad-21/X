import localFont from "next/font/local";

const shabnam = localFont({
  src: [
    {
      path: "../../../public/fonts/shabnam/Shabnam-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../../public/fonts/shabnam/Shabnam-Bold.ttf",
      weight: "600",
    },
  ],
});

export default shabnam;
