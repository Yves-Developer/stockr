"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2Icon, ArrowUpCircleIcon, ArrowDownCircleIcon, ShieldCheckIcon } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import { RRAReceiptDialog } from "./rra-receipt-dialog"

const movementSchema = z.object({
  type: z.enum(["IN", "OUT"]),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  reason: z.enum(["purchase", "sale", "damaged", "returned"]),
  note: z.string().optional(),
})

type MovementFormValues = z.infer<typeof movementSchema>

interface StockMovementSheetProps {
  product?: {
    _id: string
    name: string
    sku: string
    quantity: number
    price: number
  }
  id?: string
  initialValues?: Partial<MovementFormValues>
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function StockMovementSheet({ product, id, initialValues, trigger, onSuccess }: StockMovementSheetProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [receiptOpen, setReceiptOpen] = React.useState(false)
  const [receiptData, setReceiptData] = React.useState<any>(null)

  const form = useForm({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      type: initialValues?.type || "IN",
      quantity: initialValues?.quantity || 1,
      reason: initialValues?.reason || "purchase",
      note: initialValues?.note || "",
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

  async function onSubmit(values: MovementFormValues) {
    setLoading(true)
    try {
      if (id) {
        // Update existing movement
        await api.put(`/stock-movements/${id}`, values)
        toast.success("Stock movement updated")
      } else {
        // Record the movement in our DB
        await api.post("/stock-movements", {
          ...values,
          product: product?._id,
        })
        
        // 2. If it's a sale, report to RRA (Mock)
        if (values.type === "OUT" && values.reason === "sale" && product) {
          try {
            const rraRes = await api.post("/rra/report-sale", {
              productName: product.name,
              quantity: values.quantity,
              price: product.price,
            })
            
            setReceiptData({
              productName: product.name,
              quantity: values.quantity,
              price: product.price,
              ebmNumber: rraRes.data.ebmNumber,
              timestamp: new Date().toISOString(),
            })
            setReceiptOpen(true)
            toast.success("Sale reported to RRA (EBM)")
          } catch (rraError) {
            console.error("RRA Reporting failed", rraError)
            toast.error("Stock updated, but RRA reporting failed.")
          }
        } else {
          toast.success(`Stock ${values.type.toLowerCase()} recorded`)
        }
      }

      setOpen(false)
      form.reset()
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${id ? 'update' : 'record'} movement`)
    } finally {
      setLoading(false)
    }
  }

  const type = form.watch("type")

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm">
              Update Stock
            </Button>
          )}
        </SheetTrigger>
        <SheetContent className="sm:max-w-[400px]">
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full gap-6">
            <SheetHeader>
              <SheetTitle>{id ? 'Edit Stock Movement' : 'Stock Movement'}</SheetTitle>
              <SheetDescription>
                {id 
                  ? 'Update this stock transaction details.' 
                  : <>Record a stock transaction for <span className="font-semibold text-foreground">{product?.name}</span> ({product?.sku}).</>}
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-6">
              <div className="flex p-1 bg-muted rounded-lg">
                <button
                  type="button"
                  onClick={() => form.setValue("type", "IN")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all",
                    type === "IN" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ArrowUpCircleIcon className={cn("size-4", type === "IN" && "text-green-500")} />
                  Stock In
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue("type", "OUT")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all",
                    type === "OUT" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ArrowDownCircleIcon className={cn("size-4", type === "OUT" && "text-red-500")} />
                  Stock Out
                </button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  {...form.register("quantity")}
                />
                {form.formState.errors.quantity && (
                  <p className="text-xs text-destructive">{form.formState.errors.quantity.message}</p>
                )}
                <p className="text-[10px] text-muted-foreground">Current available: {product?.quantity || 0}</p>
              </div>

              <div className="grid gap-2">
                <Label>Reason</Label>
                <Select
                  onValueChange={(value: any) => form.setValue("reason", value)}
                  defaultValue={form.getValues("reason")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase (Stock In)</SelectItem>
                    <SelectItem value="sale">Sale (Stock Out)</SelectItem>
                    <SelectItem value="damaged">Damaged (Stock Out)</SelectItem>
                    <SelectItem value="returned">Returned (Stock In)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="note">Notes</Label>
                <Textarea
                  id="note"
                  placeholder="Optional details..."
                  className="min-h-[100px] resize-none"
                  {...form.register("note")}
                />
              </div>

              {type === "OUT" && form.watch("reason") === "sale" && (
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-3">
                  <ShieldCheckIcon className="size-5 text-primary shrink-0" />
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    <span className="font-bold text-primary">RRA Compliance:</span> This sale will be automatically reported to RRA and an EBM receipt will be generated.
                  </p>
                </div>
              )}
            </div>

            <SheetFooter className="mt-auto">
              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full text-black font-semibold",
                  type === "IN" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                )}
              >
                {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                {id ? 'Update Movement' : `Confirm ${type === "IN" ? "Restock" : "Movement"}`}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <RRAReceiptDialog 
        open={receiptOpen} 
        onOpenChange={setReceiptOpen} 
        data={receiptData} 
      />
    </>
  )
}
