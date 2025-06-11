"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { CartItem } from "./cart-item";
import { CartWithItems } from "@/lib/cart";

export function Cart() {
  const { getCartWithItems, clearCart, createOrder } = useCart();
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customerEmail, setCustomerEmail] = useState("");

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await getCartWithItems();
      setCart(cartData);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleClearCart = async () => {
    try {
      await clearCart();
      await fetchCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const handleCreateOrder = async () => {
    if (!customerEmail.trim()) {
      alert("Please enter your email address");
      return;
    }

    try {
      await createOrder(customerEmail);
      await fetchCart(); // Refresh cart after order creation
      setCustomerEmail("");
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Shopping Cart</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p>Loading cart...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const cartItems = cart?.cart_items || [];
  const isEmpty = cartItems.length === 0;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price_at_addition * item.quantity,
    0
  );

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Shopping Cart ({itemCount} items)</span>
          </CardTitle>

          {!isEmpty && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isEmpty ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">Your cart is empty</p>
            <p className="text-sm text-gray-400">
              Add some products to get started
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {/* Cart Items */}
            <div className="divide-y">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} onUpdate={fetchCart} />
              ))}
            </div>

            {/* Cart Summary */}
            <div className="pt-4 border-t mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold">{formatPrice(total)}</span>
              </div>

              {/* Email Input for Order */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address (for order)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <Button
                  onClick={handleCreateOrder}
                  className="w-full"
                  disabled={!customerEmail.trim()}
                >
                  Create Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
