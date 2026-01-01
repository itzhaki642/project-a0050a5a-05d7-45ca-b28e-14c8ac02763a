import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [activeSlide, setActiveSlide] = useState(0);

  // הודעה 1: טוסטר המקורי
  const message1 = "🎁 הזמנה דיגיטלית מעוצבת חינם! בקניה מעל 150 ש״ח";

  // הודעה 2: דחוף
  const message2 = "האירוע ממש בקרוב? דברו איתנו ונעשה הכל כדי לעזור";

  // האם להציג את הבאנר - שנה ל-false כדי להסתיר
  const showBanner = true;

  // Rotation Logic
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

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

  const formatTime = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="bg-primary text-primary-foreground py-2.5 px-4 text-center relative overflow-hidden transition-all duration-300">
      {/* Slide 1: Timer + Promo */}
      <div
        className={`flex items-center justify-center gap-4 flex-wrap transition-opacity duration-500 absolute w-full left-0 top-1/2 -translate-y-1/2 ${
          activeSlide === 0 ? "opacity-100 visible z-10" : "opacity-0 invisible z-0"
        }`}
      >
        <p className="text-sm font-medium">{message1}</p>
        <div
          className="flex items-center gap-1.5 bg-primary-foreground/15 px-3 py-1 rounded-full text-xs font-semibold"
          aria-label={`נשארו ${timeLeft.hours} שעות, ${timeLeft.minutes} דקות ו-${timeLeft.seconds} שניות`}
        >
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
          </span>
        </div>
      </div>

      {/* Slide 2: Urgent Help */}
      <div
        className={`flex items-center justify-center gap-4 flex-wrap transition-opacity duration-500 absolute w-full left-0 top-1/2 -translate-y-1/2 ${
          activeSlide === 1 ? "opacity-100 visible z-10" : "opacity-0 invisible z-0"
        }`}
      >
        <p className="text-sm font-medium">
          {message2}
          <a
            href="https://wa.me/972549255848?text=%D7%94%D7%99%D7%99%2C%20%D7%A6%D7%A8%D7%99%D7%9A%20%D7%A2%D7%96%D7%A8%D7%94%20%D7%93%D7%97%D7%95%D7%A4%D7%94%20%D7%9C%D7%90%D7%99%D7%A8%D7%95%D7%A2%20%D7%A7%D7%A8%D7%95%D7%91"
            target="_blank"
            rel="noreferrer"
            className="underline mr-2 hover:text-primary-foreground/80 font-bold"
          >
            לחצו כאן
          </a>
        </p>
      </div>

      {/* Invisible spacer to keep height */}
      <div className="invisible flex items-center justify-center gap-4 flex-wrap">
        <p className="text-sm font-medium">{message1}</p>
        <div className="flex items-center gap-1.5 bg-primary-foreground/15 px-3 py-1 rounded-full text-xs font-semibold">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>00:00:00</span>
        </div>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 hover:bg-primary-foreground/10 rounded-full transition-colors z-20"
        aria-label="סגור הודעה"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AnnouncementBanner;
