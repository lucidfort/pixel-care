import StaffForm from "@/components/forms/StaffForm";
import HeaderBox from "@/components/HeaderBox";
import { getStaff } from "@/lib/actions/staff.actions";
import { SearchParamProps } from "@/types";

async function EditDoctorPage({ searchParams }: SearchParamProps) {
  const searchParam = await searchParams;
  const doctorId = searchParam.doctorId;

  const doctor = await getStaff({ id: doctorId as string });

  return (
    <div className="w-full flex flex-col gap-7">
      <HeaderBox
        title="Edit Doctor"
        subtitle="Fill the form with the correct information"
      />
      <StaffForm table="doctor" type="update" data={doctor} />
    </div>
  );
}

export default EditDoctorPage;
