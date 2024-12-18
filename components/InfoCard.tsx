import {
  Calendar,
  Droplet,
  Edit2,
  Mail,
  Phone,
  Stethoscope,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

type InfoCardProps = {
  page: "doctor" | "nurse" | "intern" | "patient";
  data: any;
};

const InfoCard = ({ data, page }: InfoCardProps) => {
  return (
    <div className="flex flex-1 gap-6 rounded-2xl bg-pending bg-no-repeat bg-cover py-6 px-4 shadow-lg w-full h-fit">
      <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-tl from-purple-700 to-pink-700">
        <Image
          src={data.identificationDocumentUrl || "/assets/icons/noAvatar.png"}
          alt=""
          width={100}
          height={100}
          className="w-full h-full rounded-full object-cover"
        />
      </div>

      <div className="w-[62%] flex flex-col gap-4">
        <div className="flex-between">
          <h1 className="text-lg md:text-xl font-semibold">
            {data?.firstName} {data?.lastName}
          </h1>

          <Button variant={"outline"} asChild>
            <Link href={`/list/${page}s/edit-${page}?${page}Id=${data.$id}`}>
              <Edit2 /> Edit
            </Link>
          </Button>
        </div>

        <div className="flex items-center flex-wrap gap-x-8 gap-y-4 font-light max-w-md">
          <div className="text-sm flex items-center gap-3 text-gray-300 sm:w-40 lg:w-44 ">
            <Phone />
            <span>{data?.phone}</span>
          </div>

          <div className="text-sm flex items-center gap-3 text-gray-300 sm:w-40 lg:w-44">
            <Mail />
            <span>{data?.email}</span>
          </div>

          <div className="text-sm flex items-center gap-3 text-gray-300 sm:w-40 lg:w-44">
            <Calendar />
            <span>{new Date(data?.birthDate).toLocaleDateString()}</span>
          </div>

          <div className="text-sm flex items-center gap-3 text-gray-300 sm:w-40 lg:w-44">
            <Droplet />
            <span>{data?.bloodType}</span>
          </div>

          {page === "patient" && (
            <>
              <div className="text-sm flex items-center gap-3 text-gray-300 sm:w-40 lg:w-44">
                <Stethoscope />
                <span>
                  {data?.primaryPhysician?.firstName}{" "}
                  {data?.primaryPhysician?.lastName}
                </span>
              </div>

              <div className="text-sm flex items-center gap-3 text-gray-300 sm:w-40 lg:w-44">
                <User className="text-red-500" />
                <span>{data?.emergencyContactName}</span>
              </div>

              <div className="text-sm flex items-center gap-3 text-gray-300 sm:w-40 lg:w-44">
                <Phone className="text-red-500" />
                <span>{data?.emergencyContactNumber}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
