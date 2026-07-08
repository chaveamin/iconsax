import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ServiceWorkerRegistration } from "@/src/components/pwa";

const jetBrains = localFont({
  src: "../../public/JetBrains.ttf",
  variable: "--font-jet",
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "iconsax",
  description: "آیکون برای طراحان و توسعه دهندگان",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${jetBrains.variable} h-full antialiased font-jet`}>
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
