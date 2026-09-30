import * as React from "react";
import { cn } from "../../lib/utils";

export function Alert({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "destructive" }) {
  return <div role="status" className={cn("flex items-start gap-3 rounded-lg border p-4 text-sm", variant === "destructive" ? "border-destructive/30 bg-destructive/5 text-destructive" : "border-border bg-card text-foreground", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm leading-relaxed", className)} {...props} />;
}