"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon, CheckCircle2Icon, RefreshCwIcon } from "lucide-react"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-none lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Sales (Month)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            RWF 1,250,000
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-primary/20 text-primary">
              <TrendingUpIcon className="size-3 mr-1" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month{" "}
            <TrendingUpIcon className="size-4 text-primary" />
          </div>
          <div className="text-muted-foreground">
            Sales volume increasing
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Inventory Items</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDownIcon className="size-3 mr-1" />
              -5
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Low stock alerts: 5 items{" "}
            <TrendingDownIcon className="size-4 text-destructive" />
          </div>
          <div className="text-muted-foreground">
            Restock required soon
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Stock Movements</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            856
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <RefreshCwIcon className="size-3 mr-1" />
              Today
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-primary">
            High activity detected{" "}
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
            Last sync: 2 mins ago{" "}
            <CheckCircle2Icon className="size-4 text-primary" />
          </div>
          <div className="text-muted-foreground">EBM compliance verified</div>
        </CardFooter>
      </Card>
    </div>
  )
}
