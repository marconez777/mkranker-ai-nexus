
import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { type VariantProps } from "class-variance-authority"
import { toastVariants } from "./toast-variants"

export type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
  VariantProps<typeof toastVariants>

export type ToastActionElement = React.ReactElement<typeof ToastPrimitives.Action>
