/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STORE_PERMANENT_DOMAIN = "event-jewels-hebrew-0tjeh.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "c2aea6859a21c68d12ef5d704aec2002";

const SITE_DOMAIN = "https://www.studio-topaz.co.il";

// All collection IDs from the conceptsData
const COLLECTIONS = [
  { id: "gid://shopify/Collection/304718086280", conceptSlug: "ducks" },
  { id: "gid://shopify/Collection/304718381192", conceptSlug: "safari" },
  { id: "gid://shopify/Collection/304719397000", conceptSlug: "bears" },
  { id: "gid://shopify/Collection/304719429768", conceptSlug: "strawberries" },
  { id: "gid://shopify/Collection/304766550152", conceptSlug: "ice-cream" },
  { id: "gid://shopify/Collection/304938057864", conceptSlug: "fairy" },
  { id: "gid://shopify/Collection/304752787592", conceptSlug: "custom-design" },
];

// Souvenirs collection
const SOUVENIRS_COLLECTION_HANDLE = "מזכרות-לאירועים";

const COLLECTION_PRODUCTS_QUERY = `
  query GetCollectionProductsById($id: ID!, $first: Int!) {
    node(id: $id) {
      ... on Collection {
        products(first: $first) {
          edges {
            node {
              handle
              updatedAt
            }
          }
        }
      }
    }
  }
`;

const COLLECTION_BY_HANDLE_QUERY = `
  query GetCollectionProducts($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      products(first: $first) {
        edges {
          node {
            handle
            updatedAt
          }
        }
      }
    }
  }
`;

interface ProductEdge {
  node: {
    handle: string;
    updatedAt: string;
  };
}

async function shopifyRequest(query: string, variables: Record<string, unknown>) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  return response.json();
}

async function fetchProductsFromCollection(collectionId: string): Promise<ProductEdge[]> {
  try {
    const data = await shopifyRequest(COLLECTION_PRODUCTS_QUERY, {
      id: collectionId,
      first: 100,
    });
    return data?.data?.node?.products?.edges || [];
  } catch (error) {
    console.error(`Error fetching collection ${collectionId}:`, error);
    return [];
  }
}

async function fetchProductsFromCollectionByHandle(handle: string): Promise<ProductEdge[]> {
  try {
    const data = await shopifyRequest(COLLECTION_BY_HANDLE_QUERY, {
      handle,
      first: 100,
    });
    return data?.data?.collectionByHandle?.products?.edges || [];
  } catch (error) {
    console.error(`Error fetching collection by handle ${handle}:`, error);
    return [];
  }
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

function generateSitemapXml(productUrls: Array<{ loc: string; lastmod: string }>): string {
  const today = formatDate(new Date());

  // Static pages
  const staticPages = [
    { loc: `${SITE_DOMAIN}/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${SITE_DOMAIN}/birthday`, priority: "0.9", changefreq: "weekly" },
    { loc: `${SITE_DOMAIN}/birthday/ducks`, priority: "0.8", changefreq: "weekly" },
    { loc: `${SITE_DOMAIN}/birthday/safari`, priority: "0.8", changefreq: "weekly" },
    { loc: `${SITE_DOMAIN}/birthday/bears`, priority: "0.8", changefreq: "weekly" },
    { loc: `${SITE_DOMAIN}/birthday/strawberries`, priority: "0.8", changefreq: "weekly" },
    { loc: `${SITE_DOMAIN}/birthday/ice-cream`, priority: "0.8", changefreq: "weekly" },
    { loc: `${SITE_DOMAIN}/birthday/fairy`, priority: "0.8", changefreq: "weekly" },
    { loc: `${SITE_DOMAIN}/birthday/custom-design`, priority: "0.8", changefreq: "weekly" },
    { loc: `${SITE_DOMAIN}/souvenirs`, priority: "0.9", changefreq: "weekly" },
    { loc: `${SITE_DOMAIN}/about`, priority: "0.6", changefreq: "monthly" },
    { loc: `${SITE_DOMAIN}/contact`, priority: "0.7", changefreq: "monthly" },
    { loc: `${SITE_DOMAIN}/faq`, priority: "0.6", changefreq: "monthly" },
    { loc: `${SITE_DOMAIN}/blog`, priority: "0.7", changefreq: "weekly" },
    { loc: `${SITE_DOMAIN}/sitemap`, priority: "0.4", changefreq: "monthly" },
    { loc: `${SITE_DOMAIN}/terms`, priority: "0.3", changefreq: "yearly" },
    { loc: `${SITE_DOMAIN}/accessibility`, priority: "0.3", changefreq: "yearly" },
  ];

  const staticUrlsXml = staticPages
    .map(
      (page) => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("\n");

  const productUrlsXml = productUrls
    .map(
      (product) => `  <url>
    <loc>${product.loc}</loc>
    <lastmod>${product.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrlsXml}
${productUrlsXml}
</urlset>`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting sitemap generation...");

    // Collect all product handles with their last modified dates
    const productMap = new Map<string, string>();

    // Fetch products from all birthday concept collections
    for (const collection of COLLECTIONS) {
      console.log(`Fetching products from collection: ${collection.conceptSlug}`);
      const products = await fetchProductsFromCollection(collection.id);
      for (const edge of products) {
        const handle = edge.node.handle;
        const updatedAt = edge.node.updatedAt;
        // Keep the most recent update date if product exists in multiple collections
        if (!productMap.has(handle) || productMap.get(handle)! < updatedAt) {
          productMap.set(handle, updatedAt);
        }
      }
    }

    // Fetch products from souvenirs collection
    console.log("Fetching products from souvenirs collection...");
    const souvenirProducts = await fetchProductsFromCollectionByHandle(SOUVENIRS_COLLECTION_HANDLE);
    for (const edge of souvenirProducts) {
      const handle = edge.node.handle;
      const updatedAt = edge.node.updatedAt;
      if (!productMap.has(handle) || productMap.get(handle)! < updatedAt) {
        productMap.set(handle, updatedAt);
      }
    }

    console.log(`Found ${productMap.size} unique products across all collections`);

    // Convert to URL array
    const productUrls = Array.from(productMap.entries()).map(([handle, updatedAt]) => ({
      loc: `${SITE_DOMAIN}/product/${handle}`,
      lastmod: formatDate(updatedAt),
    }));

    // Generate XML
    const sitemapXml = generateSitemapXml(productUrls);

    console.log("Sitemap generated successfully");

    return new Response(sitemapXml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate sitemap", details: String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
