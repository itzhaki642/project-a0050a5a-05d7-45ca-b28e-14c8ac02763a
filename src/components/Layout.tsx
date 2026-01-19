import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import AccessibilityWidget from "./AccessibilityWidget";
import AnnouncementBanner from "./AnnouncementBanner";
import CookieConsent from "./CookieConsent";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-medium focus:shadow-lg"
      >
        דלג לתוכן הראשי
      </a>
      <AnnouncementBanner />
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <AccessibilityWidget />
      <CookieConsent />
    </div>
  );
};

export default Layout;
