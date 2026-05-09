"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { PlusIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ComboAdd } from "@/components/combo-add"
import api from "@/lib/api"

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  supplierId: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

export function AddProductSheet({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [categories, setCategories] = React.useState<{ _id: string; name: string }[]>([])
  const [suppliers, setSuppliers] = React.useState<{ _id: string; name: string }[]>([])

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      sku: "",
      categoryId: "",
      supplierId: "",
    },
  })

  React.useEffect(() => {
    if (open) {
      fetchMetadata()
    }
  }, [open])

  async function fetchMetadata() {
    try {
      const [catRes, supRes] = await Promise.all([
        api.get("/categories"),
        api.get("/suppliers"),
      ])
      setCategories(catRes.data.data || [])
      setSuppliers(supRes.data.data || [])
    } catch (error) {
      console.error("Failed to fetch metadata", error)
    }
  }

  const handleCreateCategory = async (name: string) => {
    try {
      const res = await api.post("/categories", { name })
      const newCat = res.data.data
      setCategories(prev => [...prev, newCat])
      toast.success(`Category "${name}" created`)
      return newCat
    } catch (error) {
      toast.error("Failed to create category")
      return null
    }
  }

  const handleCreateSupplier = async (name: string) => {
    try {
      const res = await api.post("/suppliers", { name })
      const newSup = res.data.data
      setSuppliers(prev => [...prev, newSup])
      toast.success(`Supplier "${name}" created`)
      return newSup
    } catch (error) {
      toast.error("Failed to create supplier")
      return null
    }
  }

  async function onSubmit(values: ProductFormValues) {
    setLoading(true)
    try {
      await api.post("/products", {
        ...values,
        category: values.categoryId,
        supplier: values.supplierId || undefined,
      })
      toast.success("Product created successfully")
      setOpen(false)
      form.reset()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="default" size="sm" className="bg-primary text-black hover:bg-primary/90">
            <PlusIcon className="size-4 mr-2" />
            <span className="hidden lg:inline">Add Product</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-[800px] flex flex-col gap-0 p-0">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>Add New Product</SheetTitle>
            <SheetDescription>
              Create a new item in your inventory catalog.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="e.g. Inyange Milk"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU / Barcode</Label>
              <Input
                id="sku"
                placeholder="e.g. INY-001"
                {...form.register("sku")}
              />
              {form.formState.errors.sku && (
                <p className="text-xs text-destructive">{form.formState.errors.sku.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional product details..."
                className="min-h-[100px] resize-none"
                {...form.register("description")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (RWF)</Label>
                <Input
                  id="price"
                  type="number"
                  {...form.register("price")}
                />
                {form.formState.errors.price && (
                  <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Initial Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  {...form.register("quantity")}
                />
                {form.formState.errors.quantity && (
                  <p className="text-xs text-destructive">{form.formState.errors.quantity.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <ComboAdd 
                  items={categories}
                  placeholder="Select Category"
                  emptyMessage="No category found."
                  value={form.watch("categoryId")}
                  onSelect={(val) => form.setValue("categoryId", val)}
                  onCreate={handleCreateCategory}
                />
                {form.formState.errors.categoryId && (
                  <p className="text-xs text-destructive">{form.formState.errors.categoryId.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Supplier</Label>
                <ComboAdd 
                  items={suppliers}
                  placeholder="Select Supplier"
                  emptyMessage="No supplier found."
                  value={form.watch("supplierId")}
                  onSelect={(val) => form.setValue("supplierId", val)}
                  onCreate={handleCreateSupplier}
                />
              </div>
            </div>
          </div>
          <SheetFooter className="p-6 border-t mt-auto">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black hover:bg-primary/90 font-semibold"
            >
              {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Create Product
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
