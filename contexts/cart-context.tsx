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
