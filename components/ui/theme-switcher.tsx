"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme()

  return (
    <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="fixed top-4 right-4 z-50">
      {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}&nbsp;
      Switch theme to {theme === "dark" ? "light" : "dark"}{" "}
    </Button>
  )
}