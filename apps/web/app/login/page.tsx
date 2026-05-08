"use client"

import { LoginForm } from "@/components/login-form"
import { GalleryVerticalEndIcon } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-bold text-2xl">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-black">
            <GalleryVerticalEndIcon className="size-5" />
          </div>
          <span className="bg-gradient-to-r from-primary to-primary/40 bg-clip-text text-transparent">Stockr</span>
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
