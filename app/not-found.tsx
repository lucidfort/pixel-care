import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative">
      <Button
        variant={"outline"}
        className=" absolute top-4 left-4 bg-green-500"
      >
        <Link href="/" className="flex-center gap-2 text-gray-200 text-sm">
          <Home size={16} /> Home
        </Link>
      </Button>
      <Image
        src="/assets/images/pixel-404.png"
        alt=""
        width={1024}
        height={1024}
        className="bg-cover bg-no-repeat h-screen w-full"
      />
    </div>
  );
}
