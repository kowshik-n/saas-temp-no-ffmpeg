import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subscription, availablePlans, upgradeToPro, loading } =
    useSubscription();

  const handlePlanSelect = async (planId: string) => {
    if (!user) {
      navigate("/signup", { state: { redirectTo: "/pricing" } });
      return;
    }

    if (planId === "free") {
      // If user is already on free plan, do nothing
      if (subscription?.id === "free") {
        toast({
          title: "You're already on the Free plan",
          description: "You're currently using the Free plan.",
        });
        return;
      }

      // Implement downgrade logic here
      navigate("/dashboard");
      return;
    }

    if (planId === "pro-monthly") {
      // If user is already on pro plan, do nothing
      if (subscription?.id === "pro-monthly") {
        toast({
          title: "You're already on the Pro plan",
          description: "You're currently using the Pro plan.",
        });
        return;
      }

      try {
        // In a real app, this would redirect to a payment page
        // For demo purposes, we'll just upgrade directly
        await upgradeToPro();

        toast({
          title: "Upgraded to Pro!",
          description: "You now have access to all Pro features.",
        });

        navigate("/dashboard");
      } catch (error) {
        toast({
          title: "Upgrade failed",
          description:
            "There was an error upgrading your account. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading plans...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your subtitle creation needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {availablePlans.map((plan) => (
          <Card
            key={plan.id}
            className={`${plan.id === "pro-monthly" ? "border-orange-500 shadow-lg" : ""}`}
          >
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                {plan.price > 0 && (
                  <span className="text-gray-500">/month</span>
                )}
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full ${plan.id === "pro-monthly" ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white" : ""}`}
                variant={plan.id === "free" ? "outline" : "default"}
              >
                {plan.isActive
                  ? "Current Plan"
                  : plan.id === "free"
                    ? "Downgrade"
                    : "Upgrade"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
