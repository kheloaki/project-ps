"use client";

import { useAuth } from "@clerk/nextjs";
import { AuthUserButton, AuthSignInButton } from "./index";
import { User } from "lucide-react";

/**
 * Example header component showing how to integrate Clerk authentication
 * Replace the User icon in your header with this component
 */
export function AuthHeader() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="p-1">
        <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
      </div>
    );
  }

  if (isSignedIn) {
    return <AuthUserButton />;
  }

  return <AuthSignInButton />;
}

