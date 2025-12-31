import { Package, Send, MessageCircle, Truck } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "בחירת מוצרים",
    description: "בחרו מהקולקציות שלנו או ספרו לנו על הרעיון שלכם",
  },
  {
    icon: Send,
    title: "שליחת ההזמנה",
    description: "שלחו לנו את הפרטים דרך וואטסאפ או טופס ההזמנה",
  },
  {
    icon: MessageCircle,
    title: "תיאום ואישור",
    description: "ניצור איתכם קשר תוך 24 שעות לאישור פרטים והתאמות",
  },
  {
    icon: Truck,
    title: "הכנה ומשלוח",
    description: "המוצרים מיוצרים בעבודת יד ונשלחים עד הדלת או לאיסוף עצמי",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 bg-accent/30" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            איך זה עובד?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            כל מוצר מותאם אישית ומיוצר בעבודת יד במיוחד עבורכם
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              {/* Connector line - hidden on mobile and last item */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 right-0 w-full h-0.5 bg-border -z-10 translate-x-1/2" />
              )}
              
              {/* Step number + icon */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground mb-4 transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
                <step.icon className="w-8 h-8" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center border-2 border-background" aria-label={`שלב ${index + 1}`}>
                  {index + 1}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Custom design note */}
        <div className="max-w-2xl mx-auto bg-background border border-border rounded-2xl p-6 text-center shadow-sm">
          <p className="text-foreground font-medium mb-2">
            💡 לא מצאתם את העיצוב שחלמתם עליו?
          </p>
          <p className="text-muted-foreground text-sm">
            אין בעיה! ספרו לנו על הרעיון שלכם ואנחנו ניצור עבורכם עיצוב מותאם אישית בדיוק כמו שדמיינתם.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
