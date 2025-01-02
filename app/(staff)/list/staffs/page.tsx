import HeaderBox from "@/components/HeaderBox";
import StatCard from "@/components/StatCard";
import { staffColumns } from "@/components/table/columns/staffColumns";
import { DataTable } from "@/components/table/DataTable";
import { getStaffs } from "@/lib/actions/staff.actions";
import { Staff } from "@/types/appwrite.types";
import Link from "next/link";

const StaffList = async () => {
  const staffs = await getStaffs({});

  const staffRole = staffs.documents.map(
    (staff: Staff) => staff?.role as string
  );

  const doctors = staffRole.filter((role: string) => role === "doctor").length;
  const nurses = staffRole.filter((role: string) => role === "nurse").length;
  const interns = staffRole.filter((role: string) => role === "intern").length;

  return (
    <div className="relative flex flex-col gap-4 py-2">
      <HeaderBox title="Staffs" subtitle="List of all current employees" />

      <section className="admin-stat">
        <Link href="/list/doctors" className="w-full">
          <StatCard
            type="appointments"
            count={doctors}
            label="Doctors"
            icon="/assets/icons/doctor.png"
          />
        </Link>
        <Link href="/list/nurses" className="w-full">
          <StatCard
            type="pending"
            count={nurses}
            label="Nurses"
            icon="/assets/icons/nurse.png"
          />
        </Link>
        <Link href="/list/interns" className="w-full">
          <StatCard
            type="cancelled"
            count={interns}
            label="Interns"
            icon="/assets/icons/internship.png"
          />
        </Link>
      </section>
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
