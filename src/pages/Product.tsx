import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { fetchProductByHandle, formatPrice } from "@/lib/shopify";
import { useShopifyCartStore, ShopifyCartItem } from "@/stores/shopifyCartStore";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Loader2, ArrowRight, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

// Blessing options for greeting cards
const BLESSING_OPTIONS = [
  { value: "הקדשה על כל העמוד", label: "הקדשה על כל העמוד (פרטי ההקדשה ימולאו בצ׳ק אאוט)" },
  { value: "מזמור לתודה", label: "מזמור לתודה" },
  { value: "סדר הדלקת נרות שבת", label: "סדר הדלקת נרות שבת" },
  { value: "סדר הבדלה", label: "סדר הבדלה" },
  { value: "אשת חיל", label: "אשת חיל" },
  { value: "ברכת הבית", label: "ברכת הבית" },
  { value: "ברכת העסק", label: "ברכת העסק" },
  { value: "ברכת הדרך", label: "ברכת הדרך" },
  { value: "שיר למעלות", label: "שיר למעלות" },
  { value: "מזמור לדוד ה׳ רועי לא אחסר", label: "מזמור לדוד ה׳ רועי לא אחסר" },
  { value: "מודה אני לפניך", label: "מודה אני לפניך" },
  { value: "נשמת כל חי", label: "נשמת כל חי" },
  { value: "אחר", label: "אחר (טקסט חופשי)" },
];

// Get blessing count from product type
// Expected product types: "ברכון-3" for 3 pages, "ברכון-2" for 2 pages, "ברכון-1" for 1 page
const getBlessingCount = (productType: string): number => {
  if (productType === "3") return 3;
  if (productType === "2") return 2;
  if (productType === "1") return 1;
  return 0;
};

// Check if product has a tag (תג)
const hasTagCustomization = (title: string): boolean => {
  return title.includes("תג");
};

interface ProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
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

  // Blessing selections for greeting cards
  const [blessing1, setBlessing1] = useState("");
  const [blessing2, setBlessing2] = useState("");
  const [blessing3, setBlessing3] = useState("");
  const [customBlessing1, setCustomBlessing1] = useState("");
  const [customBlessing2, setCustomBlessing2] = useState("");
  const [customBlessing3, setCustomBlessing3] = useState("");

  // Tag text customization
  const [tagText, setTagText] = useState("");

  const addItem = useShopifyCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      setIsLoading(true);
      try {
        const fetchedProduct = await fetchProductByHandle(handle);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error loading product:", error);
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
  const blessingCount = getBlessingCount(product.productType || "");
  const showTagInput = hasTagCustomization(product.title);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("יש לבחור וריאנט");
      return;
    }

    // Validate blessing selections for greeting cards
    if (blessingCount >= 1 && !blessing1) {
      toast.error("יש לבחור ברכה לכל עמוד");
      return;
    }
    if (blessingCount >= 2 && !blessing2) {
      toast.error("יש לבחור ברכה לכל עמוד");
      return;
    }
    if (blessingCount >= 3 && !blessing3) {
      toast.error("יש לבחור ברכה לכל עמוד");
      return;
    }

    // Validate tag text if product has tag
    if (showTagInput && !tagText.trim()) {
      toast.error("יש למלא את הטקסט לתג");
      return;
    }

    // Build custom attributes for blessings
    const customAttributes: Array<{ key: string; value: string }> = [];
    if (blessingCount >= 1) {
      const b1Value = blessing1 === "אחר" ? customBlessing1 : blessing1;
      customAttributes.push({ key: "ברכה עמוד 1", value: b1Value });
    }
    if (blessingCount >= 2) {
      const b2Value = blessing2 === "אחר" ? customBlessing2 : blessing2;
      customAttributes.push({ key: "ברכה עמוד 2", value: b2Value });
    }
    if (blessingCount >= 3) {
      const b3Value = blessing3 === "אחר" ? customBlessing3 : blessing3;
      customAttributes.push({ key: "ברכה עמוד 3", value: b3Value });
    }

    // Add tag text if applicable
    if (showTagInput && tagText.trim()) {
      customAttributes.push({ key: "טקסט לתג", value: tagText.trim() });
    }

    const cartItem: ShopifyCartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || [],
      customAttributes: customAttributes.length > 0 ? customAttributes : undefined,
    };

    addItem(cartItem);
    toast.success("נוסף לסל!", {
      description: `${product.title} x${quantity}`,
      position: "top-center",
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
                      selectedImage === index ? "border-primary" : "border-transparent"
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
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{product.title}</h1>
              <p className="text-2xl font-bold text-primary">
                {selectedVariant && formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
              </p>
            </div>

            {product.description && <p className="text-muted-foreground leading-relaxed">{product.description}</p>}

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
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      } ${!variant.node.availableForSale ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {variant.node.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Blessing Selections for Greeting Cards */}
            {blessingCount > 0 && (
              <div className="space-y-4 p-4 bg-secondary/30 rounded-xl border border-border">
                <h3 className="font-semibold text-foreground">בחירת ברכות לעמודים:</h3>

                {/* Page 1 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">עמוד 1:</label>
                  <Select value={blessing1} onValueChange={setBlessing1}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="בחר ברכה לעמוד 1" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      {BLESSING_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {blessing1 === "אחר" && (
                    <Input
                      value={customBlessing1}
                      onChange={(e) => setCustomBlessing1(e.target.value)}
                      placeholder="הקלידו את הברכה שלכם..."
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Page 2 - Only for 2+ pages */}
                {blessingCount >= 2 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">עמוד 2:</label>
                    <Select value={blessing2} onValueChange={setBlessing2}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="בחר ברכה לעמוד 2" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        {BLESSING_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {blessing2 === "אחר" && (
                      <Input
                        value={customBlessing2}
                        onChange={(e) => setCustomBlessing2(e.target.value)}
                        placeholder="הקלידו את הברכה שלכם..."
                        className="mt-2"
                      />
                    )}
                  </div>
                )}

                {/* Page 3 - Only for 3 pages */}
                {blessingCount === 3 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">עמוד 3:</label>
                    <Select value={blessing3} onValueChange={setBlessing3}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="בחר ברכה לעמוד 3" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        {BLESSING_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {blessing3 === "אחר" && (
                      <Input
                        value={customBlessing3}
                        onChange={(e) => setCustomBlessing3(e.target.value)}
                        placeholder="הקלידו את הברכה שלכם..."
                        className="mt-2"
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tag Text Input */}
            {showTagInput && (
              <div className="space-y-3 p-4 bg-secondary/30 rounded-xl border border-border">
                <label className="font-semibold text-foreground">מה לרשום על התג?</label>
                <Input
                  value={tagText}
                  onChange={(e) => setTagText(e.target.value.slice(0, 70))}
                  placeholder="הקלידו את הטקסט לתג..."
                  maxLength={70}
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground text-left">{tagText.length}/70 תווים</p>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="font-medium text-foreground">כמות:</label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
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

            {!selectedVariant?.availableForSale && <p className="text-destructive text-center">מוצר זה אזל מהמלאי</p>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
