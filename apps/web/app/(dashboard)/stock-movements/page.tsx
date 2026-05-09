import { DataTable } from "@/components/data-table"
import data from "../dashboard/data.json"

export default function StockMovementsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stock Movements</h2>
          <p className="text-muted-foreground">
            Track and manage your inventory stock levels and history.
          </p>
        </div>
      </div>
      <DataTable data={data} />
    </div>
  )
}
