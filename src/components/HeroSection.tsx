import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import heroImage from "@/assets/cover_pick.jpg";
const HeroSection = () => {
  return <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <img src={heroImage} alt="מיתוג אירועים" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 hero-overlay" />
      <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center opacity-75">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-in-up">מיתוג אירועים</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 animate-fade-in-up" style={{
        animationDelay: "0.1s"
      }}>
          הופכים כל אירוע לחוויה בלתי נשכחת עם מוצרים ממותגים בעיצוב אישי
        </p>
        <div className="flex gap-4 animate-fade-in-up" style={{
        animationDelay: "0.2s"
      }}>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/birthday">ימי הולדת</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link to="/souvenirs">מזכרות</Link>
          </Button>
        </div>
      </div>
    </section>;
};
export default HeroSection;