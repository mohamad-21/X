import localFont from "next/font/local";

const chirp = localFont({
  src: [
    {
      path: "../../../public/fonts/samim/samim/Samim-FD-WOL.ttf",
      weight: "500",
    },
    {
      path: "../../../public/fonts/samim/samim/Samim-Bold-FD-WOL.ttf",
      weight: "600",
    },
  ],
});

export default chirp;
