import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import CategoryCard from "@/components/CategoryCard";
import SEOStructuredData from "@/components/SEOStructuredData";
import categoryBirthday from "@/assets/category-birthday.jpg";
import categorySouvenirs from "@/assets/category-souvenirs.jpg";

const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

const categories = [
  {
    title: "ימי הולדת לילדים",
    description: "קולקציות מעוצבות לימי הולדת מושלמים - מבועות סבון ועד חטיפים ממותגים",
    image: categoryBirthday,
    href: "/birthday",
  },
  {
    title: "מזכרות לאירועים",
    description: "מזכרות יוקרתיות לבר/בת מצווה, חתונות ואירועים מיוחדים",
    image: categorySouvenirs,
    href: "/souvenirs",
  },
];

const TestimonialCard = ({ children, delay }: { children: React.ReactNode; delay: number }) => {
  const { ref, isInView } = useInView(0.2);

  return (
    <div
      ref={ref}
      className={`bg-card border border-border rounded-2xl p-6 shadow-sm transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const stats = [
  { number: "500+", label: "לקוחות מרוצים" },
  { number: "4", label: "שנות ניסיון" },
  { number: "100%", label: "שביעות רצון" },
  { number: "3-5", label: "ימי משלוח מרגע סיום ההכנה" },
];

const reviews = [
  {
    author: "מיכל כ.",
    reviewBody: "הזמנתי חבילת יום הולדת לבת שלי והתוצאה הייתה מדהימה! כל הפריטים היו מעוצבים בצורה מושלמת והילדים התלהבו.",
    ratingValue: 5,
    eventType: "יום הולדת",
    date: "ינואר 2024"
  },
  {
    author: "רונית ש.",
    reviewBody: "שירות מקצועי ואדיב, המזכרות לבר המצווה היו יפהפיות. ממליצה בחום!",
    ratingValue: 5,
    eventType: "בר מצווה",
    date: "דצמבר 2023"
  },
  {
    author: "יעל מ.",
    reviewBody: "איכות מעולה ועיצוב מדויק לפי הבקשה שלנו. משלוח מהיר ושירות לקוחות מצוין.",
    ratingValue: 5,
    eventType: "יום הולדת",
    date: "פברואר 2024"
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1 mb-4" role="img" aria-label={`דירוג ${rating} מתוך 5 כוכבים`}>
    {[...Array(5)].map((_, i) => (
      <span key={i} className="text-yellow-500" aria-hidden="true">★</span>
    ))}
  </div>
);

const FeatureIcon = ({ emoji, label }: { emoji: string; label: string }) => (
  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center" role="img" aria-label={label}>
    <span className="text-2xl" aria-hidden="true">{emoji}</span>
  </div>
);

const Index = () => {
  return (
    <Layout>
      <SEOStructuredData reviews={reviews} />
      <HeroSection />

      {/* Stats Section */}
      <section className="py-12 bg-primary" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">הנתונים שלנו</h2>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-primary-foreground">
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Categories Section */}
      <section className="py-16 md:py-24" aria-labelledby="categories-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="categories-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">הקטגוריות שלנו</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              בחרו מתוך מגוון קטגוריות ומצאו את המוצרים המושלמים לאירוע שלכם
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {categories.map((category) => (
              <CategoryCard key={category.href} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">למה לבחור בנו</h2>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <FeatureIcon emoji="🎨" label="אייקון עיצוב" />
              <h3 className="text-lg font-semibold text-foreground mb-2">עיצוב אישי</h3>
              <p className="text-muted-foreground text-sm">כל מוצר מעוצב במיוחד עבורכם לפי הקונספט שבחרתם</p>
            </div>
            <div className="p-6">
              <FeatureIcon emoji="✨" label="אייקון איכות" />
              <h3 className="text-lg font-semibold text-foreground mb-2">איכות מעולה</h3>
              <p className="text-muted-foreground text-sm">חומרים איכותיים והדפסה מקצועית לתוצאה מושלמת</p>
            </div>
            <div className="p-6">
              <FeatureIcon emoji="🚚" label="אייקון משלוח" />
              <h3 className="text-lg font-semibold text-foreground mb-2">משלוח מהיר</h3>
              <p className="text-muted-foreground text-sm">משלוחים לכל הארץ תוך 3-5 ימי עסקים</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">ממליצים עלינו</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">לקוחות מרוצים משתפים את החוויה שלהם</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {reviews.map((review, index) => (
              <TestimonialCard key={index} delay={index * 150}>
                <StarRating rating={review.ratingValue} />
                <p className="text-muted-foreground mb-4">"{review.reviewBody}"</p>
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-foreground">{review.author}</p>
                  <span className="text-xs text-muted-foreground">{review.eventType} • {review.date}</span>
                </div>
              </TestimonialCard>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
