import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { AuthFormContainer } from "./AuthFormContainer";
import { AuthDivider } from "./AuthDivider";
import { SocialAuthButton } from "./SocialAuthButton";
import { CustomForm } from "@/components/ui/form";
import { toastService } from "@/services/toast-service";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toastService.error(
        "Passwords do not match",
        "Please make sure your passwords match."
      );
      return;
    }

    if (password.length < 6) {
      toastService.error(
        "Password too short",
        "Password must be at least 6 characters long."
      );
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password);
      navigate("/dashboard");
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

  const footer = (
    <p className="text-sm text-gray-600">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-orange-500 hover:text-orange-600 font-medium"
      >
        Log in
      </Link>
    </p>
  );

  return (
    <AuthFormContainer
      title="Create an account"
      description="Enter your details to create a new account"
      footer={footer}
    >
      <CustomForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitText="Sign Up"
        loadingText="Creating account..."
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
            label: "Password",
            type: "password",
            placeholder: "••••••••",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            minLength: 6
          },
          {
            id: "confirmPassword",
            label: "Confirm Password",
            type: "password",
            placeholder: "••••••••",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            required: true,
            minLength: 6
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
