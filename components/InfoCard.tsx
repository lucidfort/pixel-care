import { cn } from "@/lib/utils";
import { Patient, Staff } from "@/types/appwrite.types";
import { Calendar, Droplet, Edit2, MailIcon, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

type InfoCardProps = {
  page: "doctor" | "nurse" | "intern" | "patient";
  data: Staff | Patient;
};

const InfoCard = ({ data, page }: InfoCardProps) => {
  const infos = infoTable(data);
  const userInfo = userInfos(data);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex-center flex-1 gap-6 rounded-2xl bg-pending bg-no-repeat bg-cover py-6 px-4 shadow-lg w-full">
        <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-tl from-purple-700 to-pink-700">
          <Image
            src={
              data.user.identificationDocumentUrl ||
              "/assets/icons/noAvatar.png"
            }
            alt={data.user.firstName}
            width={100}
            height={100}
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        <div className="w-[62%] flex flex-col gap-4">
          <div className="flex-between">
            <h1 className="text-lg md:text-xl font-semibold">
              {data?.user.firstName} {data?.user.lastName}
            </h1>

            <Button variant={"outline"} asChild>
              <Link href={`/list/${page}s/edit-${page}?${page}Id=${data.$id}`}>
                <Edit2 /> Edit
              </Link>
            </Button>
          </div>

          <div className="flex items-center flex-wrap gap-x-8 gap-y-4 font-light">
            {infos.map((info) => (
              <div
                key={info.label}
                className="text-base md:text-lg flex items-center gap-3 text-gray-300 "
              >
                {info.icon}

                {info.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 items-center rounded-2xl bg-pending bg-no-repeat bg-cover py-6 px-4 shadow-lg w-full">
        <div className="flex flex-wrap gap-x-8 gap-y-4 font-light">
          {userInfo.map((info) => (
            <div
              key={info.label}
              title={info.title}
              className={cn(
                "flex items-center gap-7 text-base md:text-lg text-gray-300 w-[18rem]",
                {
                  hidden: info.showPage && !info.showPage.includes(page),
                }
              )}
            >
              <h3 key={info.label} className="text-gray-400 font-light">
                {info.label}
              </h3>

              <p className="capitalize text-gray-300">{info.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;

const infoTable = (data: Staff | Patient) => [
  {
    icon: <Phone />,
    label: data.user.phone,
  },
  {
    icon: <MailIcon />,
    label: data.user.email,
  },
  {
    icon: <Calendar />,
    label: new Date(data.user.birthDate).toLocaleDateString(),
  },
  {
    icon: <Droplet />,
    label: data.user.bloodType,
  },
];

const userInfos = (data: Staff | Patient) => [
  {
    label: "Gender:",
    value: data.user.gender,
  },
  {
    label: "Address:",
    value: data.user.address,
  },
  {
    label: "EC Name:",
    title: "Emergency Contact Name",
    value: data.emergencyContactName,
    showPage: ["patient"],
  },
  {
    label: "EC No:",
    title: "Emergency Contact Number",
    value: data.emergencyContactNumber,
    showPage: ["patient"],
  },
  {
    label: "Allergies:",
    value: data.allergies ?? "-",
    showPage: ["patient"],
  },
  {
    label: "PMH:",
    title: "Past Medical History",
    value: data.pastMedicalHistory ?? "-",
    showPage: ["patient"],
  },
  {
    label: "CM:",
    title: "Current Medication",
    value: data.currentMedication ?? "-",
    showPage: ["patient"],
  },
  {
    label: "FMH:",
    title: "Family Medical History",
    value: data.familyMedicalHistory ?? "-",
    showPage: ["patient"],
  },
  {
    label: "Department:",
    value: data.department,
    showPage: ["doctor", "nurse", "intern"],
  },
  {
    label: "Position:",
    value: data.position ?? "-",
    showPage: ["doctor", "nurse", "intern"],
  },
];
