import { Button } from "./ui/button";
import { Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  conceptId?: string;
}

const ProductCard = ({ id, name, price, image, conceptId }: ProductCardProps) => {
  const { items, addItem, updateQuantity } = useCart();
  
  const cartItem = items.find((item) => item.id === `${conceptId}-${id}`);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({
      id: `${conceptId}-${id}`,
      name,
      price,
      image,
      conceptId,
    });
  };

  const handleIncrease = () => {
    updateQuantity(`${conceptId}-${id}`, quantity + 1);
  };

  const handleDecrease = () => {
    updateQuantity(`${conceptId}-${id}`, quantity - 1);
  };

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
          
          {quantity === 0 ? (
            <Button size="sm" variant="secondary" className="gap-2" onClick={handleAdd}>
              <Plus className="h-4 w-4" />
              <span>הוסף</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={handleDecrease}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-medium text-foreground">{quantity}</span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={handleIncrease}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
