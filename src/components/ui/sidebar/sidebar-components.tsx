
import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "../input"
import { Separator } from "../separator"

export const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentPropsWithoutRef<typeof Input>
>(({ className, ...props }, ref) => (
  <Input
    ref={ref}
    data-sidebar="input"
    className={cn(
      "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
      className
    )}
    {...props}
  />
))
SidebarInput.displayName = "SidebarInput"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="header"
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="footer"
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

export const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    data-sidebar="separator"
    className={cn("mx-2 w-auto bg-sidebar-border", className)}
    {...props}
  />
))
SidebarSeparator.displayName = "SidebarSeparator"
