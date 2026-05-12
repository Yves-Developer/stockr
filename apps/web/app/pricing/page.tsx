"use client"

import * as React from "react"
import { CheckIcon, StarIcon, ShieldCheckIcon, RocketIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Starter",
    price: "0",
    description: "Perfect for small kiosks and single entrepreneurs.",
    features: [
      "Up to 50 products",
      "Single device access",
      "Manual stock tracking",
      "Basic reporting",
      "Email support",
    ],
    cta: "Start for Free",
    popular: false,
    icon: <RocketIcon className="size-5" />,
  },
  {
    name: "Growth",
    price: "25,000",
    description: "Scale your business with automated compliance.",
    features: [
      "Unlimited products",
      "Up to 5 devices",
      "RRA / EBM Sync",
      "Barcode scanning",
      "Inventory alerts",
      "WhatsApp support",
    ],
    cta: "Go Pro",
    popular: true,
    icon: <StarIcon className="size-5" />,
  },
  {
    name: "Enterprise",
    price: "100,000",
    description: "Full-scale distribution and multi-branch management.",
    features: [
      "Everything in Growth",
      "Unlimited branches",
      "Custom RRA integrations",
      "API access",
      "Dedicated account manager",
      "24/7 Priority support",
    ],
    cta: "Contact Sales",
    popular: false,
    icon: <ShieldCheckIcon className="size-5" />,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 py-24 md:py-32">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="outline" className="px-4 py-1 text-primary border-primary/30 bg-primary/5 uppercase tracking-widest font-bold">
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Built for <span className="text-primary">Rwanda's</span> Finest Businesses
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Choose the perfect plan to digitize your inventory, ensure compliance, and grow your revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col border transition-all duration-300 ${
                plan.popular 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 bg-card/50"
              }`}
            >
              <CardHeader className="text-center pt-8">
                {plan.popular && (
                  <div className="mb-4">
                    <Badge className="bg-primary text-black font-black px-4 py-0.5 uppercase text-[10px] tracking-widest">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <div className={`mx-auto size-12 rounded-2xl flex items-center justify-center mb-4 ${
                  plan.popular ? "bg-primary text-black" : "bg-primary/10 text-primary"
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">
                  {plan.name}
                </CardTitle>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">RWF</span>
                  <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                  <span className="text-sm font-medium text-muted-foreground">/mo</span>
                </div>
                <CardDescription className="pt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <div className="h-px bg-border/50" />
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 size-4 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        <CheckIcon className="size-3" />
                      </div>
                      <span className="text-foreground/80 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pb-8 pt-4">
                <Button 
                  className={`w-full h-12 text-base font-black uppercase tracking-wider rounded-xl ${
                    plan.popular 
                      ? "bg-primary text-black hover:bg-primary/90 shadow-none" 
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10 shadow-none"
                  }`}
                  onClick={() => window.location.href = "/register"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center space-y-6">
          <p className="text-muted-foreground font-medium">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale transition-all hover:grayscale-0">
            {/* Mock RRA/EBM/Trust Logos */}
            <div className="text-xl font-black tracking-tighter uppercase">RRA Compliance</div>
            <div className="text-xl font-black tracking-tighter uppercase">EBM Verified</div>
            <div className="text-xl font-black tracking-tighter uppercase">Rwanda FinTech</div>
          </div>
        </div>
      </div>
    </div>
  )
}
