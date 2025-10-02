import * as React from "react"
import { cn } from "@/lib/utils"
export function Progress({ value = 0, className }: { value?: number, className?: string }) {
  const pct = Math.max(0, Math.min(100, value))
  return <div className={cn("w-full h-2 rounded-full bg-zinc-200 overflow-hidden", className)}><div className="h-full bg-amber-500 transition-all" style={{ width: pct + "%" }} /></div>
}
