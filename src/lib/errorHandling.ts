import { FirebaseError } from "firebase/app";
import { PostgrestError } from "@supabase/supabase-js";

export type AppError = {
  code: string;
  message: string;
  originalError?: unknown;
};

export function handleFirebaseError(error: unknown): AppError {
  if (error instanceof FirebaseError) {
    return {
      code: error.code,
      message: getFirebaseErrorMessage(error.code),
      originalError: error,
    };
  }

  return {
    code: "unknown",
    message: "An unexpected error occurred",
    originalError: error,
  };
}

export function handleSupabaseError(error: unknown): AppError {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    "message" in error
  ) {
    const pgError = error as PostgrestError;
    return {
      code: pgError.code,
      message: getSupabaseErrorMessage(pgError.code, pgError.message),
      originalError: error,
    };
  }

  return {
    code: "unknown",
    message: "An unexpected database error occurred",
    originalError: error,
  };
}

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please sign in instead.";
    case "auth/invalid-email":
      return "The email address is invalid.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
      return "No account found with this email. Please sign up instead.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again or reset your password.";
    case "auth/too-many-requests":
      return "Too many unsuccessful login attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    default:
      return "An authentication error occurred. Please try again.";
  }
}

function getSupabaseErrorMessage(code: string, defaultMessage: string): string {
  switch (code) {
    case "23505": // unique_violation
      return "This record already exists.";
    case "23503": // foreign_key_violation
      return "This operation references a record that does not exist.";
    case "42P01": // undefined_table
      return "Database configuration error. Please contact support.";
    case "42703": // undefined_column
      return "Database configuration error. Please contact support.";
    case "28P01": // invalid_password
      return "Invalid database credentials. Please contact support.";
    default:
      return defaultMessage || "A database error occurred. Please try again.";
  }
}
