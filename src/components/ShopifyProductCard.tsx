import { Link } from "react-router-dom";
import { ShopifyProduct, formatPrice } from "@/lib/shopify";
import { useShopifyCartStore, ShopifyCartItem } from "@/stores/shopifyCartStore";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const addItem = useShopifyCartStore((state) => state.addItem);
  const { node } = product;
  
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const firstVariant = node.variants.edges[0]?.node;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) {
      toast.error("המוצר לא זמין");
      return;
    }

    const cartItem: ShopifyCartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || []
    };

    addItem(cartItem);
    toast.success("נוסף לסל", {
      description: node.title,
      position: "top-center"
    });
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
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            disabled={!firstVariant?.availableForSale}
          >
            <ShoppingCart className="w-4 h-4 ml-1" />
            הוסף לסל
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ShopifyProductCard;
