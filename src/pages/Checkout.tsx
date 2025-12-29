import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Plus, Minus, Trash2, ShoppingBag, Send } from "lucide-react";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "שם חייב להכיל לפחות 2 תווים").max(100, "שם ארוך מדי"),
  phone: z.string().trim().min(9, "מספר טלפון לא תקין").max(15, "מספר טלפון לא תקין").regex(/^[0-9\-\+\s]+$/, "מספר טלפון לא תקין"),
  email: z.string().trim().email("כתובת אימייל לא תקינה").max(255, "כתובת אימייל ארוכה מדי").optional().or(z.literal("")),
  address: z.string().trim().min(5, "כתובת חייבת להכיל לפחות 5 תווים").max(200, "כתובת ארוכה מדי"),
  city: z.string().trim().min(2, "עיר חייבת להכיל לפחות 2 תווים").max(50, "שם עיר ארוך מדי"),
  notes: z.string().trim().max(500, "הערות ארוכות מדי").optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const newErrors: Partial<Record<keyof CheckoutForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof CheckoutForm;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const generateWhatsAppMessage = (): string => {
    const itemsList = items
      .map((item) => `• ${item.name} x${item.quantity} - ₪${item.price * item.quantity}`)
      .join("\n");

    const message = `🎉 *הזמנה חדשה - מיתוג אירועים*

👤 *פרטי הלקוח:*
שם: ${form.name}
טלפון: ${form.phone}
${form.email ? `אימייל: ${form.email}` : ""}
כתובת: ${form.address}, ${form.city}

🛒 *פרטי ההזמנה:*
${itemsList}

💰 *סה״כ לתשלום: ₪${totalPrice}*

${form.notes ? `📝 *הערות:*\n${form.notes}` : ""}`;

    return encodeURIComponent(message);
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      toast({
        title: "העגלה ריקה",
        description: "הוסיפו מוצרים לעגלה כדי להמשיך",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "שגיאה בטופס",
        description: "נא למלא את כל השדות הנדרשים",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Open WhatsApp with the order
    const whatsappNumber = "972501234567"; // Replace with actual number
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    window.open(whatsappUrl, "_blank");
    
    toast({
      title: "ההזמנה נשלחה!",
      description: "נפתח חלון WhatsApp לשליחת ההזמנה",
    });
    
    clearCart();
    setIsSubmitting(false);
    navigate("/");
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-4">העגלה ריקה</h1>
          <p className="text-muted-foreground mb-8">הוסיפו מוצרים לעגלה כדי להמשיך לקופה</p>
          <Button asChild>
            <Link to="/birthday">לצפייה במוצרים</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            דף הבית
          </Link>
          <ChevronLeft className="h-4 w-4" />
          <span className="text-foreground">קופה</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">השלמת הזמנה</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">סיכום הזמנה</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-secondary/30 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm mb-1">
                        {item.name}
                      </h4>
                      <p className="text-foreground font-semibold text-sm">
                        ₪{item.price} ליחידה
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 mr-auto text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold text-foreground">
                          ₪{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>סה״כ לתשלום</span>
                  <span>₪{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">פרטי משלוח</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">שם מלא *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="הכניסו את שמכם המלא"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">טלפון *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="050-1234567"
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">אימייל (לא חובה)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your@email.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">כתובת למשלוח *</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="רחוב, מספר בית, דירה"
                    className={errors.address ? "border-destructive" : ""}
                  />
                  {errors.address && (
                    <p className="text-destructive text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="city">עיר *</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="תל אביב"
                    className={errors.city ? "border-destructive" : ""}
                  />
                  {errors.city && (
                    <p className="text-destructive text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">הערות להזמנה</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="הערות מיוחדות, תאריך אירוע, וכו׳"
                    rows={3}
                    className={errors.notes ? "border-destructive" : ""}
                  />
                  {errors.notes && (
                    <p className="text-destructive text-sm mt-1">{errors.notes}</p>
                  )}
                </div>

                <Button
                  className="w-full mt-6 gap-2"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Send className="h-5 w-5" />
                  שלח הזמנה בוואטסאפ
                </Button>

                <p className="text-muted-foreground text-sm text-center mt-4">
                  לאחר הלחיצה ייפתח WhatsApp עם פרטי ההזמנה
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
