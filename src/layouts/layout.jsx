import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthWrapper from "@/pages/components/AuthWrapper";

export default function RootLayout({ children }) {
  return (
    <div className="font-[Outfit] scroll-smooth antialiased">
      <Toaster richColors />

      <AuthWrapper>
        <div className="flex h-screen">
          <main className="flex-1  overflow-auto">
            {/* <NoInternet /> */}
            {children}
          </main>
        </div>
      </AuthWrapper>
    </div>
  );
}
