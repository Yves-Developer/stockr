import { DataTable } from "@/components/data-table"
import data from "../dashboard/data.json"

export default function SuppliersPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Suppliers</h2>
          <p className="text-muted-foreground">
            Manage your product suppliers and their contact information.
          </p>
        </div>
      </div>
      {/* We can reuse DataTable here too, but in a real app we'd have a specific Suppliers table */}
      <DataTable data={data} />
    </div>
  )
}
