import Layout from "@/components/Layout";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      category: "הזמנות ומשלוחים",
      questions: [
        {
          question: "כמה זמן לוקח להכין הזמנה?",
          answer:
            "זמן ההכנה תלוי בסוג המוצר וכמות הפריטים. בדרך כלל, הזמנות מוכנות תוך 3-7 ימי עסקים. להזמנות דחופות, צרו קשר ונשתדל להתאים.",
        },
        {
          question: "האם יש משלוחים?",
          answer:
            "כן! אנחנו מספקים משלוחים לכל הארץ. עלות המשלוח תלויה במיקום ובגודל ההזמנה. ניתן גם לאסוף עצמאית בתיאום מראש.",
        },
        {
          question: "מהי מדיניות הביטולים?",
          answer:
            "ניתן לבטל הזמנה עד 48 שעות לפני מועד האירוע ולקבל החזר מלא. לאחר מכן, ייתכנו דמי ביטול בהתאם לשלב ההכנה.",
        },
      ],
    },
    {
      category: "מוצרי יום הולדת",
      questions: [
        {
          question: "האם אפשר להתאים אישית את העיצובים?",
          answer:
            "בהחלט! כל המוצרים שלנו ניתנים להתאמה אישית - שם החוגג/ת, גיל, צבעים ועיצוב לפי בקשה. פשוט ציינו את הפרטים בהזמנה.",
        },
        {
          question: "מהם הקונספטים הזמינים?",
          answer:
            "יש לנו מגוון קונספטים כמו נסיכות, גיבורי על, ספארי ועוד. אם יש לכם רעיון לקונספט אחר - דברו איתנו ונשמח ליצור משהו מיוחד.",
        },
        {
          question: "מה כולל ערכת יום הולדת?",
          answer:
            "ערכות יום הולדת כוללות בדרך כלל הזמנות, שלטים, מדבקות, כובעים ועוד. ניתן להרכיב ערכה מותאמת אישית לפי הצרכים שלכם.",
        },
      ],
    },
    {
      category: "מזכרות לאירועים",
      questions: [
        {
          question: "לאילו אירועים מתאימות המזכרות?",
          answer:
            "המזכרות שלנו מתאימות לכל סוגי האירועים - בריתות, בר/בת מצווה, חתונות, ימי הולדת עגולים, אירועי חברה ועוד.",
        },
        {
          question: "מה ההבדל בין סוגי המזכרות?",
          answer:
            "יש לנו מזכרות במחירים ובסגנונות שונים - ממזכרות קטנות ופשוטות ועד מזכרות יוקרתיות ומרשימות. נשמח לייעץ לכם מה מתאים לאירוע שלכם.",
        },
        {
          question: "האם אפשר להוסיף הקדשה אישית?",
          answer: "כן! ניתן להוסיף הקדשה אישית לכל מזכרת. פשוט ציינו את הטקסט הרצוי בעת ההזמנה.",
        },
      ],
    },
    {
      category: "תשלום ומחירים",
      questions: [
        {
          question: "מהן אפשרויות התשלום?",
          answer: "אנחנו מקבלים תשלום במזומן, העברה בנקאית, ביט ופייבוקס. לפרטים נוספים צרו קשר.",
        },
        {
          question: "האם יש מינימום הזמנה?",
          answer: "כן, ישנו מינימום הזמנה שמשתנה לפי סוג המוצר. צרו קשר לפרטים מדויקים.",
        },
        {
          question: "האם המחירים כוללים מע״מ?",
          answer: "כל המחירים המוצגים באתר כוללים מע״מ.",
        },
      ],
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">שאלות נפוצות</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            מצאו תשובות לשאלות הנפוצות ביותר. לא מצאתם את מה שחיפשתם? צרו איתנו קשר!
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-xl font-semibold text-foreground mb-4 pr-2 border-r-4 border-primary">
                {category.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`${categoryIndex}-${faqIndex}`}
                    className="bg-card border border-border rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-right hover:no-underline">
                      <span className="text-foreground font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">לא מצאתם תשובה לשאלה שלכם?</p>
          <a
            href="https://wa.me/972549255848"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-3 px-8 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            שלחו לנו הודעה בוואטסאפ
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
