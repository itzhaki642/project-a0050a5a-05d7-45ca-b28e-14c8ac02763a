import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { ChevronLeft } from "lucide-react";
import conceptSafari from "@/assets/concept-safari.jpg";
import conceptPrincess from "@/assets/concept-princess.jpg";
import conceptSuperhero from "@/assets/concept-superhero.jpg";

const conceptsData: Record<string, { title: string; image: string; products: Array<{ id: string; name: string; price: number; image: string }> }> = {
  safari: {
    title: "יום הולדת ספארי",
    image: conceptSafari,
    products: [
      { id: "1", name: "בועות סבון ממותגות - ספארי", price: 8, image: conceptSafari },
      { id: "2", name: "חטיף במבה ממותג - ספארי", price: 5, image: conceptSafari },
      { id: "3", name: "כובעי מסיבה - ספארי", price: 12, image: conceptSafari },
      { id: "4", name: "מפיות מעוצבות - ספארי", price: 15, image: conceptSafari },
      { id: "5", name: "שקיות הפתעה - ספארי", price: 6, image: conceptSafari },
      { id: "6", name: "בלונים מודפסים - ספארי", price: 25, image: conceptSafari },
    ],
  },
  princess: {
    title: "יום הולדת נסיכות",
    image: conceptPrincess,
    products: [
      { id: "1", name: "בועות סבון ממותגות - נסיכות", price: 8, image: conceptPrincess },
      { id: "2", name: "חטיף במבה ממותג - נסיכות", price: 5, image: conceptPrincess },
      { id: "3", name: "כתרים מעוצבים - נסיכות", price: 15, image: conceptPrincess },
      { id: "4", name: "מפיות מעוצבות - נסיכות", price: 15, image: conceptPrincess },
    ],
  },
  superhero: {
    title: "יום הולדת גיבורי על",
    image: conceptSuperhero,
    products: [
      { id: "1", name: "בועות סבון ממותגות - גיבורי על", price: 8, image: conceptSuperhero },
      { id: "2", name: "חטיף במבה ממותג - גיבורי על", price: 5, image: conceptSuperhero },
      { id: "3", name: "מסכות גיבורי על", price: 10, image: conceptSuperhero },
    ],
  },
};

const ConceptProducts = () => {
  const { conceptId } = useParams<{ conceptId: string }>();
  const concept = conceptId ? conceptsData[conceptId] : null;

  if (!concept) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">קונספט לא נמצא</h1>
          <Link to="/birthday" className="text-primary hover:underline">
            חזרה לימי הולדת
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            דף הבית
          </Link>
          <ChevronLeft className="h-4 w-4" />
          <Link to="/birthday" className="hover:text-foreground transition-colors">
            ימי הולדת
          </Link>
          <ChevronLeft className="h-4 w-4" />
          <span className="text-foreground">{concept.title}</span>
        </nav>
      </div>

      {/* Page Header */}
      <section className="py-8 md:py-12 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {concept.title}
          </h1>
          <p className="text-muted-foreground">
            {concept.products.length} מוצרים זמינים
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {concept.products.map((product) => (
              <ProductCard key={product.id} {...product} conceptId={conceptId} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ConceptProducts;
