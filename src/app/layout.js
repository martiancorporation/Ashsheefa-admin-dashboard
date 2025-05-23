import { Geist, Geist_Mono } from "next/font/google";
import { Outfit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  subsets: ["latin"], // Or other subsets as needed
  variable: "--font-outfit", // Optional: Define a CSS variable
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ashsheefa Admin Dashboard",
  description: "This is a dashboard for hospital patient management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-[Outfit] antialiased`}>{children}</body>
    </html>
  );
}
