"use client"

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, ShieldCheck, Zap, LayoutDashboardIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <span className="font-bold text-black">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Stockr</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <Link href="#features" className="transition-colors hover:text-foreground">Features</Link>
            <Link href="#solutions" className="transition-colors hover:text-foreground">Solutions</Link>
            <Link href="/pricing" className="transition-colors hover:text-foreground">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            {isPending ? (
              <div className="h-9 w-20 animate-pulse bg-white/5 rounded-md" />
            ) : session ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-primary text-black hover:bg-primary/90 font-semibold px-5">
                  <LayoutDashboardIcon className="mr-2 size-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Log in</Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" className="bg-white text-black hover:bg-white/90 font-semibold px-5">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-20 pb-20 md:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Run Your Business Smarter,with Stockr
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
              The smart business engine <br />
              <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic font-serif">for Rwandan entrepreneurs</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
              Turn your smartphone into a high-performance business assistant. digital EBM , real-time inventory, and RRA compliance built for speed.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 bg-primary text-black hover:bg-primary/90">
                  Get started <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-12 px-8 border-white/10 hover:bg-white/5">
                  Watch demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Product Mockup */}
          <div className="relative mt-12 md:mt-16 animate-in fade-in zoom-in-95 duration-1000 delay-700">
            <div className="absolute -top-40 left-1/2 -z-10 h-96 w-full -translate-x-1/2 bg-indigo-500/20 blur-[120px]" />
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-sm">
              <Image
                src="/Landing_page_pic.png"
                alt="Stockr Dashboard Mockup"
                width={2400}
                height={1600}
                className="rounded-xl border border-white/10 shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Brand Wall */}
          <div className="mt-32 text-center opacity-0 animate-in fade-in duration-1000 delay-1000 fill-mode-forwards">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground/60">Trusted by forward-thinking businesses</p>
            <div className="mt-8 flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              {["Kigali Hub", "Rwanda Retail", "TechBridge", "SmartSync", "InnovateRW"].map((brand) => (
                <span key={brand} className="text-xl font-bold tracking-tighter sm:text-2xl">{brand}</span>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="mt-48 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "RRA Compliant",
                desc: "Full digital EBM with automatic synchronization to RRA servers. Zero stress tax season.",
                icon: ShieldCheck,
              },
              {
                title: "Instant Scanning",
                desc: "High-speed barcode scanning using your phone's camera. No extra hardware needed.",
                icon: Zap,
              },
              {
                title: "Real-time Insights",
                desc: "Live inventory tracking and performance analytics at your fingertips, anywhere.",
                icon: BarChart3,
              },
            ].map((feature, i) => (
              <div key={feature.title}
                className="group relative rounded-2xl border border-white/5 bg-white/5 p-8 transition-all hover:border-white/10 hover:bg-white/[0.07] animate-in fade-in slide-in-from-bottom-8 duration-1000"
                style={{ animationDelay: `${i * 150 + 1200}ms`, animationFillMode: 'forwards' }}
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-black group-hover:shadow-[0_0_15px_rgba(183,231,58,0.5)]">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-48 border-t border-white/5 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded bg-primary text-black font-bold text-xs">S</div>
                <span className="font-bold tracking-tight">Stockr</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
                The high-performance business engine for the next generation of Rwandan entrepreneurs.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-12 text-sm font-medium text-muted-foreground">
              <div className="flex flex-col gap-4">
                <span className="text-foreground">Product</span>
                <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
                <Link href="#features" className="hover:text-foreground transition-colors">Integrations</Link>
                <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-foreground">Company</span>
                <Link href="#" className="hover:text-foreground transition-colors">About</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Blog</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Careers</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-foreground">Legal</span>
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              </div>
            </div>
          </div>
          <div className="mt-24 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 md:flex-row">
            <div className="flex flex-col items-center md:items-start gap-4">
              <p className="text-xs text-muted-foreground/50">© 2026 Stockr Inc. Built with precision for Rwanda.</p>
              <ThemeToggle variant="tabs" />
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
