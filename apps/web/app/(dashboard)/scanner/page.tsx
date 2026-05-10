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
  MonitorSmartphoneIcon,
  PlusIcon
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AddProductDialog } from "@/components/add-product-dialog"
import { StockMovementDialog } from "@/components/stock-movement-dialog"
import api from "@/lib/api"
import { authClient } from "@/lib/auth-client"
import { useSidebar } from "@/components/ui/sidebar"

export default function ScannerPage() {
  const { isMobile } = useSidebar()
  const { data: session } = authClient.useSession()
  const [scanResult, setScanResult] = React.useState<string | null>(null)
  const [product, setProduct] = React.useState<any>(null)
  const [isScanning, setIsScanning] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const html5QrCode = React.useRef<Html5Qrcode | null>(null)
  const [currentUrl, setCurrentUrl] = React.useState("")

  React.useEffect(() => {
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
        () => {} 
      )
    } catch (err: any) {
      setIsScanning(false)
      console.error("Camera Error:", err)
      setError("Camera access failed. Ensure you are on a secure connection.")
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

  const handleActionSuccess = () => {
    setIsSuccess(true)
    setProduct(null)
    setScanResult(null)
    
    setTimeout(() => {
      setIsSuccess(false)
      startScanner()
    }, 2000)
  }

  const resetScanner = () => {
    setScanResult(null)
    setProduct(null)
    setIsSuccess(false)
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
    <div className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between z-10 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
            <QrCodeIcon className="size-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter italic uppercase leading-none">Stockr <span className="text-primary text-xs not-italic font-bold ml-1">v2.0</span></h1>
            {session?.user && (
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Operator: {session.user.name}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session?.user?.image && (
            <img src={session.user.image} alt="" className="size-8 rounded-lg border border-white/20" />
          )}
          <Button variant="ghost" size="icon" className="text-white/50" onClick={() => window.location.href = "/dashboard"}>
            <XIcon className="size-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10 relative">
        <div className="w-full max-w-md space-y-6">
          <Card className={`relative overflow-hidden border-2 border-primary/20 aspect-square bg-black rounded-3xl ${!isScanning && 'flex items-center justify-center bg-black/5 shadow-2xl'}`}>
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
                    <Button onClick={startScanner} variant="outline" className="text-white border-white/20">Try Again</Button>
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
                    <Button onClick={startScanner} className="bg-primary text-black font-black rounded-xl px-8 py-6 text-lg uppercase italic tracking-tighter">Enable Camera</Button>
                  </>
                )}
              </div>
            )}

            {scanResult && !isSuccess && (
              <div className="flex flex-col items-center gap-4 p-8 text-center animate-in fade-in zoom-in duration-300 z-10 bg-black/95 absolute inset-0">
                {product ? (
                  <>
                    <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <CheckCircle2Icon className="size-10" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Product Found</p>
                      <p className="text-2xl font-bold text-primary">{product.name}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">SKU: {scanResult}</p>
                    </div>
                    
                    <div className="mt-4 p-4 rounded-2xl bg-primary/10 border border-primary/20 w-full space-y-4">
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground">{product.category?.name || "Uncategorized"}</p>
                        <p className="text-xl font-bold mt-1">RWF {product.price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">Stock: {product.quantity} units</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <StockMovementDialog 
                          product={product}
                          type="IN"
                          onSuccess={handleActionSuccess}
                          trigger={
                            <Button className="bg-green-500 hover:bg-green-600 text-black font-bold h-12 rounded-xl w-full">
                              <ArrowUpCircleIcon className="mr-2 size-5" />
                              STOCK IN
                            </Button>
                          }
                        />
                        <StockMovementDialog 
                          product={product}
                          type="OUT"
                          onSuccess={handleActionSuccess}
                          trigger={
                            <Button className="bg-red-500 hover:bg-red-600 text-black font-bold h-12 rounded-xl w-full">
                              <ArrowDownCircleIcon className="mr-2 size-5" />
                              SELL (OUT)
                            </Button>
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                      <AlertCircleIcon className="size-10" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">New Product Detected</p>
                      <p className="text-2xl font-bold text-white">Not in Inventory</p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">SKU: {scanResult}</p>
                    </div>

                    <div className="mt-4 w-full space-y-4">
                      <AddProductDialog 
                        initialValues={{ sku: scanResult }}
                        onSuccess={handleActionSuccess}
                        trigger={
                          <Button className="bg-primary text-black font-black h-14 rounded-xl w-full text-lg uppercase italic tracking-tighter">
                            <PlusIcon className="mr-2 size-6" />
                            ADD TO STOCK
                          </Button>
                        }
                      />
                      
                      <Button onClick={resetScanner} variant="ghost" className="w-full text-muted-foreground hover:text-white">
                        <RotateCwIcon className="mr-2 size-4" />
                        Try Another Scan
                      </Button>
                    </div>
                  </>
                )}

                {!product && (
                  <Button onClick={resetScanner} variant="ghost" className="mt-auto w-full text-muted-foreground hover:text-white">
                    <RotateCwIcon className="mr-2 size-4" />
                    Scan Again
                  </Button>
                )}
              </div>
            )}

            {isSuccess && (
              <div className="flex flex-col items-center justify-center gap-4 p-8 text-center animate-in fade-in zoom-in duration-500 z-50 bg-primary absolute inset-0">
                 <div className="size-24 rounded-full bg-white/20 flex items-center justify-center text-white animate-bounce">
                    <CheckCircle2Icon className="size-16" />
                 </div>
                 <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Success!</h2>
                 <p className="text-white/80 font-medium tracking-tight">Inventory updated successfully.</p>
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
            <Button variant="outline" size="lg" className="rounded-2xl size-16 p-0 border-2 border-white/10 bg-white/5 hover:bg-white/10 text-white" onClick={startScanner}>
              <CameraIcon className="size-8" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-2xl size-16 p-0 border-2 border-white/10 bg-white/5 hover:bg-white/10 text-white" onClick={resetScanner}>
              <RotateCwIcon className="size-8" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
