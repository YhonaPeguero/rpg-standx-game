import type { Metadata } from "next";
import { Inter, Orbitron, Rajdhani, Share_Tech_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";
import "@/styles/globals.css";

const orbitron = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-mono",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StandX Growth Path RPG",
  description: "A narrative RPG for learning the StandX Community Growth Path.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${shareTechMono.variable} ${rajdhani.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="sx-scanlines min-h-full">
        <NextIntlClientProvider locale="en" messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
