"use client"

import React from "react"
import { ThemeProvider } from "next-themes"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { Toaster as RadixToaster } from "@/components/ui/toaster"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <SonnerToaster />
      <RadixToaster />
    </ThemeProvider>
  )
}