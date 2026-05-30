import ChangePasswordForm from "@/components/modules/Auth/ChangePasswordForm";
import { getUserInfo } from "@/services/auth.services";
import { UserRole } from "@/lib/authUtils";
import { redirect } from "next/navigation";

const ChangePasswordPage = async () => {
  const user = await getUserInfo();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <ChangePasswordForm role={user.role as UserRole} />
    </div>
  );
};

export default ChangePasswordPage;
