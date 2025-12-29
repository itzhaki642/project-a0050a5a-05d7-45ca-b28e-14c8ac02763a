import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CartDrawer = () => {
  const { items, updateQuantity, removeItem, totalItems, totalPrice, clearCart } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-right">עגלת הקניות</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">העגלה ריקה</p>
              <p className="text-sm text-muted-foreground mt-1">
                הוסיפו מוצרים לעגלה כדי להמשיך
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 pl-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-secondary/50 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm mb-1">
                        {item.name}
                      </h4>
                      <p className="text-foreground font-semibold">
                        ₪{item.price}
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>סה״כ</span>
                  <span>₪{totalPrice}</span>
                </div>
                <Button className="w-full" size="lg">
                  לתשלום
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCart}
                >
                  נקה עגלה
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
