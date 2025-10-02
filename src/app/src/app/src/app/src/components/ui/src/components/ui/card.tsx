import * as React from "react"
import { cn } from "@/lib/utils"
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("rounded-2xl border bg-white text-zinc-900", className)} {...props} /> }
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} /> }
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <h3 className={cn("text-lg font-semibold", className)} {...props} /> }
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <p className={cn("text-sm text-zinc-500", className)} {...props} /> }
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("p-6 pt-0", className)} {...props} /> }
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("p-6 pt-0", className)} {...props} /> }
