import { supabase } from "./supabase";
import { Database } from "./database.types";

type Tables = Database["public"]["Tables"];
type CartRow = Tables["carts"]["Row"];
type CartItemRow = Tables["cart_items"]["Row"];
type ProductRow = Tables["products"]["Row"];
type OrderInsert = Tables["orders"]["Insert"];

// User ID to use for development
const DEVELOPMENT_USER_ID = "6d58578a-e96b-4838-9cd9-5468465dfc45";

export interface CartWithItems extends CartRow {
  cart_items: (CartItemRow & {
    products: ProductRow;
  })[];
}

export interface CartItemWithProduct extends CartItemRow {
  products: ProductRow;
}

// Get or create a cart for the user
export async function getOrCreateCart(
  userId: string = DEVELOPMENT_USER_ID
): Promise<CartRow> {
  // First try to get existing cart
  const { data: existingCart, error: fetchError } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw new Error(`Failed to fetch cart: ${fetchError.message}`);
  }

  if (existingCart) {
    return existingCart;
  }

  // Create new cart if none exists
  const { data: newCart, error: createError } = await supabase
    .from("carts")
    .insert([{ user_id: userId }])
    .select()
    .single();

  if (createError) {
    throw new Error(`Failed to create cart: ${createError.message}`);
  }

  return newCart;
}

// Get cart with all items and product details
export async function getCartWithItems(
  userId: string = DEVELOPMENT_USER_ID
): Promise<CartWithItems | null> {
  const { data, error } = await supabase
    .from("carts")
    .select(
      `
      *,
      cart_items (
        *,
        products (*)
      )
    `
    )
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Failed to fetch cart with items: ${error.message}`);
  }

  return data;
}

// Add item to cart
export async function addToCart(
  productId: string,
  quantity: number = 1,
  customization: any = null,
  userId: string = DEVELOPMENT_USER_ID
): Promise<CartItemRow> {
  // Get or create cart
  const cart = await getOrCreateCart(userId);

  // Get product details for price
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (productError) {
    throw new Error(`Product not found: ${productError.message}`);
  }

  // Check if item already exists in cart
  const { data: existingItem, error: existingError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id)
    .eq("product_id", productId)
    .single();

  if (existingError && existingError.code !== "PGRST116") {
    throw new Error(
      `Failed to check existing cart item: ${existingError.message}`
    );
  }

  if (existingItem) {
    // Update existing item quantity
    const { data: updatedItem, error: updateError } = await supabase
      .from("cart_items")
      .update({
        quantity: existingItem.quantity + quantity,
        customization: customization || existingItem.customization,
      })
      .eq("id", existingItem.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update cart item: ${updateError.message}`);
    }

    return updatedItem;
  } else {
    // Add new item to cart
    const { data: newItem, error: insertError } = await supabase
      .from("cart_items")
      .insert([
        {
          cart_id: cart.id,
          product_id: productId,
          quantity: quantity,
          price_at_addition: product.price,
          customization: customization,
          image_url: product.image_url,
        },
      ])
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to add item to cart: ${insertError.message}`);
    }

    return newItem;
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<CartItemRow | null> {
  if (quantity <= 0) {
    await removeFromCart(cartItemId);
    return null;
  }

  const { data: updatedItem, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update cart item quantity: ${error.message}`);
  }

  return updatedItem;
}

// Remove item from cart
export async function removeFromCart(cartItemId: string): Promise<void> {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (error) {
    throw new Error(`Failed to remove item from cart: ${error.message}`);
  }
}

// Clear entire cart
export async function clearCart(
  userId: string = DEVELOPMENT_USER_ID
): Promise<void> {
  const cart = await getOrCreateCart(userId);

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id);

  if (error) {
    throw new Error(`Failed to clear cart: ${error.message}`);
  }
}

// Get cart total
export async function getCartTotal(
  userId: string = DEVELOPMENT_USER_ID
): Promise<number> {
  const cartWithItems = await getCartWithItems(userId);

  if (!cartWithItems || !cartWithItems.cart_items) {
    return 0;
  }

  return cartWithItems.cart_items.reduce((total, item) => {
    return total + item.price_at_addition * item.quantity;
  }, 0);
}

// Get cart item count
export async function getCartItemCount(
  userId: string = DEVELOPMENT_USER_ID
): Promise<number> {
  const cartWithItems = await getCartWithItems(userId);

  if (!cartWithItems || !cartWithItems.cart_items) {
    return 0;
  }

  return cartWithItems.cart_items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
}

// Interface for address information
export interface Address {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  countryCode: string;
  postalCode: string;
  phone: string;
  email: string;
  isBusinessAddress?: boolean;
}

// Interface for Gooten order
interface GootenOrderItem {
  Quantity: number;
  SKU: string;
  ShipType: string;
  Images: {
    Url: string;
    SpaceId: string;
    Index: number;
    ThumbnailUrl: string;
  }[];
}

