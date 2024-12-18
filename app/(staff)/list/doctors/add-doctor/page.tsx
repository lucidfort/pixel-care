import StaffForm from "@/components/forms/StaffForm";
import HeaderBox from "@/components/HeaderBox";
import React from "react";

function AddDoctorPage() {
  return (
    <div className="w-full flex flex-col gap-7">
      <HeaderBox
        title="Add New Doctor"
        subtitle="Fill the form with the correct information"
      />
      <StaffForm table="doctor" type="create" />
    </div>
  );
}

export default AddDoctorPage;
