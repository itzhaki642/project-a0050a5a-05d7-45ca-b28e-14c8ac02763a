import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import ShopifyCartDrawer from "./ShopifyCartDrawer";
import logo from "@/assets/238d4b34d7502085a8904925abd8113e_430x.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "דף הבית", href: "/" },
    { label: "ימי הולדת לילדים", href: "/birthday" },
    { label: "מזכרות לאירועים", href: "/souvenirs" },
    { label: "בלוג", href: "/blog" },
    { label: "אודות", href: "/about" },
    { label: "צור קשר", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          {/* <Link to="/" className="text-2xl font-bold text-foreground tracking-tight">
            מיתוג אירועים
          </Link> */}

          <Link to="/" className="flex items-center">
            <img src={logo} alt="מיתוג אירועים" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2" aria-label="ניווט ראשי">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} className="nav-pill">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <ShopifyCartDrawer />

            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "סגור תפריט" : "פתח תפריט"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in" aria-label="ניווט ראשי">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
