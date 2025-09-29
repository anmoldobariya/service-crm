import { cn } from "@/lib/utils"
import { Button } from "./button"

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  tooltip?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg"
}

export function IconButton({
  icon,
  tooltip,
  variant = "ghost",
  size = "default",
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size="icon"
      className={cn(
        size === "sm" && "h-8 w-8",
        size === "lg" && "h-12 w-12",
        className
      )}
      title={tooltip}
      {...props}
    >
      {icon}
    </Button>
  )
}