import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import ShopifyProductGrid from "@/components/ShopifyProductGrid";
import brandedKitsHero from "@/assets/category-branded-kits.png";

const BrandedKits = () => {
  return (
    <Layout>
      <Helmet>
        <title>ערכות ממותגות לאירועים | מזכרות למסיבת רווקות, בר מצווה ואירועים - סטודיו טופז</title>
        <meta
          name="description"
          content="ערכות ממותגות לאירועים בעיצוב אישי - מזכרות למסיבת רווקות, ערכות ממותגות לבר מצווה, מזכרות לאירועים מיוחדים. עיצוב מקצועי ומשלוח לכל הארץ."
        />
        <meta
          name="keywords"
          content="ערכות ממותגות לאירועים, מזכרות למסיבת רווקות, ערכות ממותגות לבר מצווה, מזכרות לאירועים, מתנות ממותגות, ערכת מיתוג לאירוע"
        />
        <link rel="canonical" href="https://www.studio-topaz.co.il/branded-kits" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-right order-2 md:order-1">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                ערכות ממותגות לאירועים
              </h1>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                הפכו כל אירוע לחוויה בלתי נשכחת עם ערכות ממותגות בעיצוב אישי.
                מסיבת רווקות, בר מצווה, בת מצווה, ימי הולדת ואירועים מיוחדים -
                כל ערכה מעוצבת בקפידה עם המיתוג שלכם.
              </p>
              <p className="text-muted-foreground text-sm">
                מגוון מוצרים ממותגים: מגבונים, קרם ידיים, בקבוקי שתייה, שלטי דלת, מניפות ועוד
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src={brandedKitsHero}
                alt="ערכות ממותגות לאירועים - מזכרות מעוצבות בהתאמה אישית"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              המוצרים שלנו
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              כל המוצרים מגיעים עם מיתוג אישי בהתאמה מלאה לאירוע שלכם
            </p>
          </div>
          <ShopifyProductGrid
            collectionHandle="ערכות-ממותגות-לאירועים"
            limit={20}
          />
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
            למה לבחור ערכות ממותגות לאירוע?
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-right">
            <p>
              ערכות ממותגות לאירועים הן הדרך המושלמת להעניק לאורחים חוויה ייחודית ובלתי נשכחת.
              בין אם מדובר במסיבת רווקות, בר מצווה, בת מצווה או כל אירוע מיוחד אחר -
              מיתוג אישי על המוצרים מעלה את האירוע לרמה אחרת.
            </p>
            <p>
              בסטודיו טופז אנחנו מתמחים בעיצוב ערכות ממותגות הכוללות מגוון רחב של מוצרים:
              מגבונים ממותגים, קרם ידיים, שלטי "נא לא להפריע", כרטיסי עלייה למטוס מעוצבים,
              מניפות, בקבוקי שתייה ועוד - הכל בעיצוב אחיד ומרשים.
            </p>
            <p>
              כל ערכה מותאמת אישית לקונספט של האירוע שלכם, עם שם החוגג/ת, צבעים, גרפיקה ומיתוג מלא.
              אנחנו דואגים לכל פרט כדי שתקבלו תוצאה מושלמת.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BrandedKits;
