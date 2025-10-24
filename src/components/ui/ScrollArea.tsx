/*
 * @Date: 2025-01-23 15:30:00
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-10-24 15:50:30
 * @FilePath: \qianmian-china-travel-dashboard\src\components\ui\ScrollArea.tsx
 */
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-auto scrollbar-hide",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ScrollArea.displayName = "ScrollArea"

export { ScrollArea }