"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export type CartProduct = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
};

export type CartLine = CartProduct & {
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  count: number;
  subtotal: number;
  addItem: (product: CartProduct, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "art-by-dhruvangi-cart";

function readStoredCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as CartLine[];
  } catch {
    return [];
  }
}

function writeStoredCart(items: CartLine[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [items, setItems] = useState<CartLine[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/cart")
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((data) => setItems(data.items ?? []))
        .catch(() => setItems(readStoredCart()));
      return;
    }

    if (status !== "loading") {
      setItems(readStoredCart());
    }
  }, [status]);

  const persist = useCallback(
    async (nextItems: CartLine[]) => {
      setItems(nextItems);

      if (status === "authenticated") {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: nextItems })
        });
      } else {
        writeStoredCart(nextItems);
      }
    },
    [status]
  );

  const addItem = useCallback(
    async (product: CartProduct, quantity = 1) => {
      const nextItems = [...items];
      const existing = nextItems.find((item) => item.productId === product.productId);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock);
      } else {
        nextItems.push({ ...product, quantity: Math.min(quantity, product.stock) });
      }

      await persist(nextItems);
      toast.success("Added to cart");
    },
    [items, persist]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      const nextItems = items
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
            : item
        )
        .filter((item) => item.quantity > 0);

      await persist(nextItems);
    },
    [items, persist]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      await persist(items.filter((item) => item.productId !== productId));
      toast.success("Removed from cart");
    },
    [items, persist]
  );

  const clearCart = useCallback(async () => {
    setItems([]);

    if (status === "authenticated") {
      await fetch("/api/cart", { method: "DELETE" });
    } else if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [status]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
      clearCart
    }),
    [addItem, clearCart, items, removeItem, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
