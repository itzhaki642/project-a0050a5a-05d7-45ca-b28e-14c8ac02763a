import { Link } from "react-router-dom";
import { ShopifyProduct, formatPrice } from "@/lib/shopify";
import { useShopifyCartStore, ShopifyCartItem } from "@/stores/shopifyCartStore";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const { items, addItem, updateQuantity, removeItem } = useShopifyCartStore();
  const { node } = product;
  
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const firstVariant = node.variants.edges[0]?.node;

  // Find if this product is in cart
  const cartItem = items.find(item => item.variantId === firstVariant?.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) {
      toast.error("המוצר לא זמין");
      return;
    }

    const newCartItem: ShopifyCartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || []
    };

    addItem(newCartItem);
    toast.success("נוסף לסל", {
      description: node.title,
      position: "top-center"
    });
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (firstVariant) {
      updateQuantity(firstVariant.id, quantity + 1);
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (firstVariant) {
      if (quantity <= 1) {
        removeItem(firstVariant.id);
      } else {
        updateQuantity(firstVariant.id, quantity - 1);
      }
    }
  };

  return (
    <Link 
      to={`/product/${node.handle}`}
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden bg-secondary/20">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ShoppingCart className="w-12 h-12" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
          {node.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {node.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          
          {quantity === 0 ? (
            <Button 
              size="sm" 
              variant="secondary"
              className="gap-2"
              onClick={handleAdd}
              disabled={!firstVariant?.availableForSale}
            >
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
    </Link>
  );
};

export default ShopifyProductCard;
