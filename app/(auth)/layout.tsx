import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLoggedInUser();

  if (user) {
    user.role === "patient"
      ? redirect(`/patient/${user.patientId}/overview`)
      : user.role === "admin"
      ? redirect(`/admin/overview`)
      : redirect(`/${user.role}/${user.$id}/overview`);
  }

  return <>{children}</>;
}
