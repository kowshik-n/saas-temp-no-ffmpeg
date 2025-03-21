import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePro } from "@/context/ProContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function UserProfile() {
  const { user, signOut } = useAuth();
  const { isPro } = usePro();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign out. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Not Logged In</CardTitle>
          <CardDescription>Please log in to view your profile</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const userInitials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.substring(0, 2).toUpperCase() || "U";

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={user.photoURL || undefined}
              alt={user.displayName || "User"}
            />
            <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-2xl font-bold">
          {user.displayName || user.email?.split("@")[0]}
        </CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Account Status</h3>
          <div className="flex items-center">
            <div
              className={`h-3 w-3 rounded-full mr-2 ${isPro ? "bg-green-500" : "bg-amber-500"}`}
            ></div>
            <span>{isPro ? "Pro Account" : "Free Account"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? "Signing out..." : "Sign out"}
        </Button>
      </CardFooter>
    </Card>
  );
}
