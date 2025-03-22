// Re-export Container as PageContainer for backward compatibility
// This component is redundant with Container and should be deprecated

import { Container } from "@/components/ui/container";
import type { ContainerProps } from "@/components/ui/container";

interface PageContainerProps extends ContainerProps {}

export function PageContainer(props: PageContainerProps) {
  return <Container {...props} />;
}
