import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
}

const CategoryCard = ({ title, description, image, href }: CategoryCardProps) => {
  return (
    <Link to={href} className="group category-card block">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <div className="flex items-center gap-2 text-foreground font-medium">
          <span>לצפייה בקולקציה</span>
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
