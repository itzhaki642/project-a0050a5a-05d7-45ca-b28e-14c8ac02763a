import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { fetchProductByHandle, formatPrice } from "@/lib/shopify";
import { useShopifyCartStore, ShopifyCartItem } from "@/stores/shopifyCartStore";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2, ArrowRight, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

interface ProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
}

const Product = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const addItem = useShopifyCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      setIsLoading(true);
      try {
        const fetchedProduct = await fetchProductByHandle(handle);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">המוצר לא נמצא</h1>
          <Link to="/" className="text-primary hover:underline">
            חזרה לדף הבית
          </Link>
        </div>
      </Layout>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const images = product.images.edges;
  const currentImage = images[selectedImage]?.node;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("יש לבחור וריאנט");
      return;
    }

    const cartItem: ShopifyCartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || []
    };

    addItem(cartItem);
    toast.success("נוסף לסל!", {
      description: `${product.title} x${quantity}`,
      position: "top-center"
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/" className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm">
            <ArrowRight className="w-4 h-4" />
            חזרה לחנות
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-secondary/20 rounded-2xl overflow-hidden">
              {currentImage ? (
                <img
                  src={currentImage.url}
                  alt={currentImage.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ShoppingCart className="w-16 h-16" />
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img.node.url}
                      alt={img.node.altText || `תמונה ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <p className="text-2xl font-bold text-primary">
                {selectedVariant && formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
              </p>
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Variants */}
            {product.variants.edges.length > 1 && (
              <div className="space-y-3">
                <label className="font-medium text-foreground">בחר אפשרות:</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((variant, index) => (
                    <button
                      key={variant.node.id}
                      onClick={() => setSelectedVariantIndex(index)}
                      disabled={!variant.node.availableForSale}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedVariantIndex === index
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      } ${!variant.node.availableForSale ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {variant.node.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="font-medium text-foreground">כמות:</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
            >
              <ShoppingCart className="w-5 h-5 ml-2" />
              הוסף לסל
            </Button>

            {!selectedVariant?.availableForSale && (
              <p className="text-destructive text-center">מוצר זה אזל מהמלאי</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
