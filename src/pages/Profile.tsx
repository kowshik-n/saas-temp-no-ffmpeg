import { UserProfile } from "@/components/auth/UserProfile";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function Profile() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-background/30 p-4">
        <div className="w-full max-w-md">
          <UserProfile />
        </div>
      </div>
    </AuthGuard>
  );
}
