import localFont from "next/font/local";

// For hevetica neue
const heveticaNeue = localFont({
  src: [
    {
      path: "../assets/fonts/helvetica-neue/HelveticaNeueThin.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../assets/fonts/helvetica-neue/HelveticaNeueLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/helvetica-neue/HelveticaNeueRoman.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/helvetica-neue/HelveticaNeueBold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-helvetica-neue",
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "sans-serif",
    " Apple Color Emoji",
    "Segoe UI Emoji",
    " Segoe UI Symbol",
    "Noto Color Emoji",
  ],
});

export { heveticaNeue };
