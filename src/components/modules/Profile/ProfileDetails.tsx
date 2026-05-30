"use client";

import { getProfileAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Building,
  Calendar,
  DollarSign,
  GraduationCap,
  Hash,
  Mail,
  MapPin,
  Phone,
  Star,
  User as UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UpdateProfileModal from "./UpdateProfileModal";

interface ProfileField {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}

function ProfileFieldRow({ icon, label, value }: ProfileField) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{String(value)}</p>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 pb-2">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2 flex flex-col items-center">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-5 w-20" />
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-4">
          <Skeleton className="h-4 w-32" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const ProfileDetails = () => {
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfileAction(),
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) return <ProfileSkeleton />;
  if (!user) return null;

  const role: string = user.role;
  const profile = user.patient ?? user.doctor ?? user.admin ?? null;

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const commonFields: ProfileField[] = [
    {
      icon: <Mail className="h-4 w-4" />,
      label: "Email",
      value: profile?.email,
    },
    {
      icon: <Phone className="h-4 w-4" />,
      label: "Contact Number",
      value: profile?.contactNumber,
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      label: "Address",
      value: profile?.address,
    },
  ];

  const doctorFields: ProfileField[] =
    role === "DOCTOR" && user.doctor
      ? [
          {
            icon: <Hash className="h-4 w-4" />,
            label: "Registration Number",
            value: user.doctor.registrationNumber,
          },
          {
            icon: <Briefcase className="h-4 w-4" />,
            label: "Designation",
            value: user.doctor.designation,
          },
          {
            icon: <GraduationCap className="h-4 w-4" />,
            label: "Qualification",
            value: user.doctor.qualification,
          },
          {
            icon: <Building className="h-4 w-4" />,
            label: "Current Workplace",
            value: user.doctor.currentWorkingPlace,
          },
          {
            icon: <Calendar className="h-4 w-4" />,
            label: "Experience",
            value: user.doctor.experience
              ? `${user.doctor.experience} years`
              : null,
          },
          {
            icon: <DollarSign className="h-4 w-4" />,
            label: "Appointment Fee",
            value: user.doctor.appointmentFee
              ? `$${user.doctor.appointmentFee}`
              : null,
          },
          {
            icon: <UserIcon className="h-4 w-4" />,
            label: "Gender",
            value: user.doctor.gender,
          },
          {
            icon: <Star className="h-4 w-4" />,
            label: "Average Rating",
            value: user.doctor.averageRating,
          },
        ]
      : [];

  const specialties: { specialty: { title: string } }[] =
    role === "DOCTOR" ? (user.doctor?.specialties ?? []) : [];

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <Card>
        <CardHeader className="flex flex-col items-center gap-4 pb-2">
          <Avatar className="h-20 w-20 text-2xl">
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            <CardTitle className="text-2xl">
              {profile?.name ?? "User"}
            </CardTitle>
            <Badge variant="secondary" className="capitalize">
              {role.toLowerCase().replace("_", " ")}
            </Badge>
          </div>
          <UpdateProfileModal user={user} />
        </CardHeader>

        <Separator />

        <CardContent className="pt-6 space-y-6">
          {/* Common info */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Contact Information
            </h3>
            <div className="grid gap-1 sm:grid-cols-2">
              {commonFields.map(
                (field, i) =>
                  field.value && <ProfileFieldRow key={i} {...field} />,
              )}
            </div>
          </div>

          {/* Doctor-specific */}
          {role === "DOCTOR" && doctorFields.some((f) => f.value) && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  Professional Information
                </h3>
                <div className="grid gap-1 sm:grid-cols-2">
                  {doctorFields.map(
                    (field, i) =>
                      field.value && <ProfileFieldRow key={i} {...field} />,
                  )}
                </div>
              </div>
            </>
          )}

          {/* Specialties */}
          {specialties.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {specialties.map(
                    (s: { specialty: { title: string } }, i: number) => (
                      <Badge key={i} variant="outline">
                        {s.specialty?.title}
                      </Badge>
                    ),
                  )}
                </div>
              </div>
            </>
          )}

          {/* Patient appointment count */}
          {role === "PATIENT" && user.patient?.appointments && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  Appointments
                </h3>
                <p className="text-sm">
                  Total appointments:{" "}
                  <span className="font-semibold">
                    {user.patient.appointments.length}
                  </span>
                </p>
              </div>
            </>
          )}

          {/* Admin/Super Admin */}
          {(role === "ADMIN" || role === "SUPER_ADMIN") && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  Account
                </h3>
                <p className="text-sm text-muted-foreground">
                  You are signed in as an administrator.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileDetails;
