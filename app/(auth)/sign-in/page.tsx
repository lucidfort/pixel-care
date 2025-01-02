import Image from "next/image";
import Link from "next/link";
import { SearchParamProps } from "@/types";

import AuthForm from "@/components/forms/AuthForm";
import PasskeyModal from "@/components/modals/PasskeyModal";

const SignInPage = async ({ searchParams }: SearchParamProps) => {
  const searchP = await searchParams;

  const isAdmin = searchP.admin === "true";

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
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

          <AuthForm type="sign-in" />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              &copy; 2024 Careplus
            </p>

            <Link href="/sign-in?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        alt="Patient"
        height={1000}
        width={1000}
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default SignInPage;
