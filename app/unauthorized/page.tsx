"use client";

import { Button } from "@/components/ui/button";
import { ArrowBigLeftDashIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const UnauthorizedPage = () => {
  const router = useRouter();
  return (
    <div className="relative">
      <div className="absolute inset-4 max-w-sm h-36">
        <Button
          className="flex text-gray-200 text-lg bg-green-500 border-2 border-double border-x-red-500 border-y-yellow-500 w-32"
          onClick={() => router.back()}
        >
          <ArrowBigLeftDashIcon /> Return
        </Button>
      </div>
      <Image
        src="/assets/images/no-entry.png"
        alt=""
        width={1024}
        height={1024}
        className="bg-cover bg-no-repeat h-screen w-full"
      />
    </div>
  );
};

export default UnauthorizedPage;
