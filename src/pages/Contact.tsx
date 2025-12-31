import Layout from "@/components/Layout";
import { Phone, Mail, Instagram, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">צור קשר</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            נשמח לשמוע מכם! צרו איתנו קשר בכל שאלה, בקשה או הצעה
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6">פרטי התקשרות</h2>

            <div className="space-y-6">
              {/* Phone */}
              <a
                href="tel:0549255848"
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:bg-secondary/50 transition-colors group"
                aria-label="התקשר: 054-925-5848"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors" aria-hidden="true">
                  <Phone className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">טלפון</p>
                  <p className="text-lg font-medium text-foreground" dir="ltr">
                    054-925-5848
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:topazlstudio@gmail.com"
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:bg-secondary/50 transition-colors group"
                aria-label="שלח אימייל: topazlstudio@gmail.com"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors" aria-hidden="true">
                  <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">אימייל</p>
                  <p className="text-lg font-medium text-foreground">topazlstudio@gmail.com</p>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/studio_topazl/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:bg-secondary/50 transition-colors group"
                aria-label="עקוב אחרינו באינסטגרם: @studio_topazl (פתיחה בחלון חדש)"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors" aria-hidden="true">
                  <Instagram className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">אינסטגרם</p>
                  <p className="text-lg font-medium text-foreground">@studio_topazl</p>
                </div>
              </a>
            </div>

            {/* Working Hours */}
            <div className="mt-8 p-6 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-foreground">שעות פעילות</h3>
              </div>
              <div className="space-y-2 text-muted-foreground">
                <p>ימים א׳-ה׳: 09:00 - 18:00</p>
                <p>יום ו׳: 09:00 - 13:00</p>
                <p>שבת: סגור</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col justify-center">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-4">רוצים להזמין?</h2>
              <p className="text-muted-foreground mb-6">
                עיינו במגוון המוצרים שלנו והוסיפו לעגלה, או צרו קשר ישירות בוואטסאפ לייעוץ אישי
              </p>

              <div className="space-y-4">
                <Link
                  to="/birthday"
                  className="block w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  מוצרי יום הולדת
                </Link>
                <Link
                  to="/souvenirs"
                  className="block w-full py-3 px-6 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                >
                  מזכרות לאירועים
                </Link>
                <a
                  href="https://wa.me/972549255848"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 px-6 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  שלחו הודעה בוואטסאפ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
