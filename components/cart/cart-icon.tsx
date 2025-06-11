"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";

export function CartIcon() {
  const { getCartItemCount } = useCart();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const fetchItemCount = async () => {
      try {
        const count = await getCartItemCount();
        setItemCount(count);
      } catch (error) {
        console.error("Failed to fetch cart item count:", error);
      }
    };

    fetchItemCount();

    // Refresh count every 5 seconds (you might want to use a more sophisticated approach)
    const interval = setInterval(fetchItemCount, 5000);

    return () => clearInterval(interval);
  }, [getCartItemCount]);

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
}
