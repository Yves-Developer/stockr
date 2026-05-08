"use client"

import * as React from "react"
import { QRCodeSVG } from "qrcode.react"
import { SmartphoneIcon, QrCodeIcon, Loader2Icon, MonitorSmartphoneIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"

export function ScannerBridgeDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()
  const router = useRouter()
  const [url, setUrl] = React.useState("")

  React.useEffect(() => {
    setUrl("http://192.168.1.73:3000/dashboard/scanner")
  }, [])

  const handleAction = () => {
    if (isMobile) {
      router.push("/dashboard/scanner")
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      <div onClick={handleAction} className="cursor-pointer">
        {trigger}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MonitorSmartphoneIcon className="size-5 text-primary" />
              Remote Barcode Scanner
            </DialogTitle>
            <DialogDescription>
              Turn your phone into a wireless barcode scanner for your computer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="relative p-4 bg-white rounded-3xl shadow-xl">
              {url ? (
                <QRCodeSVG 
                  value={url} 
                  size={200}
                  fgColor="#000000"
                  level="H"
                  includeMargin={false}
                />
              ) : (
                <div className="size-[200px] flex items-center justify-center">
                  <Loader2Icon className="animate-spin size-8 text-primary" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="bg-white p-2 rounded-xl shadow-lg border border-primary/20">
                    <QrCodeIcon className="size-6 text-primary" />
                 </div>
              </div>
            </div>

            <div className="space-y-4 w-full px-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  1
                </div>
                <p className="text-sm">Scan this QR code with your phone camera.</p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  2
                </div>
                <p className="text-sm">Scan any product barcode on your phone.</p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  3
                </div>
                <p className="text-sm">The product will instantly show up here.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center border-t pt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
