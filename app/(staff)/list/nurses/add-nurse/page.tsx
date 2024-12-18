import StaffForm from "@/components/forms/StaffForm";
import HeaderBox from "@/components/HeaderBox";
import React from "react";

function AddNursePage() {
  return (
    <div className="w-full flex flex-col gap-7">
      <HeaderBox
        title="Add New Nurse"
        subtitle="Fill the form with the correct information"
      />
      <StaffForm table="nurse" type="create" />
    </div>
  );
}

export default AddNursePage;
