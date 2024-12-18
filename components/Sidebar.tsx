import { SidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import LogoutFooter from "./LogoutFooter";

const Sidebar = async ({
  user,
}: {
  user: { id: string; name: string; email: string; role: string };
}) => {
  const links = SidebarLinks(user.id, user.role);

  return (
    <div className="sidebar-container">
      <nav className="flex-1 space-y-12">
        <Link href="/" className="flex gap-1 items-center cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={32}
            alt="Logo"
            className="h-12 w-fit"
          />
          <h1 className="font-bold text-2xl">PixelCare</h1>
        </Link>

        <div className="flex flex-col space-y-10 w-full">
          {links.map((link, idx) => {
            const { route, label, icon, visibility } = link;
            return (
              <Link
                key={idx}
                href={route}
                className={
                  visibility.includes(user.role)
                    ? "flex items-center gap-2 w-full"
                    : "hidden"
                }
              >
                {icon}
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      <LogoutFooter user={user} />
    </div>
  );
};

export default Sidebar;
