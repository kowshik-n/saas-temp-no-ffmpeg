import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthFormContainer } from "./AuthFormContainer";
import { AuthDivider } from "./AuthDivider";
import { SocialAuthButton } from "./SocialAuthButton";
import { CustomForm } from "@/components/ui/form";
import { toastService } from "@/services/toast-service";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      
      // Get the redirect path from location state or default to dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (error) {
      // Error handling is now done in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      // Error handling is now done in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toastService.error(
        "Email required", 
        "Please enter your email address to reset your password."
      );
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
    } catch (error) {
      // Error handling is now done in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <p className="text-sm text-gray-600">
      Don't have an account?{" "}
      <Link
        to="/signup"
        className="text-orange-500 hover:text-orange-600 font-medium"
      >
        Sign up
      </Link>
    </p>
  );

  return (
    <AuthFormContainer
      title="Welcome back"
      description="Enter your credentials to access your account"
      footer={footer}
    >
      <CustomForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitText="Login"
        loadingText="Logging in..."
        fields={[
          {
            id: "email",
            label: "Email",
            type: "email",
            placeholder: "name@example.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true
          },
          {
            id: "password",
            label: (
              <div className="flex justify-between items-center">
                <span>Password</span>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-sm text-orange-500 hover:text-orange-600"
                >
                  Forgot password?
                </button>
              </div>
            ),
            type: "password",
            placeholder: "••••••••",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true
          }
        ]}
      />
      
      <AuthDivider />
      
      <SocialAuthButton
        provider="google"
        onClick={handleGoogleSignIn}
        isLoading={isLoading}
      />
    </AuthFormContainer>
  );
}
