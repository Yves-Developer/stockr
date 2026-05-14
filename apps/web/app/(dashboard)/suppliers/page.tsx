import { DataTable } from "@/components/data-table"
import { AddSupplierSheet } from "@/components/add-supplier-sheet"
import { Button } from "@/components/ui/button"
import { PencilIcon } from "lucide-react"

export default function SuppliersPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <DataTable 
        data={[]} 
        endpoint="/suppliers" 
        title="Suppliers" 
        description="Manage your product suppliers and their contact information."
        action={<AddSupplierSheet />}
        editAction={(item, onSuccess) => (
          <AddSupplierSheet 
            id={item.id.toString()}
            initialValues={{
              name: item._raw?.name,
              email: item._raw?.email,
              phone: item._raw?.phone,
              address: item._raw?.address,
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
