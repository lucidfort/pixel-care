import { cn } from "@/lib/utils";
import { HeaderBoxProps } from "@/types";
import React from "react";

const HeaderBox = ({ title, subtitle, className }: HeaderBoxProps) => {
  return (
    <section className={cn("w-full space-y-2", className)}>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-dark-700 sub-header">{subtitle}</p>
    </section>
  );
};

export default HeaderBox;
