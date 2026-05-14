"use client"

import { DataTable } from "@/components/data-table"
import { AddProductSheet } from "@/components/add-product-sheet"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"

export default function ProductsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <DataTable 
        data={[]} 
        endpoint="/products" 
        title="Products" 
        description="Manage your inventory and track product stock levels."
        editAction={(item, onSuccess) => (
          <AddProductSheet 
            id={item.id.toString()}
            initialValues={{
              name: item._raw?.name,
              description: item._raw?.description,
              price: item._raw?.price,
              quantity: item._raw?.quantity,
              sku: item._raw?.sku,
              categoryId: item._raw?.category?._id || item._raw?.category,
              supplierId: item._raw?.supplier?._id || item._raw?.supplier,
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
