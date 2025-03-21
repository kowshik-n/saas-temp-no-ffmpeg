import { SignupForm } from "@/components/auth/SignupForm";
import { GuestGuard } from "@/components/auth/GuestGuard";

export default function Signup() {
  return (
    <GuestGuard>
      <div className="min-h-screen flex items-center justify-center bg-background/30 p-4">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </GuestGuard>
  );
}
