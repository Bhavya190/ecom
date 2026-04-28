"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password")
    };

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setLoading(false);
      const data = await response.json().catch(() => null);
      toast.error(data?.message ?? "Could not create account");
      return;
    }

    await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false
    });

    setLoading(false);
    toast.success("Account created");
    router.push("/my-orders");
    router.refresh();
  }

  return (
    <div className="mx-auto grid min-h-[calc(100svh-8rem)] max-w-md place-items-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
      >
        <h1 className="text-2xl font-semibold">Create Account</h1>
        <div className="mt-6 space-y-4">
          <Input name="name" placeholder="Full Name" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required minLength={8} />
        </div>
        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </Button>
        <p className="mt-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-700">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
