"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [status, session, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const searchParams = new URLSearchParams(window.location.search);
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      callbackUrl,
      redirect: true
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
    }
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-md place-items-center px-4 pb-10 pt-28">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
      >
        <h1 className="font-display text-3xl font-semibold">Login</h1>
        <div className="mt-6 space-y-4">
          <Input name="email" type="email" placeholder="your@email.com" required />
          <Input name="password" type="password" placeholder="••••••••" required />
        </div>
        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
        <p className="mt-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          New here?{" "}
          <Link href="/register" className="font-medium text-brand-700">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
