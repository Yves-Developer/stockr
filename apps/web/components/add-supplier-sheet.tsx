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
import api from "@/lib/api"

const supplierSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone must be at least 10 characters").optional().or(z.literal("")),
  address: z.string().optional(),
})

type SupplierFormValues = z.infer<typeof supplierSchema>

export function AddSupplierSheet({ 
  trigger, 
  id,
  initialValues,
  onSuccess
}: { 
  trigger?: React.ReactNode,
  id?: string,
  initialValues?: Partial<SupplierFormValues>,
  onSuccess?: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const form = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      address: initialValues?.address || "",
    },
  })

  // Update form values if initialValues change
  React.useEffect(() => {
    if (initialValues) {
      form.reset({
        ...form.getValues(),
        ...initialValues
      })
    }
  }, [initialValues, form, open])

  async function onSubmit(values: SupplierFormValues) {
    setLoading(true)
    try {
      if (id) {
        await api.put(`/suppliers/${id}`, values)
        toast.success("Supplier updated successfully")
      } else {
        await api.post("/suppliers", values)
        toast.success("Supplier created successfully")
      }
      setOpen(false)
      form.reset()
      if (onSuccess) onSuccess()
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${id ? 'update' : 'create'} supplier`)
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
            <span className="hidden lg:inline">Add Supplier</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-[500px] flex flex-col gap-0 p-0">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>Add New Supplier</SheetTitle>
            <SheetDescription>
              Register a new supplier in your system.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Supplier Name</Label>
              <Input
                id="name"
                placeholder="e.g. Inyange Industries"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. contact@inyange.rw"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g. +250 788 000 000"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Supplier physical address..."
                className="min-h-[100px] resize-none"
                {...form.register("address")}
              />
            </div>
          </div>
          <SheetFooter className="p-6 border-t mt-auto">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black hover:bg-primary/90 font-semibold"
            >
              {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Create Supplier
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
