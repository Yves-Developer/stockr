"use client"

import * as React from "react"
import { Html5Qrcode } from "html5-qrcode"
import { toast } from "sonner"
import { 
  CameraIcon, 
  RotateCwIcon, 
  XIcon, 
  CheckCircle2Icon, 
  AlertCircleIcon, 
  Loader2Icon, 
  ArrowUpCircleIcon, 
  ArrowDownCircleIcon,
  SmartphoneIcon,
  QrCodeIcon,
  MonitorSmartphoneIcon
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StockMovementSheet } from "@/components/stock-movement-sheet"
import api from "@/lib/api"
import { useSidebar } from "@/components/ui/sidebar"

export default function ScannerPage() {
  const { isMobile } = useSidebar()
  const [scanResult, setScanResult] = React.useState<string | null>(null)
  const [product, setProduct] = React.useState<any>(null)
  const [isScanning, setIsScanning] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const html5QrCode = React.useRef<Html5Qrcode | null>(null)
  const [currentUrl, setCurrentUrl] = React.useState("")

  React.useEffect(() => {
    // In production this would be the public URL
    // For local dev, we use the local IP if possible, or just the current URL
    setCurrentUrl(window.location.href)
  }, [])

  const startScanner = async () => {
    if (!isMobile) return
    if (isScanning || isLoading) return

    setIsLoading(true)
    setError(null)
    try {
      if (!html5QrCode.current) {
        html5QrCode.current = new Html5Qrcode("reader")
      }

      setIsScanning(true)
      // Give the DOM a moment to render the #reader div before starting
      await new Promise(r => setTimeout(r, 100))

      const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0 
      }
      
      await html5QrCode.current.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        () => {} // Error callback
      )
    } catch (err: any) {
      setIsScanning(false)
      console.error("Camera Error:", err)
      setError("Camera access failed. Ensure you are on a secure connection (HTTPS or localhost).")
      toast.error("Could not start camera")
    } finally {
      setIsLoading(false)
    }
  }

  const stopScanner = async () => {
    if (html5QrCode.current && html5QrCode.current.isScanning) {
      try {
        await html5QrCode.current.stop()
      } catch (e) {
        console.warn("Error stopping scanner:", e)
      }
    }
    setIsScanning(false)
  }

  React.useEffect(() => {
    if (isMobile) {
      startScanner()
    }
    return () => {
      stopScanner()
    }
  }, [isMobile])

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

  // Desktop UI: Show QR Code to move to mobile
  if (!isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-var(--header-height))] p-4 bg-background overflow-hidden">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-flex size-12 items-center justify-center rounded-3xl bg-primary/10 mb-1 border border-primary/20">
              <MonitorSmartphoneIcon className="size-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Connect Phone Scanner</h1>
            <p className="text-muted-foreground text-xs max-w-[280px] mx-auto">
              Scan this QR code to use your phone as a wireless barcode scanner.
            </p>
          </div>

          <Card className="border-2 border-primary/10 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl">
            <CardContent className="flex flex-col items-center justify-center p-6 gap-6">
              <div className="relative p-4 bg-white rounded-[2rem] shadow-xl border-4 border-primary/5">
                {currentUrl ? (
                  <QRCodeSVG 
                    value={currentUrl} 
                    size={180}
                    level="H"
                    includeMargin={false}
                  />
                ) : (
                  <div className="size-[180px] flex items-center justify-center">
                    <Loader2Icon className="animate-spin size-6 text-primary" />
                  </div>
                )}
                
                {/* Branded Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white p-2 rounded-xl shadow-lg border border-primary/20">
                    <QrCodeIcon className="size-6 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 w-full">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                    1
                  </div>
                  <p className="text-[11px] font-medium">Open camera on your phone</p>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                    2
                  </div>
                  <p className="text-[11px] font-medium">Scan the code to launch mobile scanner</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-8" onClick={() => window.history.back()}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Mobile UI: Camera Scanner
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-var(--header-height))] p-4 bg-background overflow-hidden">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Barcode Scanner</h1>
          <p className="text-muted-foreground text-sm">
            Point your camera at a product barcode.
          </p>
        </div>

        <Card className={`relative overflow-hidden border-2 border-primary/20 aspect-square bg-black rounded-3xl ${!isScanning && 'flex items-center justify-center bg-black/5'}`}>
          <div id="reader" className="w-full h-full"></div>
          
          <style jsx global>{`
            #reader video {
              width: 100% !important;
              height: 100% !important;
              object-fit: cover !important;
              border-radius: 1.5rem;
            }
            #reader {
              border: none !important;
            }
          `}</style>
          
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
                  <Button onClick={startScanner} className="bg-primary text-black font-semibold rounded-xl px-8 py-6 text-lg">Enable Camera</Button>
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
                <div className="mt-4 p-4 rounded-2xl bg-primary/10 border border-primary/20 w-full space-y-4">
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
                        <Button className="bg-green-500 hover:bg-green-600 text-black font-bold h-12 rounded-xl">
                          <ArrowUpCircleIcon className="mr-2 size-5" />
                          IN
                        </Button>
                      }
                    />
                    <StockMovementSheet 
                      product={product}
                      onSuccess={resetScanner}
                      trigger={
                        <Button className="bg-red-500 hover:bg-red-600 text-black font-bold h-12 rounded-xl">
                          <ArrowDownCircleIcon className="mr-2 size-5" />
                          OUT
                        </Button>
                      }
                    />
                  </div>
                </div>
              )}

              <Button onClick={resetScanner} variant="ghost" className="mt-2 w-full text-muted-foreground hover:text-foreground">
                <RotateCwIcon className="mr-2 size-4" />
                Scan Again
              </Button>
            </div>
          )}
          
          {isScanning && (
             <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <div className="size-64 border-2 border-primary rounded-[3rem] opacity-50 animate-pulse flex items-center justify-center">
                   <div className="w-full h-0.5 bg-primary/50 absolute shadow-[0_0_15px_var(--primary)]"></div>
                </div>
             </div>
          )}
        </Card>

        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg" className="rounded-2xl size-16 p-0 border-2" onClick={startScanner}>
            <CameraIcon className="size-8" />
          </Button>
          <Button variant="outline" size="lg" className="rounded-2xl size-16 p-0 border-2" onClick={() => window.history.back()}>
            <XIcon className="size-8" />
          </Button>
        </div>
      </div>
    </div>
  )
}
