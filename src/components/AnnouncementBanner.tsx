import { useState } from "react";
import { X } from "lucide-react";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  // הודעה לעריכה - שנה את הטקסט כאן
  const message = "🎉 משלוח חינם בהזמנה מעל 200 ₪! 🎉";
  
  // האם להציג את הבאנר - שנה ל-false כדי להסתיר
  const showBanner = true;

  if (!showBanner || !isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center relative">
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
        aria-label="סגור הודעה"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AnnouncementBanner;
