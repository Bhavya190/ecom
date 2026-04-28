"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Signed in");
    const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
    router.push(callbackUrl ?? "/my-orders");
    router.refresh();
  }

  return (
    <div className="mx-auto grid min-h-[calc(100svh-8rem)] max-w-md place-items-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
      >
        <h1 className="text-2xl font-semibold">Login</h1>
        <div className="mt-6 space-y-4">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />
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
