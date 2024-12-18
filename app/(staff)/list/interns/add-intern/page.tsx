import StaffForm from "@/components/forms/StaffForm";
import HeaderBox from "@/components/HeaderBox";
import React from "react";

function AddInternPage() {
  return (
    <div className="w-full flex flex-col gap-7">
      <HeaderBox
        title="Add New Intern"
        subtitle="Fill the form with the correct information"
      />
      <StaffForm table="intern" type="create" />
    </div>
  );
}

export default AddInternPage;
