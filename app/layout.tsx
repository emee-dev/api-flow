import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowHQ",
  description:
    "Postman flow alternative - Design Rest APIs in a logical and DND follow way.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
