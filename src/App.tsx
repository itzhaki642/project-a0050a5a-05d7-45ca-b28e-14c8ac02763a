import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "./contexts/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import ShopifyCheckout from "./pages/ShopifyCheckout";
import Birthday from "./pages/Birthday";
import ConceptProducts from "./pages/ConceptProducts";
import ShopifyConceptProducts from "./pages/ShopifyConceptProducts";
import Souvenirs from "./pages/Souvenirs";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Accessibility from "./pages/Accessibility";
import Contact from "./pages/Contact";
import Sitemap from "./pages/Sitemap";
import FAQ from "./pages/FAQ";
import Product from "./pages/Product";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/birthday" element={<Birthday />} />
              <Route path="/birthday/:conceptId" element={<ConceptProducts />} />
              <Route path="/birthday/shopify/:conceptId" element={<ShopifyConceptProducts />} />
              <Route path="/souvenirs" element={<Souvenirs />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/shopify-checkout" element={<ShopifyCheckout />} />
              <Route path="/product/:handle" element={<Product />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
