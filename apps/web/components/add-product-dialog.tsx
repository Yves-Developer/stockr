"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { PlusIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/api"
import { toast } from "sonner"
import { ComboAdd } from "./combo-add"

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  sku: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  supplierId: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

export function AddProductDialog({ 
  trigger, 
  initialValues,
  onSuccess
}: { 
  trigger?: React.ReactNode,
  initialValues?: Partial<ProductFormValues>,
  onSuccess?: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [categories, setCategories] = React.useState<{ _id: string; name: string }[]>([])
  const [suppliers, setSuppliers] = React.useState<{ _id: string; name: string }[]>([])

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      price: initialValues?.price || 0,
      quantity: initialValues?.quantity || 0,
      sku: initialValues?.sku || "",
      categoryId: initialValues?.categoryId || "",
      supplierId: initialValues?.supplierId || "",
    },
  })

  React.useEffect(() => {
    if (initialValues) {
      form.reset({
        ...form.getValues(),
        ...initialValues
      })
    }
  }, [initialValues, form])

  React.useEffect(() => {
    if (open) {
      fetchMetadata()
    }
  }, [open])

  const [metadataLoading, setMetadataLoading] = React.useState(false)

  async function fetchMetadata() {
    console.log("[AddProduct] Fetching categories and suppliers...");
    setMetadataLoading(true)
    try {
      const [catRes, supRes] = await Promise.all([
        api.get("/categories"),
        api.get("/suppliers"),
      ])
      console.log("[AddProduct] Categories received:", catRes.data?.data?.length || 0);
      console.log("[AddProduct] Suppliers received:", supRes.data?.data?.length || 0);
      
      setCategories(catRes.data.data || [])
      setSuppliers(supRes.data.data || [])
    } catch (error: any) {
      console.error("[AddProduct] Failed to fetch metadata:", error.response?.status, error.message);
      toast.error("Failed to load categories/suppliers. Please check connection.")
    } finally {
      setMetadataLoading(false)
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
      if (onSuccess) onSuccess()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <PlusIcon className="size-4" />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Enter the product details below to add it to your inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder="Enter product name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price (RWF)</Label>
              <Input id="price" type="number" placeholder="0" {...form.register("price")} />
              {form.formState.errors.price && (
                <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Initial Quantity</Label>
              <Input id="quantity" type="number" placeholder="0" {...form.register("quantity")} />
              {form.formState.errors.quantity && (
                <p className="text-xs text-destructive">{form.formState.errors.quantity.message}</p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sku">SKU / Barcode</Label>
            <Input id="sku" placeholder="Scan or enter SKU" {...form.register("sku")} />
            {form.formState.errors.sku && (
              <p className="text-xs text-destructive">{form.formState.errors.sku.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            {metadataLoading ? (
              <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            ) : (
              <ComboAdd
                items={categories}
                placeholder="Select category"
                emptyMessage="No category found"
                value={form.watch("categoryId")}
                onSelect={(val) => form.setValue("categoryId", val)}
                onCreate={handleCreateCategory}
              />
            )}
            {form.formState.errors.categoryId && (
              <p className="text-xs text-destructive">{form.formState.errors.categoryId.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Supplier (Optional)</Label>
            {metadataLoading ? (
              <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            ) : (
              <ComboAdd
                items={suppliers}
                placeholder="Select supplier"
                emptyMessage="No supplier found"
                value={form.watch("supplierId")}
                onSelect={(val) => form.setValue("supplierId", val)}
                onCreate={handleCreateSupplier}
              />
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              placeholder="Brief description of the product" 
              className="resize-none"
              {...form.register("description")} 
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90" disabled={loading}>
              {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Save Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
