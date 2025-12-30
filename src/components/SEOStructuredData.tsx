import { Helmet } from 'react-helmet-async';

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
    "name": "סטודיו טופז - מיתוג אירועים",
    "description": "מוצרים ממותגים לימי הולדת לילדים ומזכרות לאירועים. עיצוב אישי, איכות מעולה ומשלוח לכל הארץ.",
    "image": "https://mitug-events.co.il/og-image.jpg",
    "telephone": "+972-54-925-5858",
    "email": "topazlstudio@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IL",
      "addressLocality": "ישראל"
    },
    "priceRange": "₪₪",
    "openingHours": "Su-Th 09:00-18:00",
    "sameAs": [
      "https://www.instagram.com/studio_topazl"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const reviewsSchema = reviews && reviews.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "מוצרים ממותגים לאירועים",
    "description": "מוצרים ממותגים בעיצוב אישי לימי הולדת ואירועים",
    "brand": {
      "@type": "Brand",
      "name": "סטודיו טופז"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": String(reviews.length),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewBody": review.reviewBody,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": String(review.ratingValue),
        "bestRating": "5",
        "worstRating": "1"
      }
    }))
  } : null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(businessSchema)}
      </script>
      {reviewsSchema && (
        <script type="application/ld+json">
          {JSON.stringify(reviewsSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOStructuredData;
