import { UserProfile } from "@/components/auth/UserProfile";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Container } from "@/components/ui/container";
import { PageLayout } from "@/components/layout/PageLayout";

export default function Profile() {
  return (
    <AuthGuard>
      <PageLayout
        containerSize="md"
        className="min-h-screen flex items-center justify-center bg-background/30"
      >
        <UserProfile />
      </PageLayout>
    </AuthGuard>
  );
}
