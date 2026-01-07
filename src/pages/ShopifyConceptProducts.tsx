import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ShopifyProductGrid from "@/components/ShopifyProductGrid";
import { ChevronLeft } from "lucide-react";
import { fetchCollectionById, CollectionWithProducts } from "@/lib/shopify";

interface ConceptData {
  title: string;
  description?: string;
  query?: string;
  collectionHandle?: string;
  collectionId?: string;
}

const conceptsData: Record<string, ConceptData> = {
  ducks: {
    title: "יום הולדת ברווזונים",
    description: "כל המוצרים הממותגים בעיצוב ברווזונים",
    collectionId: "gid://shopify/Collection/304718086280",
  },
  safari: {
    title: "יום הולדת ספארי",
    description: "כל המוצרים הממותגים בעיצוב ספארי",
    collectionId: "gid://shopify/Collection/304718381192",
  },
  bears: {
    title: "יום הולדת דובי",
    description: "כל המוצרים הממותגים בעיצוב דובי",
    collectionId: "gid://shopify/Collection/304719397000",
  },
  strawberries: {
    title: "יום הולדת תותים",
    description: "כל המוצרים הממותגים בעיצוב תותים",
    collectionId: "gid://shopify/Collection/304719429768",
  },
  "custom-design": {
    title: "יום הולדת בעיצוב אישי",
    collectionId: "gid://shopify/Collection/304752787592",
  },
  "ice-cream": {
    title: "יום הולדת גלידות",
    description: "כל המוצרים הממותגים בעיצוב גלידות",
    collectionId: "gid://shopify/Collection/304766550152",
  },
  fairy: {
    title: "יום הולדת פיות",
    description: "כל המוצרים הממותגים בעיצוב פיות",
    collectionId: "gid://shopify/Collection/304938057864",
  },
};

const ShopifyConceptProducts = () => {
  const { conceptId } = useParams<{ conceptId: string }>();
  const concept = conceptId ? conceptsData[conceptId] : null;
  const [collectionData, setCollectionData] = useState<CollectionWithProducts | null>(null);

  useEffect(() => {
    if (concept?.collectionId) {
      fetchCollectionById(concept.collectionId).then(setCollectionData);
    }
  }, [concept?.collectionId]);

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

  // Use collection data from Shopify if available, otherwise use static data
  const displayTitle = collectionData?.title || concept.title;
  const displayDescription =
    collectionData?.description || concept.description || `כל המוצרים הממותגים בעיצוב ${concept.title}`;

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
          <span className="text-foreground">{displayTitle}</span>
        </nav>
      </div>

      {/* Page Header */}
      <section className="py-8 md:py-12 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{displayTitle}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{displayDescription}</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <ShopifyProductGrid
            query={concept.query}
            collectionHandle={concept.collectionHandle}
            collectionId={concept.collectionId}
            limit={50}
            filterByTitle={!concept.collectionHandle && !concept.collectionId}
          />
        </div>
      </section>
    </Layout>
  );
};

export default ShopifyConceptProducts;
