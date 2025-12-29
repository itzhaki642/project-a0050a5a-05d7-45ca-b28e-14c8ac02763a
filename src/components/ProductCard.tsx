import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

const ProductCard = ({ name, price, image }: ProductCardProps) => {
  return (
    <div className="group category-card">
      <div className="aspect-square overflow-hidden bg-cream">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-foreground mb-2">{name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">₪{price}</span>
          <Button size="sm" variant="secondary" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>הוסף</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
