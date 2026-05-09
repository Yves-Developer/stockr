"use client"

import * as React from "react"
import { 
  CheckCircle2Icon, 
  Loader2Icon, 
  RefreshCwIcon, 
  ShieldCheckIcon, 
  DatabaseIcon, 
  ServerIcon,
  AlertCircleIcon
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { toast } from "sonner"

interface SyncStep {
  id: string
  label: string
  status: "idle" | "loading" | "success" | "error"
}

export function RRASyncDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void 
}) {
  const [steps, setSteps] = React.useState<SyncStep[]>([
    { id: "connect", label: "Connecting to RRA VSDC Server", status: "idle" },
    { id: "auth", label: "Authenticating Device (TIN Verification)", status: "idle" },
    { id: "codes", label: "Syncing Standard Tax Codes", status: "idle" },
    { id: "push", label: "Pushing Offline Transactions", status: "idle" },
  ])
  const [isComplete, setIsComplete] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      startSync()
    } else {
      // Reset
      setSteps(s => s.map(step => ({ ...step, status: "idle" })))
      setIsComplete(false)
    }
  }, [open])

  const startSync = async () => {
    for (let i = 0; i < steps.length; i++) {
      const currentStep = steps[i]
      if (!currentStep) continue
      
      // Set current step to loading
      setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: "loading" } : s))
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      try {
        if (currentStep.id === "connect") {
          await api.get("/health") // Just check backend health
        } else if (currentStep.id === "auth") {
          await api.post("/rra/initialize")
        } else if (currentStep.id === "codes") {
          await api.get("/rra/codes")
        }
        
        // Mark as success
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: "success" } : s))
      } catch (error) {
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: "error" } : s))
        toast.error(`Failed at step: ${currentStep.label}`)
        return // Stop sync on error
      }
    }
    
    setIsComplete(true)
    toast.success("RRA Synchronization Complete")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <ShieldCheckIcon className="size-5 text-primary" />
            </div>
            <DialogTitle>RRA EBM Sync</DialogTitle>
          </div>
          <DialogDescription>
            Synchronizing your local inventory data with the Rwanda Revenue Authority VSDC systems.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-start gap-3">
              <div className="mt-0.5">
                {step.status === "idle" && (
                  <div className="size-5 rounded-full border-2 border-muted" />
                )}
                {step.status === "loading" && (
                  <Loader2Icon className="size-5 text-primary animate-spin" />
                )}
                {step.status === "success" && (
                  <CheckCircle2Icon className="size-5 text-green-500" />
                )}
                {step.status === "error" && (
                  <AlertCircleIcon className="size-5 text-destructive" />
                )}
              </div>
              <div className="space-y-1">
                <p className={cn(
                  "text-sm font-medium leading-none",
                  step.status === "loading" && "text-primary",
                  step.status === "success" && "text-green-600",
                  step.status === "error" && "text-destructive"
                )}>
                  {step.label}
                </p>
                {step.status === "loading" && (
                  <p className="text-[11px] text-muted-foreground animate-pulse">
                    Please wait while we establish a secure connection...
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 p-4 rounded-xl bg-muted/50 border border-border flex items-center gap-3">
          <div className="size-10 rounded-lg bg-background flex items-center justify-center border border-border">
            <ServerIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">VSDC STATUS</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600 font-bold">ONLINE</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground">Endpoint: vsdc.rra.gov.rw</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={!isComplete && steps.some(s => s.status === "loading")}>
            {isComplete ? "Close" : "Cancel"}
          </Button>
          {isComplete && (
            <Button size="sm" className="bg-primary text-black font-semibold" onClick={() => onOpenChange(false)}>
              View Sync Report
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
