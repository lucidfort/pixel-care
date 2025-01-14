import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="flex-center flex-col mx-auto min-h-screen gap-12">
      <div className="flex-center flex-col h-[70vh]">
        <Link
          href="/"
          className="flex gap- items-center cursor-pointer xl:hidden"
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
        <h1 className="text-4xl font-bold text-center">Welcome to PixelCare</h1>
        <p className="text-xl text-center mt-4 max-w-sm md:max-w-xl">
          Your one-stop solution for managing your healthcare journey
        </p>
        <div className="flex items-center justify-center mt-12">
          <Link
            href="/sign-in"
            className="mt-4 px-4 py-2 w-32 text-center text-white bg-blue-400 rounded-md hover:bg-blue-500"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="flex-center flex-col w-[30rem] md:w-[45rem] gap-6 mb-4">
        <h2 className="header">How to use the application!!</h2>

        <p className="sub-header">
          If this is your first visit and you would like to get a thorough view
          of application, please follow these steps
        </p>

        <ul className="list-item list-outside list-disc space-y-4 tracking-wide leading-relaxed">
          <li>
            In the login page, you&apos;ll find a link with the text,
            &apos;Admin&apos;. Click on it
          </li>
          <li>
            You can type in my email address{" "}
            <i>
              <em>onyesoepiphanus@gmail.com</em>
            </i>{" "}
            and quickly write an email to me requesting for the code. I&apos;ll
            send that to you in a jiffy
          </li>
          <li>
            Or you can use the global password, 123456, if you&apos;re too busy
          </li>
          <li>
            Create a doctor or a patient account. Log out and use the details
            you provided to log in using the normal sign in page
          </li>

          <li>
            Have fun navigating through the platform and if you get stuck,
            don&apos;t hesitate to reach out. <br />
            <span className="flex gap-2">
              Thank you for being here{" "}
              <Heart className="text-red-700 fill-red-700" />
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
