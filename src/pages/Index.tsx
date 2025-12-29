import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
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
      { threshold }
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
        isInView 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Index = () => {
  return (
    <Layout>
      <HeroSection />

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              הקטגוריות שלנו
            </h2>
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
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">עיצוב אישי</h3>
              <p className="text-muted-foreground text-sm">
                כל מוצר מעוצב במיוחד עבורכם לפי הקונספט שבחרתם
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">איכות מעולה</h3>
              <p className="text-muted-foreground text-sm">
                חומרים איכותיים והדפסה מקצועית לתוצאה מושלמת
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">משלוח מהיר</h3>
              <p className="text-muted-foreground text-sm">
                משלוחים לכל הארץ תוך 3-5 ימי עסקים
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ממליצים עלינו
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              לקוחות מרוצים משתפים את החוויה שלהם
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <TestimonialCard delay={0}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "הזמנתי חבילת יום הולדת לבת שלי והתוצאה הייתה מדהימה! כל הפריטים היו מעוצבים בצורה מושלמת והילדים התלהבו."
              </p>
              <p className="font-semibold text-foreground">מיכל כ.</p>
            </TestimonialCard>

            <TestimonialCard delay={150}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "שירות מקצועי ואדיב, המזכרות לבר המצווה היו יפהפיות. ממליצה בחום!"
              </p>
              <p className="font-semibold text-foreground">רונית ש.</p>
            </TestimonialCard>

            <TestimonialCard delay={300}>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "איכות מעולה ועיצוב מדויק לפי הבקשה שלנו. משלוח מהיר ושירות לקוחות מצוין."
              </p>
              <p className="font-semibold text-foreground">יעל מ.</p>
            </TestimonialCard>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
