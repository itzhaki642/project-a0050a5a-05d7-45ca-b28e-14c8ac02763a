import Layout from "@/components/Layout";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
            קצת עלינו
          </h1>
          
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p className="text-xl text-foreground font-medium">
              חגיגה של אירוע מיוחד מתחילה בעיצוב הנכון.
            </p>
            
            <p>
              אם אתם מחפשים מיתוג ייחודי שיהפוך את האירוע שלכם לחוויה מרגשת ובלתי נשכחת, הגעתם למקום הנכון.
            </p>
            
            <p>
              אנחנו בסטודיו טופז מתמחים בעיצוב מיתוג אישי לאירועים, עם תשומת לב לפרטים הקטנים ויחס אישי לאורך כל הדרך. מבחינתנו כל אירוע הוא עולם שלם, ואנחנו כאן כדי להפוך את הרעיון שלכם לקונספט מעוצב שמרגיש מדויק לכם.
            </p>
            
            <p>
              אנחנו מעצבים מיתוג לאירועים מכל הסוגים, ימי הולדת, חתונות, בר ובת מצווה, אירועים עסקיים וכל חגיגה שחשוב לכם להפוך למיוחדת באמת.
            </p>
            
            <p>
              בסטודיו טופז תוכלו למצוא מגוון רחב של שירותי עיצוב, החל מעיצוב הזמנות, דרך חומרי הדפסה כמו פוסטרים, באנרים ופליירים, ועד עיצוב מיתוג מלא לאירוע כולו.
            </p>
            
            <p>
              עם ניסיון של אינספור אירועים, צוות מעצבים מקצועי ואהבה גדולה לעיצוב, אנחנו כאן כדי ללוות אתכם וליצור יחד אירוע שנשאר בזיכרון.
            </p>
            
            <p className="text-foreground font-medium">
              נשמח להכיר, לשמוע על האירוע שלכם ולתכנן יחד את העיצוב המושלם.
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <a href="tel:054-9255848">
              <Button size="lg" className="gap-2 text-lg">
                <Phone className="h-5 w-5" />
                054-9255848
              </Button>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
