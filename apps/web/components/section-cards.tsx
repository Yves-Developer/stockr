"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon, CheckCircle2Icon, RefreshCwIcon, Loader2Icon } from "lucide-react"
import api from "@/lib/api"
import { RRASyncDialog } from "@/components/rra-sync-dialog"

export function SectionCards() {
  const [stats, setStats] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [syncDialogOpen, setSyncDialogOpen] = React.useState(false)

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/dashboard")
        setStats(res.data.data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-muted/50 h-32" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-none lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Categories</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.totalCategories || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-primary/20 text-primary">
              <CheckCircle2Icon className="size-3 mr-1" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            System running smoothly
            <RefreshCwIcon className="size-4 text-primary" />
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Inventory Items</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.totalProducts || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={stats?.lowStockProducts?.length > 0 ? "border-destructive text-destructive" : ""}>
              <TrendingDownIcon className="size-3 mr-1" />
              -{stats?.lowStockProducts?.length || 0}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className={`line-clamp-1 flex gap-2 font-medium ${stats?.lowStockProducts?.length > 0 ? "text-destructive" : ""}`}>
            {stats?.lowStockProducts?.length > 0 
              ? `Low stock alerts: ${stats.lowStockProducts.length} items` 
              : "All items well stocked"}
            <TrendingDownIcon className={`size-4 ${stats?.lowStockProducts?.length > 0 ? "text-destructive" : "text-muted-foreground"}`} />
          </div>
          <div className="text-muted-foreground">
            {stats?.lowStockProducts?.length > 0 ? "Restock required soon" : "No immediate action needed"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Stock In</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats?.totalStockIn || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <RefreshCwIcon className="size-3 mr-1" />
              Lifetime
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-primary">
            High activity detected
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Tracking every transaction</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>RRA Sync Status</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-primary">
            Healthy
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
              <CheckCircle2Icon className="size-3 mr-1" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Ready for Sync
            <CheckCircle2Icon className="size-4 text-primary" />
          </div>
          <div className="text-muted-foreground">EBM compliance verified</div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 h-7 w-full text-xs" 
            onClick={() => setSyncDialogOpen(true)}
          >
            <RefreshCwIcon className="mr-2 size-3" />
            Sync Now
          </Button>
        </CardFooter>
      </Card>

      <RRASyncDialog 
        open={syncDialogOpen} 
        onOpenChange={setSyncDialogOpen} 
      />
    </div>
  )
}
