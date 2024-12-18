import HeaderBox from "@/components/HeaderBox";
import { staffColumns } from "@/components/table/columns/staffColumns";
import { DataTable } from "@/components/table/DataTable";
import { getStaffs } from "@/lib/actions/staff.actions";

const StaffList = async () => {
  const staffs = await getStaffs({});

  return (
    <div className="relative flex flex-col gap-4 py-2">
      <HeaderBox title="Staffs" subtitle="List of all current employees" />

      <div className="relative flex flex-col space-y-20">
        <DataTable
          role="department"
          columns={staffColumns}
          data={staffs.documents}
        />
      </div>
    </div>
  );
};

export default StaffList;
