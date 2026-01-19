import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import "@/styles/prism.css";

import Providers from "./(root)/providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
  title: "DevFlow",
  description:
    "A community-driven platform for asking and answering programming questions. Used to share knowledge, get help and collaborate with developers from around the world.",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} background-light900_dark200`}
      >
        {children}
      </body>
    </html>
  );
}
