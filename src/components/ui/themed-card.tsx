import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ThemedCardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  centered?: boolean;
  withShadow?: boolean;
  withBorder?: boolean;
}

export function ThemedCard({
  title,
  description,
  children,
  footer,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  titleClassName,
  descriptionClassName,
  centered = false,
  withShadow = true,
  withBorder = true,
}: ThemedCardProps) {
  return (
    <Card 
      className={cn(
        withBorder ? "border" : "border-0",
        withShadow ? "shadow-md" : "",
        className
      )}
    >
      {(title || description) && (
        <CardHeader className={cn(centered && "text-center", headerClassName)}>
          {title && (
            <CardTitle className={cn("text-2xl font-bold", titleClassName)}>
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className={descriptionClassName}>
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={contentClassName}>{children}</CardContent>
      {footer && (
        <CardFooter className={cn(centered && "justify-center", footerClassName)}>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
} 