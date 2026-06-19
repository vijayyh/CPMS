import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-inter",
  display:  "swap",
});

export const metadata: Metadata = {
  title:       "CPMS — Construction Procurement & Management System",
  description: "Professional construction ERP: Vendor management, procurement engine (indents → POs → GRNs), site inventory, and labour tracking.",
  keywords:    "construction management, procurement, vendor management, site ERP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
