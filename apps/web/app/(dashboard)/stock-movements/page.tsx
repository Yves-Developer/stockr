"use client"

import { DataTable } from "@/components/data-table"
import { StockMovementSheet } from "@/components/stock-movement-sheet"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"

export default function StockMovementsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <DataTable 
        data={[]} 
        endpoint="/stock-movements" 
        title="Stock Movements" 
        description="Track and manage your inventory stock levels and history."
        action={<div />} 
        editAction={(item, onSuccess) => (
          <StockMovementSheet 
            id={item.id.toString()}
            initialValues={{
              type: item._raw?.type,
              quantity: item._raw?.quantity,
              reason: item._raw?.reason,
              note: item._raw?.note,
            }}
            onSuccess={onSuccess}
            trigger={
              <Button variant="ghost" size="icon" className="size-8">
                <PencilIcon className="size-4" />
              </Button>
            }
          />
        )}
      />
    </div>
  )
}
