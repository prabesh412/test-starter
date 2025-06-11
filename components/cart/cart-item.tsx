import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { CartItemWithProduct } from "@/lib/cart";

interface CartItemProps {
  item: CartItemWithProduct;
  onUpdate?: () => void;
}

export function CartItem({ item, onUpdate }: CartItemProps) {
  const { updateItemQuantity, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity: number) => {
    try {
      await updateItemQuantity(item.id, newQuantity);
      onUpdate?.();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item.id);
      onUpdate?.();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const itemTotal = item.price_at_addition * item.quantity;

  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      {/* Product Image */}
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={item.image_url || "/placeholder-product.jpg"}
          alt={item.products.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            {item.products.title}
          </h3>
          {item.products.description && (
            <p className="text-xs text-gray-500 line-clamp-1">
              {item.products.description}
            </p>
          )}
          <p className="text-sm font-medium text-gray-900">
            {formatPrice(item.price_at_addition)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>

          <span className="text-sm font-medium min-w-[2rem] text-center">
            {item.quantity}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Item Total and Remove */}
      <div className="flex flex-col items-end space-y-2">
        <p className="text-sm font-medium text-gray-900">
          {formatPrice(itemTotal)}
        </p>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={handleRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
