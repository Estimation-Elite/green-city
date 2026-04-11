import * as React from "react"
import { cn } from "@repo/utils"

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(
                    "text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    className
                )}
                {...props}
            />
        )
    }
)
Label.displayName = "Label"

export { Label }
