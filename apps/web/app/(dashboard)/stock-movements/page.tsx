import { DataTable } from "@/components/data-table"

export default function StockMovementsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <DataTable 
        data={[]} 
        endpoint="/stock-movements" 
        title="Stock Movements" 
        description="Track and manage your inventory stock levels and history."
        action={<div />} // No add button for movements for now, use scanner or products
      />
    </div>
  )
}
