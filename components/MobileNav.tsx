import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { SidebarLinks } from "@/constants";
import LogoutFooter from "./LogoutFooter";

const MobileNav = async ({
  user,
}: {
  user: { id: string; name: string; email: string; role: string };
}) => {
  const links = SidebarLinks(user.id, user.role);

  const renderItems = () => (
    <nav className="flex flex-1 flex-col gap-1 pt-16 text-white">
      {links.map((link, idx) => {
        const { label, route, icon, visibility } = link;

        return (
          <SheetClose asChild key={idx}>
            <Link
              className={
                visibility.includes(user.role)
                  ? "mobilenav-sheet_close w-full cursor-pointer"
                  : "hidden"
              }
              href={route}
            >
              {icon}
              {label}
            </Link>
          </SheetClose>
        );
      })}
    </nav>
  );

  return (
    <section className="w-full max-w-[264px] lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-dark-200 max-h-screen overflow-auto"
        >
          <SheetHeader>
            <SheetTitle>
              <div className="flex gap- items-center cursor-pointer xl:hidden">
                <Image
                  src="/assets/icons/logo-full.svg"
                  height={32}
                  width={32}
                  alt="Logo"
                  className="h-12 w-fit"
                />
                <h1 className="font-bold text-2xl">PixelCare</h1>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="mobilenav-sheet ">
            <SheetClose asChild>{renderItems()}</SheetClose>

            <LogoutFooter user={user} type="mobile" />
          </div>

          {/* <SheetFooter className="z-20">
          </SheetFooter> */}
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
