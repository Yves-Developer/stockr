"use client"

import * as React from "react"
import { Html5Qrcode } from "html5-qrcode"
import { toast } from "sonner"
import { CameraIcon, RotateCwIcon, XIcon, CheckCircle2Icon, AlertCircleIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StockMovementSheet } from "@/components/stock-movement-sheet"
import api from "@/lib/api"

export default function ScannerPage() {
  const [scanResult, setScanResult] = React.useState<string | null>(null)
  const [product, setProduct] = React.useState<any>(null)
  const [isScanning, setIsScanning] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const html5QrCode = React.useRef<Html5Qrcode | null>(null)

  const startScanner = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (!html5QrCode.current) {
        html5QrCode.current = new Html5Qrcode("reader")
      }

      const config = { fps: 10, qrbox: { width: 250, height: 250 } }
      
      await html5QrCode.current.start(
        { facingMode: "environment" },
        config,
        onScanSuccess
      )
      setIsScanning(true)
    } catch (err: any) {
      console.error("Camera Error:", err)
      setError("Camera access failed. Ensure you are on a secure connection (HTTPS or localhost).")
      toast.error("Could not start camera")
    } finally {
      setIsLoading(false)
    }
  }

  const stopScanner = async () => {
    if (html5QrCode.current && html5QrCode.current.isScanning) {
      await html5QrCode.current.stop()
    }
    setIsScanning(false)
  }

  React.useEffect(() => {
    // Attempt auto-start
    startScanner()
    return () => {
      stopScanner()
    }
  }, [])

  async function onScanSuccess(decodedText: string) {
    setScanResult(decodedText)
    stopScanner()

    try {
      const res = await api.get(`/products?search=${decodedText}`)
      const products = res.data.data
      if (products && products.length > 0) {
        setProduct(products[0])
        toast.success(`Found: ${products[0].name}`)
      } else {
        toast.error("Product not found")
      }
    } catch (error) {
      toast.error("Failed to lookup product")
    }
  }

  const resetScanner = () => {
    setScanResult(null)
    setProduct(null)
    startScanner()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height))] p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Barcode Scanner</h1>
          <p className="text-muted-foreground text-sm">
            Point your camera at a product barcode to scan.
          </p>
        </div>

        <Card className="relative overflow-hidden border-2 border-primary/20 aspect-square flex items-center justify-center bg-black/5">
          <div id="reader" className={`w-full h-full ${!isScanning && 'hidden'}`}></div>
          
          {!isScanning && !scanResult && (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              {error ? (
                <>
                  <AlertCircleIcon className="size-12 text-destructive" />
                  <p className="text-sm text-destructive font-medium">{error}</p>
                  <Button onClick={startScanner} variant="outline">Try Again</Button>
                </>
              ) : isLoading ? (
                <>
                  <Loader2Icon className="size-12 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Starting camera...</p>
                </>
              ) : (
                <>
                  <CameraIcon className="size-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Camera is ready</p>
                  <Button onClick={startScanner} className="bg-primary text-black">Enable Camera</Button>
                </>
              )}
            </div>
          )}

          {scanResult && (
            <div className="flex flex-col items-center gap-4 p-8 text-center animate-in fade-in zoom-in duration-300 z-10 bg-background/95 absolute inset-0">
              <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <CheckCircle2Icon className="size-10" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Scanned Code</p>
                <p className="text-2xl font-mono font-bold text-primary">{scanResult}</p>
              </div>
              
              {product && (
                <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20 w-full space-y-4">
                  <div className="text-left">
                    <p className="text-lg font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category?.name || "Uncategorized"}</p>
                    <p className="text-xl font-bold mt-2">RWF {product.price.toLocaleString()}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <StockMovementSheet 
                      product={product}
                      onSuccess={resetScanner}
                      trigger={
                        <Button className="bg-green-500 hover:bg-green-600 text-black font-bold h-12">
                          <ArrowUpCircleIcon className="mr-2 size-5" />
                          Stock IN
                        </Button>
                      }
                    />
                    <StockMovementSheet 
                      product={product}
                      onSuccess={resetScanner}
                      trigger={
                        <Button className="bg-red-500 hover:bg-red-600 text-black font-bold h-12">
                          <ArrowDownCircleIcon className="mr-2 size-5" />
                          Stock OUT
                        </Button>
                      }
                    />
                  </div>
                </div>
              )}

              <Button onClick={resetScanner} variant="ghost" className="mt-2 w-full text-muted-foreground hover:text-foreground">
                <RotateCwIcon className="mr-2 size-4" />
                Scan Different Product
              </Button>
            </div>
          )}
          
          {isScanning && (
             <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="size-64 border-2 border-primary rounded-3xl opacity-50 animate-pulse flex items-center justify-center">
                   <div className="w-full h-0.5 bg-primary/50 absolute shadow-[0_0_15px_var(--primary)]"></div>
                </div>
             </div>
          )}
        </Card>

        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg" className="rounded-full size-14 p-0" onClick={startScanner}>
            <CameraIcon className="size-6" />
          </Button>
          <Button variant="outline" size="lg" className="rounded-full size-14 p-0" onClick={() => window.history.back()}>
            <XIcon className="size-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
