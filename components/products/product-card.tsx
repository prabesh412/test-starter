import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
}

export function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const isInStock = product.stock > 0;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.image_url || "/placeholder-product.jpg"}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Stock Badge */}
        {!isInStock && (
          <div className="absolute top-2 right-2 bg-muted text-muted-foreground px-2 py-1 text-xs font-medium rounded">
            Out of Stock
          </div>
        )}

        {/* Low Stock Badge */}
        {isInStock && product.stock <= 5 && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 text-xs font-medium rounded">
            Only {product.stock} left
          </div>
        )}

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-medium text-sm hover:text-primary transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* Rating - static for now */}
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < 4
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">(24)</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">
              {formatPrice(product.price)}
            </span>
            {isInStock && (
              <span className="text-xs text-muted-foreground">
                {product.stock} in stock
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm" disabled={!isInStock}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isInStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
