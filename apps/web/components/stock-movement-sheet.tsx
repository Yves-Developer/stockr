"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2Icon, ArrowUpCircleIcon, ArrowDownCircleIcon } from "lucide-react"

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

const movementSchema = z.object({
  type: z.enum(["IN", "OUT"]),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  reason: z.enum(["purchase", "sale", "damaged", "returned"]),
  note: z.string().optional(),
})

type MovementFormValues = z.infer<typeof movementSchema>

interface StockMovementSheetProps {
  product: {
    _id: string
    name: string
    sku: string
    quantity: number
  }
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function StockMovementSheet({ product, trigger, onSuccess }: StockMovementSheetProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      type: "IN",
      quantity: 1,
      reason: "purchase",
      note: "",
    },
  })

  async function onSubmit(values: MovementFormValues) {
    setLoading(true)
    try {
      await api.post("/stock-movements", {
        ...values,
        product: product._id,
      })
      toast.success(`Stock ${values.type.toLowerCase()} recorded for ${product.name}`)
      setOpen(false)
      form.reset()
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to record movement")
    } finally {
      setLoading(false)
    }
  }

  const type = form.watch("type")

  return (
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
            <SheetTitle>Stock Movement</SheetTitle>
            <SheetDescription>
              Record a stock transaction for <span className="font-semibold text-foreground">{product.name}</span> ({product.sku}).
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
              <p className="text-[10px] text-muted-foreground">Current available: {product.quantity}</p>
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
              Confirm {type === "IN" ? "Restock" : "Movement"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
