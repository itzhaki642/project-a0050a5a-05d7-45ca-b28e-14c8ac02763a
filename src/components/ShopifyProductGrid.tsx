import { useEffect, useState } from "react";
import { fetchShopifyProducts, fetchProductsByCollection, ShopifyProduct } from "@/lib/shopify";
import ShopifyProductCard from "./ShopifyProductCard";
import { Loader2, Package } from "lucide-react";

interface ShopifyProductGridProps {
  title?: string;
  query?: string;
  collectionHandle?: string;
  limit?: number;
  filterByTitle?: boolean;
}

const ShopifyProductGrid = ({ title, query, collectionHandle, limit = 20, filterByTitle = false }: ShopifyProductGridProps) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let fetchedProducts: ShopifyProduct[];
        
        if (collectionHandle) {
          // Fetch by collection handle
          fetchedProducts = await fetchProductsByCollection(collectionHandle, limit);
        } else {
          // Fetch by query
          fetchedProducts = await fetchShopifyProducts(limit, query, filterByTitle);
        }
        
        setProducts(fetchedProducts);
      } catch (err) {
        setError("שגיאה בטעינת המוצרים");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [limit, query, collectionHandle, filterByTitle]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">עדיין אין מוצרים בחנות</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          ספר לנו איזה מוצרים אתה רוצה להוסיף ונעזור לך ליצור אותם!
          <br />
          למשל: "הוסף מוצר בועות סבון ממותגות ב-25 ש"ח"
        </p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ShopifyProductCard key={product.node.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ShopifyProductGrid;
