import { Link } from "react-router-dom";
import { Instagram, Facebook, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-foreground mb-4">מיתוג אירועים</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              אנחנו מתמחים במיתוג אירועים מושלם - מימי הולדת לילדים ועד מזכרות יוקרתיות לכל סוג של אירוע.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-background border border-border hover:bg-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background border border-border hover:bg-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">קישורים מהירים</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/birthday" className="text-muted-foreground hover:text-foreground transition-colors">
                  ימי הולדת לילדים
                </Link>
              </li>
              <li>
                <Link to="/souvenirs" className="text-muted-foreground hover:text-foreground transition-colors">
                  מזכרות לאירועים
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  אודות
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  תקנון
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">צור קשר</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>050-1234567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@mitug-events.co.il</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>© 2024 מיתוג אירועים. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
