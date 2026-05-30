"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateProfileAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";

interface UpdateProfileModalProps {
  user: any;
}

const UpdateProfileModal = ({ user }: UpdateProfileModalProps) => {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user?.image ?? null,
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const selectedFileRef = useRef<File | null>(null);
  const queryClient = useQueryClient();

  const role: string = user?.role ?? "";
  const profile = user?.customer ?? user?.admin ?? null;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (formData: FormData) => updateProfileAction(formData),
  });

  const form = useForm({
    defaultValues: {
      name: profile?.name ?? "",
      contactNumber: profile?.contactNumber ?? "",
      address: profile?.address ?? "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      const formData = new FormData();
      formData.append("name", value.name);
      if (value.contactNumber)
        formData.append("contactNumber", value.contactNumber);
      if (value.address) formData.append("address", value.address);

      if (selectedFileRef.current) {
        formData.append("file", selectedFileRef.current);
      }

      const result = await mutateAsync(formData);

      if (!result.success) {
        setServerError(result.message);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      setOpen(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    selectedFileRef.current = file;
    setPreviewUrl(URL.createObjectURL(file));
  };

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>

        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 pt-2"
        >
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-20 w-20">
              <AvatarImage src={previewUrl ?? undefined} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="profile-photo" className="sr-only">
                Profile Photo
              </Label>
              <Input
                id="profile-photo"
                ref={fileRef}
                type="file"
                accept="image/*"
                className="w-full cursor-pointer text-sm"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground mt-1 text-center">
                JPG, PNG or WEBP (max 5MB)
              </p>
            </div>
          </div>

          {/* Common Fields */}
          <form.Field name="name">
            {(field) => (
              <AppField
                field={field}
                label="Name"
                placeholder="Your full name"
              />
            )}
          </form.Field>

          <form.Field name="contactNumber">
            {(field) => (
              <AppField
                field={field}
                label="Contact Number"
                placeholder="e.g. +1234567890"
              />
            )}
          </form.Field>

          <form.Field name="address">
            {(field) => (
              <AppField
                field={field}
                label="Address"
                placeholder="Your address"
              />
            )}
          </form.Field>

          <AppSubmitButton isPending={isPending} pendingLabel="Saving...">
            Save Changes
          </AppSubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileModal;
