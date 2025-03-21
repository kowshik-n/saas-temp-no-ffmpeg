import { supabase } from "@/lib/supabase";

export interface User {
  id: number;
  firebase_uid: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  is_pro: boolean;
  created_at: string;
  updated_at: string | null;
}

export async function getUserByFirebaseId(
  firebaseUid: string,
): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("firebase_uid", firebaseUid)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Record not found
      return null;
    }
    console.error("Error fetching user:", error);
    throw error;
  }

  return data;
}

export async function createUser(userData: {
  firebase_uid: string;
  email: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
}): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        firebase_uid: userData.firebase_uid,
        email: userData.email,
        display_name:
          userData.display_name || userData.email?.split("@")[0] || null,
        avatar_url: userData.avatar_url || null,
        is_pro: false,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", error);
    throw error;
  }

  return data;
}

export async function updateUser(
  firebaseUid: string,
  updates: Partial<User>,
): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("firebase_uid", firebaseUid)
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    throw error;
  }

  return data;
}

export async function upgradeUserToPro(firebaseUid: string): Promise<User> {
  return updateUser(firebaseUid, { is_pro: true });
}

export async function downgradeUserFromPro(firebaseUid: string): Promise<User> {
  return updateUser(firebaseUid, { is_pro: false });
}
