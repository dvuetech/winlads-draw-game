import { GiveawayContextProvider } from "@/context/GiveawayContext";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Winlads Draw",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GiveawayContextProvider>{children}</GiveawayContextProvider>
      </body>
    </html>
  );
}
