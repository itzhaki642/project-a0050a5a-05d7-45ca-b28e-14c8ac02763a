import Layout from "@/components/Layout";

const Accessibility = () => {
  const currentDate = new Date().toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            הצהרת נגישות
          </h1>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Introduction */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">מבוא</h2>
              <p className="text-muted-foreground leading-relaxed">
                אתר מיתוג אירועים פועל להנגשת האתר והשירותים הניתנים בו לאנשים עם מוגבלויות, 
                מתוך אמונה ומחויבות לאפשר שימוש נוח ושוויוני באתר לכלל האוכלוסייה.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                הנגשת האתר בוצעה בהתאם להמלצות התקן הישראלי (ת"י 5568) לנגישות תכנים באינטרנט 
                ברמה AA ובהתאם לעקרונות הנגישות הבינלאומיים (WCAG 2.1).
              </p>
            </section>

            {/* Accessibility Features */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">התאמות הנגישות באתר</h2>
              <p className="text-muted-foreground mb-4">באתר זה בוצעו התאמות הנגישות הבאות:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>התאמה לקוראי מסך ותוכנות הקראה</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>ניווט באמצעות מקלדת בלבד</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>שינוי גודל הטקסט וצבעי התצוגה</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>ניגודיות גבוהה לשיפור הקריאות</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>הדגשת קישורים</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>שימוש בפונט קריא</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>עצירת אנימציות</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>תיאור מילולי לתמונות (Alt Text)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>מבנה כותרות היררכי וברור</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>טפסים מונגשים עם תוויות ברורות</span>
                </li>
              </ul>
            </section>

            {/* Accessibility Widget */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">תפריט הנגישות</h2>
              <p className="text-muted-foreground leading-relaxed">
                באתר קיים תפריט נגישות הזמין בכל עמוד. ניתן לגשת אליו באמצעות לחיצה על 
                כפתור הנגישות (אייקון של אדם בעיגול) הממוקם בצד שמאל למטה של המסך.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                תפריט הנגישות מאפשר התאמות אישיות הכוללות: הגדלה/הקטנת טקסט, ניגודיות גבוהה, 
                תצוגה בגווני אפור, הדגשת קישורים, פונט קריא ועצירת אנימציות.
              </p>
            </section>

            {/* Browser Compatibility */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">תאימות דפדפנים</h2>
              <p className="text-muted-foreground leading-relaxed">
                האתר תומך בדפדפנים הנפוצים בגרסאותיהם העדכניות:
              </p>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Google Chrome</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Mozilla Firefox</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Microsoft Edge</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Safari</span>
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">יצירת קשר בנושא נגישות</h2>
              <p className="text-muted-foreground leading-relaxed">
                אם נתקלתם בבעיית נגישות באתר, או שיש לכם הצעות לשיפור הנגישות, נשמח לשמוע מכם.
                אנו מתחייבים לטפל בכל פנייה בנושא נגישות בהקדם האפשרי.
              </p>
              <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                <p className="text-foreground font-medium mb-2">פרטי התקשרות:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <span className="font-medium">טלפון:</span> 054-9255848
                  </li>
                  <li>
                    <span className="font-medium">דוא"ל:</span> info@mitug-events.co.il
                  </li>
                  <li>
                    <span className="font-medium">רכז/ת נגישות:</span> מיתוג אירועים
                  </li>
                </ul>
              </div>
            </section>

            {/* Legal */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">מסגרת חוקית</h2>
              <p className="text-muted-foreground leading-relaxed">
                הצהרה זו נכתבה בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998 
                ותקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                החוק והתקנות קובעים כי יש לספק התאמות נגישות לשירותים מקוונים ולאתרי אינטרנט, 
                כך שאנשים עם מוגבלויות יוכלו להשתמש בהם באופן שוויוני.
              </p>
            </section>

            {/* Disclaimer */}
            <section className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">הבהרות</h2>
              <p className="text-muted-foreground leading-relaxed">
                אנו משקיעים מאמצים רבים להנגשת האתר. עם זאת, ייתכן שחלקים מסוימים באתר 
                עדיין אינם מונגשים במלואם. אנו ממשיכים לעבוד על שיפור הנגישות ומתחייבים 
                לטפל בכל בעיה שתובא לידיעתנו.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                במקרה של תוכן שאינו נגיש, ניתן לפנות אלינו ונשמח לסייע ולספק את המידע 
                בדרך חלופית.
              </p>
            </section>

            {/* Last Updated */}
            <section className="text-center py-6">
              <p className="text-muted-foreground text-sm">
                הצהרה זו עודכנה לאחרונה בתאריך: {currentDate}
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Accessibility;
