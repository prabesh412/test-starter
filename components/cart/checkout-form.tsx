"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/cart-context";
import { Address } from "@/lib/cart";

interface CheckoutFormProps {
  onOrderCreated: () => void;
}

export function CheckoutForm({ onOrderCreated }: CheckoutFormProps) {
  const { createOrderWithAddress } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [useSameAddress, setUseSameAddress] = useState(true);

  const [shippingAddress, setShippingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    countryCode: "US",
    postalCode: "",
    phone: "",
    email: "",
    isBusinessAddress: false,
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    firstName: "",
    lastName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    countryCode: "US",
    postalCode: "",
    phone: "",
    email: "",
    isBusinessAddress: false,
  });

  const handleShippingChange = (
    field: keyof Address,
    value: string | boolean
  ) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
    if (useSameAddress) {
      setBillingAddress((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleBillingChange = (
    field: keyof Address,
    value: string | boolean
  ) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const billing = useSameAddress ? shippingAddress : billingAddress;
      await createOrderWithAddress(shippingAddress, billing);
      onOrderCreated();
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    const requiredFields: (keyof Address)[] = [
      "firstName",
      "lastName",
      "line1",
      "city",
      "state",
      "postalCode",
      "phone",
      "email",
    ];
    const shippingValid = requiredFields.every((field) =>
      shippingAddress[field]?.toString().trim()
    );

    if (useSameAddress) {
      return shippingValid;
    }

    const billingValid = requiredFields.every((field) =>
      billingAddress[field]?.toString().trim()
    );
    return shippingValid && billingValid;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name *
              </label>
              <Input
                value={shippingAddress.firstName}
                onChange={(e) =>
                  handleShippingChange("firstName", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name *
              </label>
              <Input
                value={shippingAddress.lastName}
                onChange={(e) =>
                  handleShippingChange("lastName", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Address Line 1 *
            </label>
            <Input
              value={shippingAddress.line1}
              onChange={(e) => handleShippingChange("line1", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Address Line 2
            </label>
            <Input
              value={shippingAddress.line2}
              onChange={(e) => handleShippingChange("line2", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <Input
                value={shippingAddress.city}
                onChange={(e) => handleShippingChange("city", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State *</label>
              <Input
                value={shippingAddress.state}
                onChange={(e) => handleShippingChange("state", e.target.value)}
                placeholder="NY"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Postal Code *
              </label>
              <Input
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  handleShippingChange("postalCode", e.target.value)
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <select
                value={shippingAddress.countryCode}
                onChange={(e) =>
                  handleShippingChange("countryCode", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <Input
                value={shippingAddress.phone}
                onChange={(e) => handleShippingChange("phone", e.target.value)}
                type="tel"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <Input
                value={shippingAddress.email}
                onChange={(e) => handleShippingChange("email", e.target.value)}
                type="email"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isBusinessAddress"
              checked={shippingAddress.isBusinessAddress}
              onChange={(e) =>
                handleShippingChange("isBusinessAddress", e.target.checked)
              }
              className="h-4 w-4"
            />
            <label htmlFor="isBusinessAddress" className="text-sm">
              Business address
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="useSameAddress"
              checked={useSameAddress}
              onChange={(e) => setUseSameAddress(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="useSameAddress" className="text-sm">
              Same as shipping address
            </label>
          </div>

          {!useSameAddress && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    First Name *
                  </label>
                  <Input
                    value={billingAddress.firstName}
                    onChange={(e) =>
                      handleBillingChange("firstName", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Last Name *
                  </label>
                  <Input
                    value={billingAddress.lastName}
                    onChange={(e) =>
                      handleBillingChange("lastName", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address Line 1 *
                </label>
                <Input
                  value={billingAddress.line1}
                  onChange={(e) => handleBillingChange("line1", e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address Line 2
                </label>
                <Input
                  value={billingAddress.line2}
                  onChange={(e) => handleBillingChange("line2", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    City *
                  </label>
                  <Input
                    value={billingAddress.city}
                    onChange={(e) =>
                      handleBillingChange("city", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    State *
                  </label>
                  <Input
                    value={billingAddress.state}
                    onChange={(e) =>
                      handleBillingChange("state", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Postal Code *
                  </label>
                  <Input
                    value={billingAddress.postalCode}
                    onChange={(e) =>
                      handleBillingChange("postalCode", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Country
                  </label>
                  <select
                    value={billingAddress.countryCode}
                    onChange={(e) =>
                      handleBillingChange("countryCode", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone *
                  </label>
                  <Input
                    value={billingAddress.phone}
                    onChange={(e) =>
                      handleBillingChange("phone", e.target.value)
                    }
                    type="tel"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <Input
                    value={billingAddress.email}
                    onChange={(e) =>
                      handleBillingChange("email", e.target.value)
                    }
                    type="email"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="billingIsBusinessAddress"
                  checked={billingAddress.isBusinessAddress}
                  onChange={(e) =>
                    handleBillingChange("isBusinessAddress", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <label htmlFor="billingIsBusinessAddress" className="text-sm">
                  Business address
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full"
        disabled={!isFormValid() || isLoading}
      >
        {isLoading ? "Creating Order..." : "Create Order with Gooten"}
      </Button>
    </form>
  );
}
