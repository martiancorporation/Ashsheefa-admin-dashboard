import { Geist, Geist_Mono } from "next/font/google";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthWrapper from "./components/AuthWrapper";

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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`font-[Outfit] antialiased`}>
        <Toaster richColors />
        <AuthWrapper>
          <div className="flex h-screen">
            <main className="flex-1  overflow-auto">
              {/* <NoInternet /> */}
              {children}
            </main>
          </div>
        </AuthWrapper>
      </body>
    </html>
  );
}
