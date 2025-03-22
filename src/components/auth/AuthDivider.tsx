import React from "react";

interface AuthDividerProps {
  text?: string;
}

export function AuthDivider({ text = "Or continue with" }: AuthDividerProps) {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white text-gray-500">{text}</span>
      </div>
    </div>
  );
} 