interface GootenOrderData {
  ShipToAddress: {
    FirstName: string;
    LastName: string;
    Line1: string;
    Line2: string;
    City: string;
    State: string;
    CountryCode: string;
    PostalCode: string;
    IsBusinessAddress: boolean;
    Phone: string;
    Email: string;
  };
  BillingAddress: {
    FirstName: string;
    LastName: string;
    Line1: string;
    Line2: string;
    City: string;
    State: string;
    CountryCode: string;
    PostalCode: string;
    IsBusinessAddress: boolean;
    Phone: string;
    Email: string;
  };
  Items: GootenOrderItem[];
  SourceId: string;
  IsInTestMode: boolean;
  Meta: {
    [key: string]: any;
    needs_customization: boolean;
  };
}

// Create order using Gooten API
export async function createOrderWithGooten(
  shippingAddress: Address,
  billingAddress: Address,
  userId: string = DEVELOPMENT_USER_ID
): Promise<any> {
  const cartWithItems = await getCartWithItems(userId);

  if (
    !cartWithItems ||
    !cartWithItems.cart_items ||
    cartWithItems.cart_items.length === 0
  ) {
    throw new Error("Cart is empty");
  }

  // Map cart items to Gooten format
  const gootenItems: GootenOrderItem[] = cartWithItems.cart_items.map(
    (item) => ({
      Quantity: item.quantity,
      SKU:
        item.products.sku ||
        "Apparel-DTG-Tshirt-Anvil-980-M-LightBlue-Unisex-CFCB", // Use product SKU or dummy
      ShipType: item.products.ship_type || "standard",
      Images: [
        {
          Url:
            item.products.image_url ||
            "https://unsplash.com/photos/a-person-swimming-in-the-ocean-with-a-camera-NhWxAIs61MM",
          SpaceId: item.products.space_id || "default-space",
          Index: 5,
          ThumbnailUrl:
            item.products.thumbnail_url ||
            item.products.image_url ||
            "https://unsplash.com/photos/a-person-swimming-in-the-ocean-with-a-camera-NhWxAIs61MM",
        },
      ],
    })
  );

  const orderData: GootenOrderData = {
    ShipToAddress: {
      FirstName: shippingAddress.firstName,
      LastName: shippingAddress.lastName,
      Line1: shippingAddress.line1,
      Line2: shippingAddress.line2 || "",
      City: shippingAddress.city,
      State: shippingAddress.state,
      CountryCode: shippingAddress.countryCode,
      PostalCode: shippingAddress.postalCode,
      IsBusinessAddress: shippingAddress.isBusinessAddress || false,
      Phone: shippingAddress.phone,
      Email: shippingAddress.email,
    },
    BillingAddress: {
      FirstName: billingAddress.firstName,
      LastName: billingAddress.lastName,
      Line1: billingAddress.line1,
      Line2: billingAddress.line2 || "",
      City: billingAddress.city,
      State: billingAddress.state,
      CountryCode: billingAddress.countryCode,
      PostalCode: billingAddress.postalCode,
      IsBusinessAddress: billingAddress.isBusinessAddress || false,
      Phone: billingAddress.phone,
      Email: billingAddress.email,
    },
    Items: gootenItems,
    SourceId: `cart-${cartWithItems.id}`,
    IsInTestMode: true,
    Meta: {
      user_id: userId,
      cart_id: cartWithItems.id,
      needs_customization: true,
    },
  };

  // Call Gooten API
  const response = await fetch("http://localhost:8000/api/gooten/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to create Gooten order: ${response.status} ${errorText}`
    );
  }

  const result = await response.json();

  // Store order in our database for tracking
  const orders: OrderInsert[] = cartWithItems.cart_items.map((item) => ({
    product_id: item.product_id,
    project_id: item.products.project_id,
    quantity: item.quantity,
    customer_email: shippingAddress.email,
    status: "pending",
  }));

  const { error: orderError } = await supabase.from("orders").insert(orders);

  if (orderError) {
    console.error("Failed to save order to database:", orderError);
    // Don't throw here as the Gooten order was successful
  }

  // Clear the cart after successful order creation
  await clearCart(userId);

  return result;
}

// Legacy function for backward compatibility
export async function createOrdersFromCart(
  customerEmail: string,
  userId: string = DEVELOPMENT_USER_ID
): Promise<void> {
  // Use dummy address data for backward compatibility
  const dummyAddress: Address = {
    firstName: "John",
    lastName: "Doe",
    line1: "123 Main St",
    line2: "Apt 1",
    city: "New York",
    state: "NY",
    countryCode: "US",
    postalCode: "10001",
    phone: "+1234567890",
    email: customerEmail,
    isBusinessAddress: false,
  };

  await createOrderWithGooten(dummyAddress, dummyAddress, userId);
}
