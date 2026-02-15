"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UpdateAccountForm from "@/forms/account/UpdateAccount";
import { Loader2 } from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background pt-12 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-4">
              My Account
            </h1>
            <p className="text-foreground/60">
              Update your personal information.
            </p>
          </div>

          <div className="bg-white rounded-sm shadow-sm border border-secondary/20 p-6 md:p-8">
            <UpdateAccountForm />
          </div>
        </div>
      </div>
    </div>
  );
}
