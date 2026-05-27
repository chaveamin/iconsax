import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const jetBrains = localFont({
  src: "../../public/JetBrains.ttf",
  variable: "--font-jet",
});

export const metadata: Metadata = {
  title: "iconsax",
  description: "آیکون برای طراحان و توسعه دهندگان",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${jetBrains.variable} h-full antialiased font-jet`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
