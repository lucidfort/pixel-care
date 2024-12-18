import Image from "next/image";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="flex-center mx-auto h-screen">
      <div className="flex-center flex-col">
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
    </div>
  );
};

export default Home;
