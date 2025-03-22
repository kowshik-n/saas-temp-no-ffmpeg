import React from "react";
import { ThemedCard } from "@/components/ui/themed-card";
import { PageLayout } from "@/components/layout/PageLayout";

interface AuthFormContainerProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  footer?: React.ReactNode;
}

export function AuthFormContainer({
  children,
  title,
  description,
  footer,
}: AuthFormContainerProps) {
  return (
    <PageLayout containerSize="sm" centered>
      <ThemedCard
        title={title}
        description={description}
        footer={footer}
        centered
        className="w-full"
      >
        {children}
      </ThemedCard>
    </PageLayout>
  );
} 