import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";

const Header = ({
  user,
}: {
  user: { id: string; name: string; email: string; role: string };
}) => {
  return (
    <header className="admin-header">
      <Link
        href="/"
        className="flex gap-1 items-center cursor-pointer xl:hidden"
      >
        <Image
          src="/assets/icons/logo-full.svg"
          height={32}
          width={32}
          alt="Logo"
          className="h-12 w-fit"
        />
        <h1 className="font-bold text-2xl">PixelCare</h1>
      </Link>

      <div>
        <MobileNav user={user} />
      </div>
    </header>
  );
};

export default Header;
