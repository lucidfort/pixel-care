import clsx from "clsx";
import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";

interface StatCardProps {
  count: number;
  label: string;
  icon?: string;
  svg?: React.ReactElement;
  type?: "appointments" | "pending" | "cancelled";
}
const StatCard = ({ count = 0, label, icon, type, svg }: StatCardProps) => {
  return (
    <div
      className={clsx("stat-card", {
        "bg-appointments": type === "appointments" || svg,
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
      })}
    >
      <div className="flex items-center gap-4">
        {icon ? (
          <Image
            src={icon}
            height={32}
            width={32}
            alt={label}
            className="size-8 w-fit"
          />
        ) : (
          svg
        )}
        <Suspense
          fallback={<Skeleton className="w-[100px] h-[20px] rounded-full" />}
        >
          <h2 className="text-32-bold text-white">{count}</h2>
        </Suspense>
      </div>

      <p className="text-14-regular">{label}</p>
    </div>
  );
};

export default StatCard;
