import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) redirect("/sign-in");

  const user = {
    id: loggedInUser.$id,
    name: loggedInUser.name,
    email: loggedInUser.email,
    role: loggedInUser.role,
  };

  return (
    <div className="relative flex gap-4 w-full h-screen">
      <Sidebar user={user} />
      <div className="flex flex-col w-full overflow-y-auto">
        <div className="flex items-center justify-center my-3 xl:hidden">
          <Header user={user} />
        </div>

        <div className="py-6 px-[5%] lg:px-8 xl:px-0 xl:pr-4">{children}</div>
      </div>
    </div>
  );
}