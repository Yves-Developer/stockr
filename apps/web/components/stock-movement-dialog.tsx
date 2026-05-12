"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2Icon } from "lucide-react"

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

const movementSchema = z.object({
  type: z.enum(["IN", "OUT"]),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  reason: z.enum(["purchase", "sale", "damaged", "returned"]),
  note: z.string().optional(),
})

type MovementFormValues = z.infer<typeof movementSchema>

interface StockMovementDialogProps {
  product: {
    _id: string
    name: string
    quantity: number
  }
  type: "IN" | "OUT"
  trigger: React.ReactNode
  onSuccess?: () => void
}

export function StockMovementDialog({ 
  product, 
  type,
  trigger, 
  onSuccess 
}: StockMovementDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const form = useForm({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      type: type,
      quantity: 1,
      reason: type === "OUT" ? "sale" : "purchase",
      note: "",
    },
  })

  // Update form if type or product changes
  React.useEffect(() => {
    if (open) {
      form.reset({
        type: type,
        quantity: 1,
        reason: type === "OUT" ? "sale" : "purchase",
        note: "",
      });
    }
  }, [open, type, form]);

  async function onSubmit(values: MovementFormValues) {
    if (values.type === "OUT" && values.quantity > product.quantity) {
      toast.error(`Not enough stock. Available: ${product.quantity}`)
      return
    }

    setLoading(true)
    try {
      await api.post("/stock-movements", {
        product: product._id,
        ...values,
      })
      toast.success(`Stock ${values.type === "IN" ? "increased" : "decreased"} successfully`)
      setOpen(false)
      form.reset()
      if (onSuccess) onSuccess()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to record movement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Stock {type === "IN" ? "In" : "Out"}: {product.name}</DialogTitle>
          <DialogDescription>
            Record a stock {type === "IN" ? "addition" : "removal"} for this product.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" placeholder="1" {...form.register("quantity")} />
            {form.formState.errors.quantity && (
              <p className="text-xs text-destructive">{form.formState.errors.quantity.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason</Label>
            <select 
              id="reason" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...form.register("reason")}
            >
              <option value="purchase">Purchase (Restock)</option>
              <option value="sale">Sale</option>
              <option value="damaged">Damaged</option>
              <option value="returned">Returned</option>
            </select>
            {form.formState.errors.reason && (
              <p className="text-xs text-destructive">{form.formState.errors.reason.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Notes (Optional)</Label>
            <Textarea id="note" placeholder="Add any extra details..." className="resize-none" {...form.register("note")} />
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              className={type === "IN" ? "bg-green-500 hover:bg-green-600 text-black w-full font-bold" : "bg-red-500 hover:bg-red-600 text-black w-full font-bold"} 
              disabled={loading}
            >
              {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Confirm {type === "IN" ? "Stock In" : "Stock Out"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
