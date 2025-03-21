import { LoginForm } from "@/components/auth/LoginForm";
import { GuestGuard } from "@/components/auth/GuestGuard";

export default function Login() {
  return (
    <GuestGuard>
      <div className="min-h-screen flex items-center justify-center bg-background/30 p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </GuestGuard>
  );
}
