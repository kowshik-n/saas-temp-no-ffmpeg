import { UserProfile } from "@/components/auth/UserProfile";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export default function Profile() {
  const { loading } = useProtectedRoute();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background/30 p-4">
        <div className="w-full max-w-md text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/30 p-4">
      <div className="w-full max-w-md">
        <UserProfile />
      </div>
    </div>
  );
}
