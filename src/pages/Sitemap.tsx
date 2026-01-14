import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Home, Gift, Heart, Sparkles, Info, Phone, FileText, Accessibility, Map, HelpCircle, BookOpen } from "lucide-react";

const Sitemap = () => {
  const pages = [
    { name: "דף הבית", path: "/", icon: Home, description: "עמוד הבית הראשי של האתר" },
    { name: "ימי הולדת לילדים", path: "/birthday", icon: Gift, description: "כל המוצרים והקונספטים לימי הולדת" },
    { name: "מזכרות לאירועים", path: "/souvenirs", icon: Heart, description: "מזכרות מיוחדות לאירועים" },
    { name: "בלוג", path: "/blog", icon: BookOpen, description: "מאמרים וטיפים לאירועים" },
    { name: "אודות", path: "/about", icon: Info, description: "קצת עלינו והסיפור שלנו" },
    { name: "צור קשר", path: "/contact", icon: Phone, description: "פרטי התקשרות ושעות פעילות" },
    { name: "תקנון האתר", path: "/terms", icon: FileText, description: "תנאי השימוש באתר" },
    { name: "הצהרת נגישות", path: "/accessibility", icon: Accessibility, description: "מידע על נגישות האתר" },
    { name: "שאלות נפוצות", path: "/faq", icon: HelpCircle, description: "תשובות לשאלות נפוצות" },
  ];

  const concepts = [
    { name: "נסיכות", path: "/birthday/princess" },
    { name: "גיבורי על", path: "/birthday/superhero" },
    { name: "ספארי", path: "/birthday/safari" },
    { name: "ברווזים", path: "/birthday/ducks" },
    { name: "דובונים", path: "/birthday/bears" },
    { name: "תות", path: "/birthday/strawberries" },
    { name: "גלידה", path: "/birthday/ice-cream" },
    { name: "פיות", path: "/birthday/fairy" },
    { name: "עיצוב אישי", path: "/birthday/custom-design" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Map className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">מפת האתר</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            כל העמודים באתר במקום אחד
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Pages */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-2">
              עמודים ראשיים
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pages.map((page) => (
                <Link
                  key={page.path + page.name}
                  to={page.path}
                  className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg hover:bg-secondary/50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <page.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {page.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{page.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Concepts */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6 border-b border-border pb-2">
              קונספטים
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {concepts.map((concept) => (
                <Link
                  key={concept.path}
                  to={concept.path}
                  className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:bg-secondary/50 transition-colors group"
                >
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {concept.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sitemap;
