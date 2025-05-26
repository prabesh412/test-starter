import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/lib/types";

// Mock categories data
const categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Latest gadgets and electronic devices",
    image: "/api/placeholder/300/200",
    isActive: true,
  },
  {
    id: "2",
    name: "Clothing",
    slug: "clothing",
    description: "Fashion and apparel for all styles",
    image: "/api/placeholder/300/200",
    isActive: true,
  },
  {
    id: "3",
    name: "Home & Garden",
    slug: "home-garden",
    description: "Everything for your home and garden",
    image: "/api/placeholder/300/200",
    isActive: true,
  },
  {
    id: "4",
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description: "Gear for active lifestyles",
    image: "/api/placeholder/300/200",
    isActive: true,
  },
  {
    id: "5",
    name: "Health & Beauty",
    slug: "health-beauty",
    description: "Personal care and wellness products",
    image: "/api/placeholder/300/200",
    isActive: true,
  },
  {
    id: "6",
    name: "Automotive",
    slug: "automotive",
    description: "Car accessories and automotive tools",
    image: "/api/placeholder/300/200",
    isActive: true,
  },
  {
    id: "7",
    name: "Books & Media",
    slug: "books-media",
    description: "Books, movies, and entertainment",
    image: "/api/placeholder/300/200",
    isActive: true,
  },
  {
    id: "8",
    name: "Toys & Games",
    slug: "toys-games",
    description: "Fun for kids and adults",
    image: "/api/placeholder/300/200",
    isActive: true,
  },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Shop by Category
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse our wide selection of products organized by category. Find
          exactly what you're looking for in our curated collections.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={category.image || "/api/placeholder/300/200"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold text-center px-4">
                    {category.name}
                  </h3>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground text-center">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Featured Categories */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group text-center"
            >
              <div className="relative aspect-square rounded-full overflow-hidden mb-3 mx-auto w-24 h-24">
                <Image
                  src={category.image || "/api/placeholder/96/96"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
