"use client";

import { getStaffs } from "@/lib/actions/staff.actions";
import { Staff } from "@/types/appwrite.types";
import { Query } from "node-appwrite";
import React, { createContext, useContext, useState, useEffect } from "react";

interface Doctor {
  id: string;
  name: string;
  img: string;
}

interface DoctorsContextType {
  doctors: Doctor[] | null;
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[] | null>>;
}

const DoctorsContext = createContext<DoctorsContextType | undefined>(undefined);

export const useDoctors = () => {
  const context = useContext(DoctorsContext);
  if (!context) {
    throw new Error("useDoctorsContext must be used within a DoctorsProvider");
  }
  return context;
};

export const DoctorsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [doctors, setDoctors] = useState<Doctor[] | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      const fetchedDoctors = await getStaffs({
        role: "doctor",
      });

      const doctorsInfo = fetchedDoctors?.documents.map((doctor: Staff) => ({
        id: doctor.$id,
        name: `${doctor.user.firstName} ${doctor.user.lastName}`,
        img: doctor.user.identificationDocumentUrl,
      }));
      setDoctors(doctorsInfo);
    };

    if (!doctors) fetchDoctors();
  }, []);

  return (
    <DoctorsContext.Provider value={{ doctors, setDoctors }}>
      {children}
    </DoctorsContext.Provider>
  );
};
