import { CheckoutForm } from "@/components/cart/checkout-form";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <CheckoutForm
        onOrderCreated={() => {
          // Redirect to success page or show success message
          alert("Order created successfully!");
          window.location.href = "/";
        }}
      />
    </div>
  );
}
