import { Button } from "./ui/button";
import { Phone, PartyPopper, Gift, Baby, Crown, Star, Heart, HandHeart, Sparkles } from "lucide-react";
import heroImage from "@/assets/cover_pick.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const eventTypes = [
    {
      title: "יום הולדת לילדים",
      icon: <PartyPopper className="w-6 h-6" />,
      path: "/birthday",
      color: "bg-pink-100 text-pink-600",
    },
    {
      title: "בר מצווה",
      icon: <Star className="w-6 h-6" />,
      path: "/souvenirs",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "בת מצווה",
      icon: <Crown className="w-6 h-6" />,
      path: "/souvenirs",
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "חינה",
      icon: <HandHeart className="w-6 h-6" />,
      path: "/souvenirs",
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "חתונה",
      icon: <Heart className="w-6 h-6" />,
      path: "/souvenirs",
      color: "bg-rose-100 text-rose-600",
    },
    {
      title: "ברית/ה",
      icon: <Baby className="w-6 h-6" />,
      path: "/souvenirs",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "אחר",
      icon: <Sparkles className="w-6 h-6" />,
      path: "/souvenirs",
      color: "bg-gray-100 text-gray-600",
    },
  ];

  const handleEventSelect = (path: string) => {
    setIsDialogOpen(false);
    navigate(path);
  };

  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md w-[90%] rounded-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-center text-xl font-bold mb-4">
              איזה אירוע חוגגים? 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {eventTypes.map((event) => (
              <button
                key={event.title}
                onClick={() => handleEventSelect(event.path)}
                className="flex flex-row sm:flex-col items-center justify-start sm:justify-center p-4 rounded-xl border border-border hover:border-primary hover:bg-secondary/50 transition-all duration-200 group gap-4"
              >
                <div className={`p-3 rounded-full ${event.color} group-hover:scale-110 transition-transform duration-200`}>
                  {event.icon}
                </div>
                <span className="font-medium text-foreground">{event.title}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
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
            variant="outline"
            size="lg"
            className="rounded-full px-8 text-lg h-14 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={() => setIsDialogOpen(true)}
          >
            בואו נתחיל
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
