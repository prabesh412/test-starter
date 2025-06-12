import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center space-x-2 text-green-600">
            <CheckCircle className="h-8 w-8" />
            <span>Payment Successful!</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Thank you for your purchase. We have received your payment and will
            process your order shortly.
          </p>
          <p className="text-gray-600">
            You will receive a confirmation email with your order details.
          </p>
          <div className="pt-4">
            <Link href="/">
              <Button className="min-w-[200px]">Continue Shopping</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
