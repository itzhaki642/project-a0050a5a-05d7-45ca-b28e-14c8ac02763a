import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "972549255848";
  const message = "שלום, אשמח לשמוע פרטים נוספים על שירותי המיתוג שלכם";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 bg-[#25D366] hover:bg-[#20BA5C] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="צור קשר בוואטסאפ"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
};

export default WhatsAppButton;
