import InfoCard from "@/components/InfoCard";
import { getStaff } from "@/lib/actions/staff.actions";
import { SearchParamProps } from "@/types";

const SingleDoctorPage = async ({ params }: SearchParamProps) => {
  const p = await params;
  const doctor = await getStaff({ id: p.doctorId });

  return (
    <div className="flex items-center gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        <InfoCard data={doctor} page="doctor" />
      </div>

      {/* RIGHT */}
      <div className="xl:w-1/3">r</div>
    </div>
  );
};

export default SingleDoctorPage;
