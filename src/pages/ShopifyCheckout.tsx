import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useShopifyCartStore } from "@/stores/shopifyCartStore";
import { formatPrice } from "@/lib/shopify";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Plus, Minus, Trash2, ShoppingBag, Send, CalendarIcon } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";

const SHIPPING_COST = 40;

type ShippingMethod = "delivery" | "pickup-afula" | "pickup-krayot";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "שם חייב להכיל לפחות 2 תווים").max(100, "שם ארוך מדי"),
  phone: z
    .string()
    .trim()
    .min(9, "מספר טלפון לא תקין")
    .max(15, "מספר טלפון לא תקין")
    .regex(/^[0-9\-\+\s]+$/, "מספר טלפון לא תקין"),
  email: z
    .string()
    .trim()
    .email("כתובת אימייל לא תקינה")
    .max(255, "כתובת אימייל ארוכה מדי")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().min(5, "כתובת חייבת להכיל לפחות 5 תווים").max(200, "כתובת ארוכה מדי"),
  city: z.string().trim().min(2, "עיר חייבת להכיל לפחות 2 תווים").max(50, "שם עיר ארוך מדי"),
  notes: z.string().trim().max(500, "הערות ארוכות מדי").optional(),
  eventDate: z.date().optional(),
  dedication: z.string().trim().max(500, "הקדשה ארוכה מדי").optional().or(z.literal("")),
  shippingMethod: z.enum(["delivery", "pickup-afula", "pickup-krayot"], {
    required_error: "יש לבחור שיטת משלוח",
  }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "יש לאשר את תנאי השימוש" }),
  }),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const ShopifyCheckout = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useShopifyCartStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const totalPrice = getTotalPrice();
  const currencyCode = items[0]?.price.currencyCode || "ILS";

  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
    eventDate: undefined,
    dedication: "",
    shippingMethod: "delivery",
    termsAccepted: false as unknown as true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if any item has "הקדשה על כל העמוד" selected
  const hasDedicationPage = items.some((item) =>
    item.customAttributes?.some((attr) => attr.value === "הקדשה על כל העמוד"),
  );

  const handleChange = (field: keyof CheckoutForm, value: string | Date | boolean | undefined) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const finalTotalPrice = form.shippingMethod === "delivery" ? totalPrice + SHIPPING_COST : totalPrice;

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
      .map((item) => {
        let itemText = `• ${item.product.node.title} x${item.quantity} - ${formatPrice((parseFloat(item.price.amount) * item.quantity).toString(), item.price.currencyCode)}`;

        // Add custom attributes (blessings) if any
        if (item.customAttributes && item.customAttributes.length > 0) {
          const attrs = item.customAttributes.map((attr) => `   ${attr.key}: ${attr.value}`).join("\n");
          itemText += `\n${attrs}`;
        }

        return itemText;
      })
      .join("\n");

    const hasEventDetails = form.eventDate || form.dedication;
    const eventDetailsSection = hasEventDetails
      ? `\n🎁 *פרטי האירוע:*
${form.eventDate ? `תאריך: ${format(form.eventDate, "dd/MM/yyyy")}` : ""}
${form.dedication ? `הקדשה: ${form.dedication}` : ""}`
      : "";

    const formattedShippingMethod =
      form.shippingMethod === "delivery"
        ? "משלוח עד הבית (3-5 ימי עסקים)"
        : form.shippingMethod === "pickup-afula"
          ? "איסוף עצמי - עפולה"
          : "איסוף עצמי - הקריות";

    const message = `🎉 *הזמנה חדשה - מיתוג אירועים*

👤 *פרטי הלקוח:*
שם: ${form.name}
טלפון: ${form.phone}
${form.email ? `אימייל: ${form.email}` : ""}
כתובת: ${form.address}, ${form.city}
שיטת משלוח: ${formattedShippingMethod}
${eventDetailsSection}

🛒 *פרטי ההזמנה:*
${itemsList}

💰 *סה״כ לתשלום: ${formatPrice(finalTotalPrice.toString(), currencyCode)}*
${form.shippingMethod === "delivery" ? `(כולל משלוח ${formatPrice(SHIPPING_COST.toString(), currencyCode)})` : ""}

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
    const whatsappNumber = "972549255848";
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
            <Link to="/souvenirs">לצפייה במוצרים</Link>
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
                {items.map((item, index) => (
                  <div key={`${item.variantId}-${index}`} className="flex gap-4 p-3 bg-secondary/30 rounded-lg">
                    <div className="w-16 h-16 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                      {item.product.node.images?.edges?.[0]?.node && (
                        <img
                          src={item.product.node.images.edges[0].node.url}
                          alt={item.product.node.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm mb-1">{item.product.node.title}</h4>
                      {item.variantTitle !== "Default Title" && (
                        <p className="text-xs text-muted-foreground">{item.variantTitle}</p>
                      )}
                      {/* Display custom attributes (blessings) */}
                      {item.customAttributes && item.customAttributes.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.customAttributes.map((attr, attrIndex) => (
                            <p key={attrIndex} className="truncate">
                              {attr.key}: {attr.value}
                            </p>
                          ))}
                        </div>
                      )}
                      <p className="text-foreground font-semibold text-sm">
                        {formatPrice(item.price.amount, item.price.currencyCode)} ליחידה
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 mr-auto text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.variantId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold text-foreground">
                          {formatPrice(
                            (parseFloat(item.price.amount) * item.quantity).toString(),
                            item.price.currencyCode,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span>שיטת משלוח</span>
                  <span>
                    {form.shippingMethod === "delivery" ? formatPrice(SHIPPING_COST.toString(), currencyCode) : "חינם"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>סה״כ לתשלום</span>
                  <span>{formatPrice(finalTotalPrice.toString(), currencyCode)}</span>
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
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
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
                  {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
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
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
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
                  {errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}
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
                  {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label className="mb-3 block">אפשרויות משלוח</Label>
                  <RadioGroup
                    value={form.shippingMethod}
                    onValueChange={(value) => handleChange("shippingMethod", value as ShippingMethod)}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3 border p-3 rounded-md">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer text-right">
                        <span className="font-semibold block">
                          משלוח עד הבית ({formatPrice(SHIPPING_COST.toString(), currencyCode)})
                        </span>
                        <span className="text-sm text-muted-foreground">3-5 ימי עסקים מרגע איסוף המשלוח</span>
                      </Label>
                    </div>
                    <div className="flex items-center gap-3 border p-3 rounded-md">
                      <RadioGroupItem value="pickup-afula" id="pickup-afula" />
                      <Label htmlFor="pickup-afula" className="flex-1 cursor-pointer text-right">
                        <span className="font-semibold block">איסוף עצמי - עפולה (חינם)</span>
                        <span className="text-sm text-muted-foreground">בתיאום מראש</span>
                      </Label>
                    </div>
                    <div className="flex items-center gap-3 border p-3 rounded-md">
                      <RadioGroupItem value="pickup-krayot" id="pickup-krayot" />
                      <Label htmlFor="pickup-krayot" className="flex-1 cursor-pointer text-right">
                        <span className="font-semibold block">איסוף עצמי - קריות (חינם)</span>
                        <span className="text-sm text-muted-foreground">בתיאום מראש</span>
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.shippingMethod && <p className="text-destructive text-sm mt-1">{errors.shippingMethod}</p>}
                </div>

                {/* Event Details Section */}
                <div className="border-t border-border pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">פרטי האירוע</h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="eventDate">תאריך האירוע</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-right font-normal",
                              !form.eventDate && "text-muted-foreground",
                              errors.eventDate && "border-destructive",
                            )}
                          >
                            <CalendarIcon className="ml-2 h-4 w-4" />
                            {form.eventDate ? format(form.eventDate, "PPP", { locale: he }) : "בחרו תאריך"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={form.eventDate}
                            onSelect={(date) => handleChange("eventDate", date)}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.eventDate && <p className="text-destructive text-sm mt-1">{errors.eventDate}</p>}
                    </div>

                    {/* Dedication field - shows if any item has "הקדשה על כל העמוד" */}
                    {hasDedicationPage && (
                      <div>
                        <Label htmlFor="dedication">פרטי ההקדשה *</Label>
                        <Textarea
                          id="dedication"
                          value={form.dedication}
                          onChange={(e) => handleChange("dedication", e.target.value)}
                          placeholder="הכניסו את טקסט ההקדשה שיופיע על העמוד"
                          rows={3}
                          className={errors.dedication ? "border-destructive" : ""}
                        />
                        {errors.dedication && <p className="text-destructive text-sm mt-1">{errors.dedication}</p>}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">הערות להזמנה</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="הערות מיוחדות"
                    rows={3}
                    className={errors.notes ? "border-destructive" : ""}
                  />
                  {errors.notes && <p className="text-destructive text-sm mt-1">{errors.notes}</p>}
                </div>

                {/* Terms Acceptance Checkbox */}
                <div className="flex items-start gap-3 mt-4">
                  <Checkbox
                    id="termsAccepted"
                    checked={form.termsAccepted}
                    onCheckedChange={(checked) => handleChange("termsAccepted", checked === true)}
                    className={errors.termsAccepted ? "border-destructive" : ""}
                  />
                  <Label htmlFor="termsAccepted" className="text-sm leading-relaxed cursor-pointer">
                    קראתי ואני מאשר/ת את{" "}
                    <Link to="/terms" target="_blank" className="text-primary underline hover:no-underline">
                      תנאי השימוש והתקנון
                    </Link>
                  </Label>
                </div>
                {errors.termsAccepted && <p className="text-destructive text-sm">{errors.termsAccepted}</p>}

                <Button className="w-full mt-6" size="lg" onClick={handleSubmit} disabled={isSubmitting}>
                  <Send className="ml-2 h-5 w-5" />
                  שליחת הזמנה בוואטסאפ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShopifyCheckout;
