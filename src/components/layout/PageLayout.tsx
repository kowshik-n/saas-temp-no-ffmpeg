import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  withPadding?: boolean;
  withMargin?: boolean;
  centered?: boolean;
  fullHeight?: boolean;
}

/**
 * PageLayout component provides a consistent layout wrapper around Container
 * Use this component for page-level layouts to maintain consistency
 */
export function PageLayout({
  children,
  className,
  containerSize = "lg",
  withPadding = true,
  withMargin = true,
  centered = false,
  fullHeight = false,
}: PageLayoutProps) {
  return (
    <div
      className={cn(
        "w-full",
        withMargin && "my-4",
        centered && "flex flex-col items-center",
        fullHeight && "min-h-[calc(100vh-4rem)]",
        className,
      )}
    >
      <Container size={containerSize} padding={withPadding} className="w-full">
        {children}
      </Container>
    </div>
  );
}
