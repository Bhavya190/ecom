"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Instagram, Loader2, Mail, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.enum(
    ["Product Inquiry", "Custom Order Request", "General Question", "Other"],
    {
      errorMap: () => ({ message: "Please select a subject" })
    }
  ),
  message: z.string().min(20, "Message must be at least 20 characters")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSuccess(false);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSuccess(true);
      reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-cream px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="font-display text-5xl font-semibold text-soft-black md:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal/70">
            Have a question about a product, want a custom creation, or just want
            to say hello? I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          {/* Form Section */}
          <div className="rounded-[32px] border border-white/60 bg-white/40 p-6 shadow-soft backdrop-blur-sm sm:p-10">
            {isSuccess ? (
              <div className="flex h-full flex-col items-center justify-center space-y-4 py-16 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-blush/30 text-[#a85066]">
                  <Mail size={32} />
                </div>
                <h3 className="font-display text-3xl font-semibold text-soft-black">
                  Thank you! I&apos;ll get back to you soon 💌
                </h3>
                <Button
                  onClick={() => setIsSuccess(false)}
                  variant="secondary"
                  className="mt-4 rounded-full"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-charcoal/80"
                    >
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      {...register("name")}
                      className="h-12 bg-white/60 font-body"
                      placeholder="Jane Doe"
                    />
                    {errors.name && (
                      <p className="text-sm font-medium text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-charcoal/80"
                    >
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="h-12 bg-white/60 font-body"
                      placeholder="jane@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm font-medium text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-semibold text-charcoal/80"
                    >
                      Phone (optional)
                    </label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      className="h-12 bg-white/60 font-body"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-semibold text-charcoal/80"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      {...register("subject")}
                      className="flex h-12 w-full rounded-md border border-neutral-200 bg-white/60 px-3 py-2 font-body text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                    >
                      <option value="">Select a subject...</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Custom Order Request">
                        Custom Order Request
                      </option>
                      <option value="General Question">General Question</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="text-sm font-medium text-red-500">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-semibold text-charcoal/80"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={6}
                    className="flex w-full rounded-md border border-neutral-200 bg-white/60 px-3 py-2 font-body text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                    placeholder="How can I help you?"
                  />
                  {errors.message && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-full bg-soft-black font-semibold text-white hover:bg-soft-black/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Info Panel Section */}
          <div className="relative overflow-hidden rounded-[32px] bg-blush/40 p-8 shadow-soft sm:p-10 lg:p-12">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-lavender/60 blur-[40px]" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-peach/50 blur-[50px]" />

            <div className="relative z-10">
              <h3 className="font-display text-3xl font-semibold text-soft-black">
                Contact Information
              </h3>
              <p className="mt-4 leading-relaxed text-charcoal/80">
                I typically respond within 24 hours. For urgent custom orders,
                WhatsApp is the fastest way to reach me.
              </p>

              <div className="mt-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/50 text-[#a85066] backdrop-blur-sm">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal/60">
                      Email
                    </p>
                    <a
                      href="mailto:hello@artbydhruvangi.com"
                      className="text-lg font-medium text-soft-black transition hover:text-[#a85066]"
                    >
                      hello@artbydhruvangi.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/50 text-[#a85066] backdrop-blur-sm">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal/60">
                      WhatsApp
                    </p>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noreferrer"
                      className="text-lg font-medium text-soft-black transition hover:text-[#a85066]"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/50 text-[#a85066] backdrop-blur-sm">
                    <Instagram size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal/60">
                      Instagram
                    </p>
                    <a
                      href="https://instagram.com/artbydhruvangi"
                      target="_blank"
                      rel="noreferrer"
                      className="text-lg font-medium text-soft-black transition hover:text-[#a85066]"
                    >
                      @artbydhruvangi
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
