import { Link } from "react-router-dom";

interface ConceptCardProps {
  id: string;
  title: string;
  image: string;
  productCount: number;
}

const ConceptCard = ({ id, title, image, productCount }: ConceptCardProps) => {
  return (
    <Link
      to={`/birthday/${id}`}
      className="group category-card block"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{productCount} מוצרים</p>
      </div>
    </Link>
  );
};

export default ConceptCard;
