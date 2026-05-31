"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerAction } from "@/app/(commonLayout)/(authRouteGroup)/register/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RegisterFormProps {
  redirectPath?: string;
}

const RegisterForm = ({ redirectPath }: RegisterFormProps) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) =>
      registerAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;

        if (result.success && result.redirectTo) {
          router.push(result.redirectTo);
          return;
        }

        if (!result.success) {
          setServerError(result.message || "Registration failed");
          return;
        }
      } catch (error: any) {
        console.log(`Registration failed: ${error.message}`);
        setServerError(`Registration failed: ${error.message}`);
      }
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-black flex-col justify-between p-12 text-white">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          cyber
        </Link>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold leading-tight">
            Join thousands<br />of happy customers.
          </h2>
          <p className="text-gray-400 text-base">
            Create your free account and start shopping the latest tech today.
          </p>
        </div>
        <p className="text-gray-600 text-sm">© 2026 Cyber. All rights reserved.</p>
      </div>

      {/* ── Right form panel ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden text-2xl font-bold tracking-tighter mb-8">
          cyber
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
            <p className="text-gray-500 text-sm mt-1">
              Enter your details to get started.
            </p>
          </div>

          <form
            method="POST"
            action="#"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            <form.Field
              name="name"
              validators={{ onChange: registerZodSchema.shape.name }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                />
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{ onChange: registerZodSchema.shape.email }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                />
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{ onChange: registerZodSchema.shape.password }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="cursor-pointer"
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      variant="ghost"
                      size="icon"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Creating Account..."
                  disabled={!canSubmit}
                >
                  Sign Up
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-black hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
