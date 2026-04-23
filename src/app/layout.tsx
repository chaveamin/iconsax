import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const iranYekan = localFont({
  src: "../../public/IRANYekanXVF.woff2",
});
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
    <html
      lang="fa"
      className={`${iranYekan.className} ${jetBrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
