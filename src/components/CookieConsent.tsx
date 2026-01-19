import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay for smoother UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-secondary rounded-full shrink-0">
              <Cookie className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm md:text-base text-foreground">
              אנחנו משתמשים בעוגיות (Cookies) כדי לשפר את חוויית הגלישה שלך באתר.
              בהמשך הגלישה באתר, את/ה מסכים/ה לשימוש בעוגיות.{" "}
              <a href="/terms" className="text-primary hover:underline">
                למידע נוסף
              </a>
            </p>
          </div>
          <Button
            onClick={acceptCookies}
            className="shrink-0 px-6"
          >
            הבנתי, אני מסכים/ה
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
