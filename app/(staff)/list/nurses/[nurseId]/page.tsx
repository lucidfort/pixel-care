import InfoCard from "@/components/InfoCard";
import { getStaff } from "@/lib/actions/staff.actions";
import { SearchParamProps } from "@/types";

const SingleNursePage = async ({ params }: SearchParamProps) => {
  const p = await params;
  const nurse = await getStaff({ id: p.nurseId });

  return (
    <div className="flex items-center gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        <InfoCard data={nurse} page="nurse" />
      </div>

      {/* RIGHT */}
      <div className="xl:w-1/3"></div>
    </div>
  );
};

export default SingleNursePage;
