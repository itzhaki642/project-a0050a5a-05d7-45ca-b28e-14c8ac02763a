import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import categorySouvenirs from "@/assets/category-souvenirs.jpg";

const products = [
  { id: "1", name: "מגנט מעוצב אישי", price: 12, image: categorySouvenirs },
  { id: "2", name: "מחזיק מפתחות ממותג", price: 18, image: categorySouvenirs },
  { id: "3", name: "נר ריחני בקופסה מעוצבת", price: 35, image: categorySouvenirs },
  { id: "4", name: "שוקולד בלגי ממותג", price: 15, image: categorySouvenirs },
  { id: "5", name: "סבון טבעי בעיצוב אישי", price: 22, image: categorySouvenirs },
  { id: "6", name: "מראה כיס ממותגת", price: 20, image: categorySouvenirs },
  { id: "7", name: "פנקס מעוצב", price: 10, image: categorySouvenirs },
  { id: "8", name: "תיק בד ממותג", price: 28, image: categorySouvenirs },
];

const Souvenirs = () => {
  return (
    <Layout>
      {/* Page Header */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            מזכרות לאירועים
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            מזכרות יוקרתיות ומעוצבות לבר/בת מצווה, חתונות, ברית ואירועים מיוחדים
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} conceptId="souvenirs" />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Souvenirs;
