import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ShopifyProductCard from "@/components/ShopifyProductCard";
import { fetchShopifyProducts, ShopifyProduct } from "@/lib/shopify";
import { Loader2 } from "lucide-react";

const Souvenirs = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch all products and filter for souvenirs (ברכונים, מזכרות)
        const allProducts = await fetchShopifyProducts(50);
        // Filter products that are souvenirs (not birthday themed)
        const souvenirProducts = allProducts.filter(product => {
          const title = product.node.title.toLowerCase();
          // Include products with ברכונים or מזכרות
          // Exclude birthday theme products (ספארי, ברווזים, דובי, תותים)
          const isBirthday = title.includes("ספארי") || 
                            title.includes("ברווז") || 
                            title.includes("דובי") || 
                            title.includes("תותים");
          return !isBirthday;
        });
        setProducts(souvenirProducts);
      } catch (error) {
        console.error("Error loading souvenirs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <Layout>
      {/* Page Header */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            מזכרות לאירועים
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            מזכרות וברכונים יוקרתיים לבר/בת מצווה, חתונות, ברית ואירועים מיוחדים
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">לא נמצאו מוצרים</p>
              <p className="text-muted-foreground text-sm mt-2">
                מוצרים חדשים יתווספו בקרוב
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ShopifyProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Souvenirs;
