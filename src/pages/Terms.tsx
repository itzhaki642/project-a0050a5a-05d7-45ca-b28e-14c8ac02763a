import Layout from "@/components/Layout";

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
            תקנון האתר
          </h1>
          
          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">כללי</h2>
              <p>
                ברוכים הבאים לאתר סטודיו טופז. השימוש באתר זה כפוף לתנאים המפורטים להלן. גלישה באתר ו/או רכישה באמצעותו מהווה הסכמה לתנאי תקנון זה.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">המוצרים והשירותים</h2>
              <p>
                האתר מציע שירותי עיצוב ומיתוג לאירועים, כולל אך לא מוגבל להזמנות, פוסטרים, באנרים ומוצרי מיתוג נוספים. התמונות באתר הינן להמחשה בלבד וייתכנו הבדלים קלים בין התמונה למוצר בפועל.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">הזמנות ותשלום</h2>
              <p>
                ההזמנה תיחשב כמאושרת רק לאחר קבלת אישור בכתב מצוות סטודיו טופז. התשלום יתבצע בהתאם לתנאים שיוסכמו מול הלקוח.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">ביטולים והחזרות</h2>
              <p>
                מאחר שמדובר במוצרים מותאמים אישית, לא ניתן לבטל הזמנה לאחר תחילת העבודה על העיצוב. במקרים חריגים, יש לפנות ישירות לצוות סטודיו טופז.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">קניין רוחני</h2>
              <p>
                כל העיצובים, התמונות והתכנים באתר הינם קניינה הבלעדי של סטודיו טופז ואין להעתיק, לשכפל או להפיץ אותם ללא אישור מראש ובכתב.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">יצירת קשר</h2>
              <p>
                לכל שאלה או בירור בנוגע לתקנון זה, ניתן לפנות אלינו בטלפון 054-9255848.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
