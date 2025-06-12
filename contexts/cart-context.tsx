"use client";

import React, { createContext, useContext, ReactNode } from "react";
import {
  getCartWithItems,
  addToCart as addToCartAPI,
  updateCartItemQuantity as updateCartItemQuantityAPI,
  removeFromCart as removeFromCartAPI,
  clearCart as clearCartAPI,
  getCartTotal,
  getCartItemCount,
  createOrdersFromCart,
  createOrderWithGooten,
  Address,
} from "@/lib/cart";
import { useToast } from "@/contexts/toast-context";

interface CartContextType {
  addToCart: (
    productId: string,
    quantity?: number,
    customization?: any
  ) => Promise<void>;
  updateItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartWithItems: () => Promise<any>;
  getCartTotal: () => Promise<number>;
  getCartItemCount: () => Promise<number>;
  createOrder: (customerEmail: string) => Promise<void>;
  createOrderWithAddress: (
    shippingAddress: Address,
    billingAddress: Address
  ) => Promise<any>;
  createStripeCheckout: (email: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const toast = useToast();

  const addToCart = async (
    productId: string,
    quantity: number = 1,
    customization: any = null
  ) => {
    try {
      await addToCartAPI(productId, quantity, customization);
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add item to cart");
      throw error;
    }
  };

  const updateItemQuantity = async (cartItemId: string, quantity: number) => {
    try {
      await updateCartItemQuantityAPI(cartItemId, quantity);
      if (quantity <= 0) {
        toast.success("Item removed from cart");
      } else {
        toast.success("Quantity updated");
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity");
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      await removeFromCartAPI(cartItemId);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      toast.error("Failed to remove item");
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await clearCartAPI();
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("Failed to clear cart");
      throw error;
    }
  };

  const createOrder = async (customerEmail: string) => {
    try {
      await createOrdersFromCart(customerEmail);
      toast.success("Order created successfully");
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Failed to create order");
      throw error;
    }
  };

  const createOrderWithAddress = async (
    shippingAddress: Address,
    billingAddress: Address
  ) => {
    try {
      const result = await createOrderWithGooten(
        shippingAddress,
        billingAddress
      );
      toast.success("Order created successfully with Gooten");
      return result;
    } catch (error) {
      console.error("Failed to create order with Gooten:", error);
      toast.error("Failed to create order");
      throw error;
    }
  };

  const createStripeCheckout = async (email: string) => {
    try {
      const cartData = await getCartWithItems();
      if (
        !cartData ||
        !cartData.cart_items ||
        cartData.cart_items.length === 0
      ) {
        throw new Error("Cart is empty");
      }

      const total = cartData.cart_items.reduce(
        (sum: number, item: any) =>
          sum + item.price_at_addition * item.quantity,
        0
      );

      const response = await fetch(
        "http://localhost:8000/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: total,
            currency: "usd",
            userId: cartData.user_id,
            projectId: cartData.cart_items[0]?.products?.project_id,
            successUrl: `${window.location.origin}/checkout/success`,
            cancelUrl: `${window.location.origin}/cart`,
            productId: cartData.cart_items[0]?.product_id,
            email: email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { data } = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error("Failed to create Stripe checkout:", error);
      toast.error("Failed to create checkout session");
      throw error;
    }
  };

  const contextValue: CartContextType = {
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    getCartWithItems,
    getCartTotal,
    getCartItemCount,
    createOrder,
    createOrderWithAddress,
    createStripeCheckout,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
