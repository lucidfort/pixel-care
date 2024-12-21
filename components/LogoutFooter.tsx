"use client";

import { logoutAccount } from "@/lib/actions/user.actions";
import { FooterProps } from "@/types";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const LogoutFooter = ({ user, type = "desktop" }: FooterProps) => {
  const router = useRouter();

  const handleLogOut = async () => {
    await logoutAccount();
    router.push("/sign-in");
  };

  return (
    <>
      <footer className="footer">
        <div className="flex gap-3">
          <div
            className={type === "mobile" ? "footer_name-mobile" : "footer_name"}
          >
            <p className="text-xl font-bold text-gray-700">{user?.name?.[0]}</p>
          </div>

          <div className="footer_email">
            <h2 className="text-[12px] truncate font-semibold text-gray-400">
              {user?.name}
            </h2>

            <p className="text-[11px] truncate font-light text-gray-600">
              {user?.email}
            </p>
          </div>
        </div>

        <div
          className={type === "mobile" ? "footer_image-mobile" : "footer_image"}
          onClick={handleLogOut}
        >
          <LogOut />
        </div>
      </footer>
    </>
  );
};

export default LogoutFooter;
