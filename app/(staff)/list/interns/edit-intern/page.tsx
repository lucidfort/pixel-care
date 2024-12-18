import StaffForm from "@/components/forms/StaffForm";
import HeaderBox from "@/components/HeaderBox";
import { getStaff } from "@/lib/actions/staff.actions";
import { SearchParamProps } from "@/types";

async function EditInternPage({ searchParams }: SearchParamProps) {
  const searchParam = await searchParams;
  const internId = searchParam.internId;

  const intern = await getStaff({ id: internId as string });

  return (
    <div className="w-full flex flex-col gap-7">
      <HeaderBox
        title="Edit Intern"
        subtitle="Fill the form with the correct information"
      />
      <StaffForm table="intern" type="update" data={intern} />
    </div>
  );
}

export default EditInternPage;
