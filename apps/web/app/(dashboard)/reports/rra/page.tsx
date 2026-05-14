import { FileTextIcon, DownloadIcon, RefreshCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RRAReportsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">RRA Compliance Reports</h2>
          <p className="text-muted-foreground">
            Generate and manage your Rwanda Revenue Authority EBM reports.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Sync with EBM
          </Button>
          <Button className="bg-primary text-black">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Daily Sales Report</CardTitle>
            <CardDescription>Last generated: Today, 10:00 AM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240,000 RWF</div>
            <p className="text-xs text-muted-foreground">Successfully synced with RRA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Monthly VAT Summary</CardTitle>
            <CardDescription>Period: May 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,420,000 RWF</div>
            <p className="text-xs text-muted-foreground">Pending submission</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">EBM Status</CardTitle>
            <CardDescription>Device ID: EBM-RW-90210</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Connected</div>
            <p className="text-xs text-muted-foreground">Service running normally</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent EBM Submissions</CardTitle>
          <CardDescription>History of data sent to RRA servers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <FileTextIcon className="h-8 w-8 opacity-20" />
              <p>Submission history will appear here once active.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
