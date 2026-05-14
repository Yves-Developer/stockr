import { ClipboardCheckIcon, DownloadIcon, HistoryIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function InventoryAuditPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory Audit</h2>
          <p className="text-muted-foreground">
            Perform stock takes and review inventory reconciliation history.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <HistoryIcon className="mr-2 h-4 w-4" />
            Audit History
          </Button>
          <Button className="bg-primary text-black">
            <ClipboardCheckIcon className="mr-2 h-4 w-4" />
            Start New Audit
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Last Audit Summary</CardTitle>
            <CardDescription>Performed on April 30, 2024</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-medium">Total Items Counted</span>
              <span className="font-bold">452</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-medium">Discrepancies Found</span>
              <span className="font-bold text-destructive">12</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-medium">Total Value Variance</span>
              <span className="font-bold">-145,000 RWF</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Accuracy Rate</span>
              <span className="font-bold text-primary">97.4%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Audit Progress</CardTitle>
            <CardDescription>Scheduled audits and upcoming tasks.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
             <ClipboardCheckIcon className="h-10 w-10 mb-4 opacity-20" />
             <p>No audit currently in progress.</p>
             <Button variant="link" className="mt-2">Schedule next audit</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reconciliation History</CardTitle>
          <CardDescription>Review past inventory adjustments and audit results.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
            <p>Historical audit logs will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
