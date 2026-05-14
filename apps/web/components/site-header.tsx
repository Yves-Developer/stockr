"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const pathname = usePathname()
  
  // Format the title from the pathname (e.g., /stock-movements -> Stock Movements)
  const getTitle = () => {
    const segment = pathname.split('/').pop()
    if (!segment || segment === 'dashboard') return 'Dashboard'
    return segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 bg-border/50"
        />
        <h1 className="text-sm font-semibold tracking-tight">{getTitle()}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle variant="icon" />
        </div>
      </div>
    </header>
  )
}
