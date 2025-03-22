import { LoginForm } from "@/components/auth/LoginForm";
import { GuestGuard } from "@/components/auth/GuestGuard";
import { Container } from "@/components/ui/container";
import { PageLayout } from "@/components/layout/PageLayout";

export default function Login() {
  return (
    <GuestGuard>
      <PageLayout
        containerSize="md"
        className="min-h-screen flex items-center justify-center bg-background/30"
      >
        <LoginForm />
      </PageLayout>
    </GuestGuard>
  );
}
