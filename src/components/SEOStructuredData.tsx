import { Helmet } from "react-helmet-async";

interface Review {
  author: string;
  reviewBody: string;
  ratingValue: number;
}

interface SEOStructuredDataProps {
  reviews?: Review[];
}

const SEOStructuredData = ({ reviews }: SEOStructuredDataProps) => {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "סטודיו טופז - יום הולדת לילדים ומזכרות לאירועים",
    description:
      "יום הולדת לילדים עם מוצרים ממותגים בעיצוב אישי, מזכרות לאירועים לבר מצווה וחתונות, ברכונים לאירועים. משלוח לכל הארץ.",
    image: "https://mitug-events.co.il/og-image.jpg",
    telephone: "+972-54-925-5848",
    email: "topazlstudio@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IL",
      addressLocality: "ישראל",
    },
    priceRange: "₪₪",
    openingHours: "Su-Th 09:00-18:00",
    sameAs: ["https://www.instagram.com/studio_topazl"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "500",
      bestRating: "5",
      worstRating: "1",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "מוצרים ממותגים לאירועים",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "יום הולדת לילדים",
          description: "מוצרים ממותגים ליום הולדת לילדים - ספארי, ברווזים, דובי, תותים",
        },
        {
          "@type": "OfferCatalog",
          name: "מזכרות לאירועים",
          description: "מזכרות ממותגות לבר מצווה, בת מצווה, חתונות ואירועים",
        },
        {
          "@type": "OfferCatalog",
          name: "ברכונים לאירועים",
          description: "ברכונים מעוצבים וממותגים לכל סוגי האירועים",
        },
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "מה כולל יום הולדת לילדים ממותג?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "יום הולדת ממותג כולל מגוון מוצרים מעוצבים בקונספט אחיד: בועות סבון, שוקולדים, חטיפים, שקיות הפתעה, כובעים ועוד. כל המוצרים מותאמים אישית עם שם הילד/ה ותמונה.",
        },
      },
      {
        "@type": "Question",
        name: "אילו סוגי מזכרות לאירועים אתם מציעים?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "אנו מציעים מזכרות ממותגות לבר מצווה, בת מצווה, חתונות וברית: מגנטים, מחזיקי מפתחות, נרות ריחניים, שוקולדים בלגיים, סבונים טבעיים ועוד.",
        },
      },
      {
        "@type": "Question",
        name: "האם אפשר להזמין ברכונים לאירועים בעיצוב מותאם אישית?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "בהחלט! ניתן להזמין ברכונים לאירועים בעיצוב אישי לפי בקשתכם. ספרו לנו על הרעיון ואנחנו ניצור עבורכם עיצוב ייחודי.",
        },
      },
    ],
  };

  const reviewsSchema =
    reviews && reviews.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: "יום הולדת לילדים ומזכרות לאירועים",
          description: "מוצרים ממותגים בעיצוב אישי ליום הולדת לילדים, מזכרות לאירועים וברכונים",
          brand: {
            "@type": "Brand",
            name: "סטודיו טופז",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5",
            reviewCount: String(reviews.length),
            bestRating: "5",
            worstRating: "1",
          },
          review: reviews.map((review) => ({
            "@type": "Review",
            author: {
              "@type": "Person",
              name: review.author,
            },
            reviewBody: review.reviewBody,
            reviewRating: {
              "@type": "Rating",
              ratingValue: String(review.ratingValue),
              bestRating: "5",
              worstRating: "1",
            },
          })),
        }
      : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(businessSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      {reviewsSchema && <script type="application/ld+json">{JSON.stringify(reviewsSchema)}</script>}
    </Helmet>
  );
};

export default SEOStructuredData;
