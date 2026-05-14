"use client"

import * as React from "react"
import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function ThemeToggle({ variant = "tabs" }: { variant?: "tabs" | "icon" }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-[180px] h-8 animate-pulse bg-white/5 rounded-md" />

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="size-9 rounded-xl border border-white/5 hover:bg-white/5"
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Tabs value={theme} onValueChange={setTheme} className="w-[180px]">
      <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 h-8 p-1">
        <TabsTrigger value="light" className="h-6 data-[state=active]:bg-white data-[state=active]:text-black">
          <SunIcon className="size-3.5" />
        </TabsTrigger>
        <TabsTrigger value="dark" className="h-6 data-[state=active]:bg-white data-[state=active]:text-black">
          <MoonIcon className="size-3.5" />
        </TabsTrigger>
        <TabsTrigger value="system" className="h-6 data-[state=active]:bg-white data-[state=active]:text-black">
          <MonitorIcon className="size-3.5" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
