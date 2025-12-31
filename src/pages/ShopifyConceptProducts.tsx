import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import ShopifyProductGrid from "@/components/ShopifyProductGrid";
import { ChevronLeft } from "lucide-react";

interface ConceptData {
  title: string;
  query?: string;
  collectionHandle?: string;
}

const conceptsData: Record<string, ConceptData> = {
  ducks: {
    title: "יום הולדת ברווזונים",
    query: "ברווזונים",
  },
  safari: {
    title: "יום הולדת ספארי",
    query: "ספארי",
  },
  bears: {
    title: "יום הולדת דובי",
    query: "דובי",
  },
  strawberries: {
    title: "יום הולדת תותים",
    query: "תותים",
  },
  "custom-design": {
    title: "יום הולדת בעיצוב אישי",
    collectionHandle: "יום-הולדת-בעיצוב-אישי",
  },
};

const ShopifyConceptProducts = () => {
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
            כל המוצרים הממותגים בעיצוב {concept.title}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <ShopifyProductGrid 
            query={concept.query} 
            collectionHandle={concept.collectionHandle}
            limit={50} 
            filterByTitle={!concept.collectionHandle} 
          />
        </div>
      </section>
    </Layout>
  );
};

export default ShopifyConceptProducts;
