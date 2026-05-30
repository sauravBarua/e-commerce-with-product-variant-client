"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { changePasswordAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/change-password/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Alert as AlertSuccess } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRole } from "@/lib/authUtils";
import {
  IChangePasswordPayload,
  changePasswordZodSchema,
} from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ChangePasswordFormProps {
  role: UserRole;
}

const ChangePasswordForm = ({ role }: ChangePasswordFormProps) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IChangePasswordPayload) =>
      changePasswordAction(payload, role),
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMessage(null);

      if (value.newPassword !== value.confirmPassword) {
        setServerError("New password and confirm password do not match");
        return;
      }

      try {
        const result = (await mutateAsync(value)) as any;

        if (result.success && result.redirectTo) {
          router.push(result.redirectTo);
          return;
        }

        if (!result.success) {
          setServerError(result.message || "Change password failed");
        }
      } catch (error: any) {
        console.log(`Change password failed: ${error.message}`);
        setServerError(`Change password failed: ${error.message}`);
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Change Password</CardTitle>
        <CardDescription>
          Enter your current password and choose a new one.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <AlertSuccess className="border-green-500 bg-green-50 text-green-800">
              <AlertDescription>{successMessage}</AlertDescription>
            </AlertSuccess>
          )}

          <form.Field
            name="currentPassword"
            validators={{
              onChange: changePasswordZodSchema.shape.currentPassword,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Current Password"
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter your current password"
                append={
                  <button
                    type="button"
                    onClick={() => setShowOldPassword((v) => !v)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={
                      showOldPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showOldPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                }
              />
            )}
          </form.Field>

          <form.Field
            name="newPassword"
            validators={{
              onChange: changePasswordZodSchema.shape.newPassword,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                append={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                }
              />
            )}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{
              onChange: changePasswordZodSchema.shape.confirmPassword,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                append={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                }
              />
            )}
          </form.Field>

          <AppSubmitButton isPending={isPending} pendingLabel="Changing...">
            Change Password
          </AppSubmitButton>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
