import StaffForm from "@/components/forms/StaffForm";
import HeaderBox from "@/components/HeaderBox";
import { getStaff } from "@/lib/actions/staff.actions";
import { SearchParamProps } from "@/types";

async function EditNursePage({ searchParams }: SearchParamProps) {
  const searchParam = await searchParams;
  const nurseId = searchParam.nurseId;

  const nurse = await getStaff({ id: nurseId as string });

  return (
    <div className="w-full flex flex-col gap-7">
      <HeaderBox
        title="Edit Nurse"
        subtitle="Fill the form with the correct information"
      />
      <StaffForm table="nurse" type="update" data={nurse} />
    </div>
  );
}

export default EditNursePage;
