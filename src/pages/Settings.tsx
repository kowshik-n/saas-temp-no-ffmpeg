import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";

export default function Settings() {
  return (
    <AuthGuard>
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      setIsUpdating(true);

      // Update user in Supabase
      const { data, error } = await supabase
        .from("users")
        .update({
          display_name: displayName,
          updated_at: new Date().toISOString(),
        })
        .eq("firebase_uid", user.uid);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description:
          "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <Tabs defaultValue="profile" className="max-w-3xl">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information and email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.photoURL || undefined} />
                  <AvatarFallback className="text-lg">
                    {user?.displayName?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Avatar</Button>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input
                    id="display-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} disabled />
                  <p className="text-sm text-gray-500">
                    Email cannot be changed
                  </p>
                </div>
              </div>

              <Button
                onClick={handleUpdateProfile}
                disabled={isUpdating}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                Manage your subscription and billing information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">
                      {subscription?.name || "Free Plan"}
                    </h3>
                    <p className="text-gray-500">
                      {subscription?.id === "free"
                        ? "Limited features"
                        : "Full access to all features"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">
                      ${subscription?.price || 0}
                      {subscription?.price ? "/month" : ""}
                    </p>
                    {subscription?.id === "free" ? (
                      <p className="text-green-600 text-sm">Free forever</p>
                    ) : (
                      <p className="text-gray-500 text-sm">Renews monthly</p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => (window.location.href = "/pricing")}
                variant="outline"
              >
                {subscription?.id === "free"
                  ? "Upgrade Plan"
                  : "Manage Subscription"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Notification settings coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
    </AuthGuard>
  );
}
