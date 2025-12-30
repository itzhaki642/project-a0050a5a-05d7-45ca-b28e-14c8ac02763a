import Layout from "@/components/Layout";
import ConceptCard from "@/components/ConceptCard";
import conceptSafari from "@/assets/concept-safari.jpg";
import conceptPrincess from "@/assets/concept-princess.jpg";
import conceptSuperhero from "@/assets/concept-superhero.jpg";
import conceptDucks from "@/assets/duck_concept_collection.jpg";

const concepts = [
  {
    id: "ducks",
    title: "יום הולדת ברווזונים",
    image: conceptDucks,
    productCount: 14,
    isShopify: true,
  },
  {
    id: "safari",
    title: "יום הולדת ספארי",
    image: conceptSafari,
    productCount: 12,
  },
  {
    id: "princess",
    title: "יום הולדת נסיכות",
    image: conceptPrincess,
    productCount: 15,
  },
  {
    id: "superhero",
    title: "יום הולדת גיבורי על",
    image: conceptSuperhero,
    productCount: 10,
  },
];

const Birthday = () => {
  return (
    <Layout>
      {/* Page Header */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">ימי הולדת לילדים</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            בחרו קונספט לעיצוב וגלו את כל המוצרים הממותגים שלנו - מבועות סבון ועד חטיפים ממותגים
          </p>
        </div>
      </section>

      {/* Concepts Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {concepts.map((concept) => (
              <ConceptCard key={concept.id} {...concept} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Birthday;
