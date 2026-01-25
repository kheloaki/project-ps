"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function AuthSignOutButton() {
  return (
    <SignOutButton>
      <Button variant="outline">Sign Out</Button>
    </SignOutButton>
  );
}

