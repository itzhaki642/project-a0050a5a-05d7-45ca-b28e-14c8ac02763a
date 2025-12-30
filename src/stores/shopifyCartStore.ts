import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct, createStorefrontCheckout } from '@/lib/shopify';

export interface ShopifyCartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  customAttributes?: Array<{
    key: string;
    value: string;
  }>;
}

interface ShopifyCartStore {
  items: ShopifyCartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  
  // Actions
  addItem: (item: ShopifyCartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  createCheckout: () => Promise<string | null>;
  
  // Computed values (as functions)
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useShopifyCartStore = create<ShopifyCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,

      addItem: (item) => {
        const { items } = get();
        // For items with custom attributes, create a unique key
        const itemKey = item.customAttributes?.length 
          ? `${item.variantId}-${JSON.stringify(item.customAttributes)}`
          : item.variantId;
        
        const existingItem = items.find(i => {
          const existingKey = i.customAttributes?.length 
            ? `${i.variantId}-${JSON.stringify(i.customAttributes)}`
            : i.variantId;
          return existingKey === itemKey;
        });
        
        if (existingItem) {
          set({
            items: items.map(i => {
              const existingKey = i.customAttributes?.length 
                ? `${i.variantId}-${JSON.stringify(i.customAttributes)}`
                : i.variantId;
              return existingKey === itemKey
                ? { ...i, quantity: i.quantity + item.quantity }
                : i;
            })
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(item => item.variantId !== variantId)
        });
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },

      setCartId: (cartId) => set({ cartId }),
      setCheckoutUrl: (checkoutUrl) => set({ checkoutUrl }),
      setLoading: (isLoading) => set({ isLoading }),

      createCheckout: async () => {
        const { items, setLoading, setCheckoutUrl } = get();
        if (items.length === 0) return null;

        setLoading(true);
        try {
          const checkoutUrl = await createStorefrontCheckout(
            items.map(item => ({
              variantId: item.variantId,
              quantity: item.quantity,
              customAttributes: item.customAttributes
            }))
          );
          setCheckoutUrl(checkoutUrl);
          return checkoutUrl;
        } catch (error) {
          console.error('Failed to create checkout:', error);
          return null;
        } finally {
          setLoading(false);
        }
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
      }
    }),
    {
      name: 'shopify-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
