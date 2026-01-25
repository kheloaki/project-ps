"use client";

import { useAuth } from "@clerk/nextjs";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ProtectedProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function Protected({ 
  children, 
  fallback = null, 
  redirectTo = "/sign-in" 
}: ProtectedProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    if (redirectTo) {
      router.push(redirectTo);
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

