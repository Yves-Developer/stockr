"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  Users, 
  Settings, 
  LogOut,
  TrendingUp,
  AlertTriangle,
  History
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Stockr
          </span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active />
          <NavItem icon={<Package className="w-5 h-5" />} label="Products" />
          <NavItem icon={<ArrowLeftRight className="w-5 h-5" />} label="Stock Movements" />
          <NavItem icon={<Users className="w-5 h-5" />} label="Suppliers" />
        </nav>
        <div className="p-4 border-t space-y-4">
          <NavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-5 w-5" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {session?.user?.name?.split(" ")[0] || "User"}!</h1>
            <p className="text-slate-500">Here is what is happening with your business today.</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Package className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Sales" 
            value="RWF 1,240,000" 
            icon={<TrendingUp className="text-green-600" />} 
            trend="+12% from last week" 
          />
          <StatCard 
            title="Active Products" 
            value="156" 
            icon={<Package className="text-blue-600" />} 
          />
          <StatCard 
            title="Low Stock Alerts" 
            value="12" 
            icon={<AlertTriangle className="text-amber-600" />} 
            alert
          />
          <StatCard 
            title="Sync Status" 
            value="Compliant" 
            icon={<ShieldCheckIcon className="text-indigo-600" />} 
            trend="Last sync: 2m ago"
          />
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Movements</CardTitle>
              <Button variant="ghost" size="sm" className="text-indigo-600">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${i % 2 === 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                        <History className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Product Name {i}</p>
                        <p className="text-xs text-slate-500">Stock {i % 2 === 0 ? "In" : "Out"} • 2:30 PM</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${i % 2 === 0 ? "text-green-600" : "text-red-600"}`}>
                      {i % 2 === 0 ? "+" : "-"}{i * 5} units
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Stock Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Low Stock: Item {i}</p>
                    <p className="text-xs text-amber-700">Only {i * 2} left in inventory</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href="#" 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
          : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function StatCard({ title, value, icon, trend, alert = false }: { title: string, value: string, icon: React.ReactNode, trend?: string, alert?: boolean }) {
  return (
    <Card className={`border-none shadow-sm ${alert ? "bg-amber-50/50" : ""}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
            {icon}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          {trend && (
            <p className={`text-xs font-medium ${trend.includes("+") ? "text-green-600" : "text-slate-500"}`}>
              {trend}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
