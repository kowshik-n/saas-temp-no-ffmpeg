import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { brandColors } from "@/lib/theme-config";

type ButtonVariant = 
  | "primary" 
  | "secondary" 
  | "success" 
  | "warning" 
  | "danger" 
  | "outline" 
  | "ghost" 
  | "link";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

interface ThemedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
}

export function ThemedButton({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  icon,
  iconPosition = "left",
  fullWidth = false,
  className,
  ...props
}: ThemedButtonProps) {
  // Map our variants to the appropriate Tailwind classes
  const variantClasses = {
    primary: `${brandColors.primary.bg} text-white hover:bg-orange-600`,
    secondary: `${brandColors.secondary.bg} ${brandColors.secondary.text} ${brandColors.secondary.hover.bg}`,
    success: `${brandColors.success.bg} text-white hover:bg-green-600`,
    warning: `${brandColors.warning.bg} text-white hover:bg-amber-600`,
    danger: `${brandColors.danger.bg} text-white hover:bg-red-600`,
    outline: "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    link: "bg-transparent text-orange-500 hover:underline p-0 h-auto",
  };

  // Map sizes to Tailwind classes
  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg",
    xl: "px-6 py-3 text-xl",
  };

  return (
    <Button
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        "flex items-center justify-center transition-colors",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          {loadingText || children}
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span className="mr-2">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </Button>
  );
} 