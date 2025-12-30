import { useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Play } from "lucide-react";

// Portfolio items - add your images and videos here
// For videos: use type: "video" and add the video file path
// For images: use type: "image" and add the image file path
const portfolioItems: PortfolioItem[] = [
  // Example structure - replace with your actual content:
  // {
  //   type: "image",
  //   src: "/path-to-image.jpg",
  //   alt: "תיאור התמונה",
  //   title: "יום הולדת ספארי"
  // },
  // {
  //   type: "video",
  //   src: "/path-to-video.mp4",
  //   poster: "/path-to-poster.jpg",
  //   title: "Unboxing חבילת יום הולדת"
  // },
];

interface PortfolioItem {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
  title: string;
}

const PortfolioCard = ({ item }: { item: PortfolioItem }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (item.type === "video" && videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (item.type === "video" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.type === "image" ? (
        <img
          src={item.src}
          alt={item.alt || item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <>
          <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            muted
            loop
            playsInline
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Play indicator */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-xl">
              <Play className="w-7 h-7 text-primary-foreground mr-[-3px]" />
            </div>
          </div>
        </>
      )}

      {/* Overlay with title */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg">{item.title}</h3>
        </div>
      </div>
    </div>
  );
};

// Placeholder cards for when no content is uploaded yet
const PlaceholderCard = ({ index }: { index: number }) => {
  const placeholders = [
    { title: "יום הולדת ספארי", emoji: "🦁" },
    { title: "חבילת ברווזונים", emoji: "🦆" },
    { title: "מזכרות בר מצווה", emoji: "✡️" },
    { title: "יום הולדת תותים", emoji: "🍓" },
    { title: "חבילת דובונים", emoji: "🧸" },
    { title: "מזכרות חתונה", emoji: "💒" },
  ];

  const placeholder = placeholders[index % placeholders.length];

  return (
    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-secondary via-accent/30 to-secondary border border-border group cursor-pointer">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <span className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
          {placeholder.emoji}
        </span>
        <h3 className="text-foreground font-semibold text-lg">{placeholder.title}</h3>
        <p className="text-muted-foreground text-sm mt-2">תמונה בקרוב</p>
      </div>
    </div>
  );
};

const PortfolioGallery = () => {
  const hasContent = portfolioItems.length > 0;

  return (
    <section className="py-16 md:py-24 bg-secondary/30" aria-labelledby="portfolio-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="portfolio-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            מהעבודות שלנו
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            הצצה לעבודות שיצרנו עבור לקוחות מרוצים - ימי הולדת, בר/בת מצווה ואירועים מיוחדים
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {hasContent
                ? portfolioItems.map((item, index) => (
                    <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                      <PortfolioCard item={item} />
                    </CarouselItem>
                  ))
                : [...Array(6)].map((_, index) => (
                    <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                      <PlaceholderCard index={index} />
                    </CarouselItem>
                  ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -right-12 left-auto" />
            <CarouselNext className="hidden md:flex -left-12 right-auto" />
          </Carousel>

          {/* Mobile swipe hint */}
          <p className="text-center text-muted-foreground text-sm mt-6 md:hidden">
            ← החליקו לצדדים לראות עוד →
          </p>
        </div>
      </div>
    </section>
  );
};

export default PortfolioGallery;
