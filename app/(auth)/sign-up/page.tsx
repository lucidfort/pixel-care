import AuthForm from "@/components/forms/AuthForm";
import Image from "next/image";

const SignUp = async () => {
  return (
    <div className="flex min-h-screen">
      <section className="container">
        <div className="sub-container max-w-[860px] flex-1 flex-col gap-6 py-10">
          <div className="flex items-center cursor-pointer xl:hidden">
            <Image
              src="/assets/icons/logo-full.svg"
              height={32}
              width={32}
              alt="Logo"
              className="h-12 w-fit"
            />
            <h1 className="font-bold text-2xl">PixelCare</h1>
          </div>

          <AuthForm type="sign-up" />
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        alt="Patient"
        height={1000}
        width={1000}
        className="side-img sticky top-0 inset-0 right-0 max-w-[390px] min-h-[100vh]"
      />
    </div>
  );
};

export default SignUp;
