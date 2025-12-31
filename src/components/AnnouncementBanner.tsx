import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  // הודעה לעריכה - שנה את הטקסט כאן
  const message = "🎁 הזמנה דיגיטלית מעוצבת חינם! בקניה מעל 150 ש״ח";

  // האם להציג את הבאנר - שנה ל-false כדי להסתיר
  const showBanner = true;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight.getTime() - now.getTime();

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return { hours, minutes, seconds };
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!showBanner || !isVisible) return null;

  const formatTime = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-primary text-primary-foreground py-2.5 px-4 text-center relative">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <p className="text-sm font-medium">{message}</p>
        <div className="flex items-center gap-1.5 bg-primary-foreground/15 px-3 py-1 rounded-full text-xs font-semibold" aria-label={`נשארו ${timeLeft.hours} שעות, ${timeLeft.minutes} דקות ו-${timeLeft.seconds} שניות`}>
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}</span>
        </div>
      </div>
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
