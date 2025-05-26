import { Suspense } from "react";
import { ProductGrid } from "@/components/products/product-grid";
import { Product } from "@/lib/types";
import { supabase } from "@/lib/supabase";

// Mock function to get products - replace with actual Supabase query
async function getProducts(): Promise<Product[]> {
  // This should be replaced with actual Supabase query
  const { data: products, error } = await supabase.from("products").select("*");
  console.log(products);
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return products;
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square bg-muted rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ProductsPage() {
  const products = await getProducts();
  console.log(products);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">All Products</h1>
        <p className="text-muted-foreground">
          Discover our complete collection of amazing products
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {[
                "All",
                "Electronics",
                "Clothing",
                "Accessories",
                "Wearables",
              ].map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    className="text-primary"
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Price Range</h3>
            <div className="space-y-2">
              {[
                "Under $25",
                "$25 - $50",
                "$50 - $100",
                "$100 - $200",
                "Over $200",
              ].map((range) => (
                <label
                  key={range}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input type="checkbox" className="text-primary" />
                  <span className="text-sm">{range}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Availability</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="text-primary" />
                <span className="text-sm">In Stock</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {products.length} products
            </p>
            <select className="border rounded-md px-3 py-2 text-sm">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
              <option>Best Rating</option>
            </select>
          </div>

          <Suspense fallback={<ProductsLoading />}>
            <ProductGrid products={products} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
