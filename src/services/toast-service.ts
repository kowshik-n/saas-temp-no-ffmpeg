import { toast, ToastOptions } from "@/hooks/use-toast";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastServiceOptions {
  duration?: number;
  position?: "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left";
}

class ToastService {
  private defaultOptions: ToastOptions = {
    duration: 5000,
  };

  constructor(options?: ToastServiceOptions) {
    if (options) {
      this.defaultOptions = {
        ...this.defaultOptions,
        ...options,
      };
    }
  }

  success(title: string, description?: string, options?: ToastOptions) {
    toast({
      title,
      description,
      variant: "default",
      ...this.defaultOptions,
      ...options,
    });
  }

  error(title: string, description?: string, options?: ToastOptions) {
    toast({
      title,
      description,
      variant: "destructive",
      ...this.defaultOptions,
      ...options,
    });
  }

  warning(title: string, description?: string, options?: ToastOptions) {
    toast({
      title,
      description,
      variant: "default",
      className: "bg-amber-50 border-amber-200 text-amber-800",
      ...this.defaultOptions,
      ...options,
    });
  }

  info(title: string, description?: string, options?: ToastOptions) {
    toast({
      title,
      description,
      variant: "default",
      className: "bg-blue-50 border-blue-200 text-blue-800",
      ...this.defaultOptions,
      ...options,
    });
  }

  // Handle API errors
  apiError(error: any, fallbackMessage = "An unexpected error occurred") {
    let errorMessage = fallbackMessage;
    
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    this.error("Error", errorMessage);
  }

  // Helper for handling auth errors
  handleAuthError(error: any) {
    let errorMessage = "Authentication failed. Please try again.";
    
    if (error?.code === "auth/invalid-credential") {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (error?.code === "auth/user-not-found") {
      errorMessage = "No account found with this email. Please sign up.";
    } else if (error?.code === "auth/wrong-password") {
      errorMessage = "Incorrect password. Please try again.";
    } else if (error?.code === "auth/too-many-requests") {
      errorMessage = "Too many failed login attempts. Please try again later.";
    } else if (error?.code === "auth/email-already-in-use") {
      errorMessage = "Email already in use. Please login or use a different email.";
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    this.error("Authentication Error", errorMessage);
  }
}

// Create and export a singleton instance
export const toastService = new ToastService(); 