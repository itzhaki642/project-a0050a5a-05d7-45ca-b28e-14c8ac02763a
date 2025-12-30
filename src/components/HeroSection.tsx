import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import heroImage from "@/assets/cover_pick.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
      <img src={heroImage} alt="יום הולדת לילדים ומזכרות לאירועים - סטודיו טופז" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <span className="inline-block bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
          ✨ מעל 500 לקוחות מרוצים
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up drop-shadow-lg">
          יום הולדת לילדים
          <br />
          <span className="text-primary">ומזכרות לאירועים</span>
        </h1>
        <p
          className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 animate-fade-in-up drop-shadow-md"
          style={{ animationDelay: "0.1s" }}
        >
          מוצרים ממותגים בעיצוב אישי, ברכונים לאירועים ומזכרות יוקרתיות לבר/בת מצווה וחתונות
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <Button asChild size="lg" className="rounded-full px-8 text-lg h-14 shadow-xl">
            <a href="https://wa.me/972549255848">
              <Phone className="ml-2 h-5 w-5" />
              דברו איתנו עכשיו
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 text-lg h-14 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <Link to="/birthday">בואו נתחיל</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
