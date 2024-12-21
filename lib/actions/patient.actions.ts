"use server";

import { PatientType } from "@/types";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import { BUCKET_ID, storage, users } from "../appwrite.config";
import { db } from "../database.config";
import { parseStringify } from "../utils";
import { createUser } from "./user.actions";

export const createPatient = async ({
  password,
  email,
  firstName,
  lastName,
  birthDate,
  gender,
  phone,
  address,
  bloodType,
  identificationDocument,
  label,
  ...userData
}: PatientType & { password: string }) => {
  try {
    const newUser = await createUser({
      password,
      email,
      firstName,
      lastName,
      label,
      birthDate,
      gender,
      phone,
      address,
      bloodType,
      identificationDocument,
    });

    await users.updateLabels(newUser.accountId, [label]);

    const data = {
      ...userData,
      user: newUser.userId,
      accountId: newUser.accountId,
      treatmentConsent: true,
      disclosureConsent: true,
      privacyConsent: true,
    };

    const newPatient = await db.patients.create(data);

    if (!newPatient || newPatient === undefined) {
      await db.users.delete(newUser.userId);
      await users.delete(newUser.accountId);
      await storage.deleteFile(BUCKET_ID!, newUser.fileId);

      return { success: false, message: "Failed to create patient" };
    }

    revalidatePath("/list/patients");

    return { success: true };
  } catch (error) {
    console.error("Error creating patient", error);

    return { success: false, message: "An error occurred. Please try again" };
  }
};

export const uploadFile = async (file: File) => {
  try {
    const uploadedFile = await storage.createFile(
      BUCKET_ID!,
      ID.unique(),
      file
    );

    return parseStringify(uploadedFile.$id);
  } catch (error) {
    console.log(error);
  }
};

export const getPatient = async (patientId: string, query?: string[]) => {
  try {
    const patient = await db.patients.get(patientId, query);

    return parseStringify(patient);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};

export const getAllPatients = async (query?: string[]) => {
  try {
    const patients = query
      ? await db.patients.list(query)
      : await db.patients.list([Query.orderDesc("$createdAt")]);

    if (!patients) return [];

    const data = {
      totalCount: patients.total,
      documents: patients.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

export const updatePatient = async ({
  dataToUpdate: {
    identificationDocument,
    firstName,
    lastName,
    email,
    phone,
    birthDate,
    gender,
    label,
    address,
    bloodType,
    ...dataToUpdate
  },
  patientId,
  userId,
}: {
  dataToUpdate: Partial<PatientType>;
  patientId: string;
  userId: string;
}) => {
  try {
    const updatedUser = await db.users.update(userId, {
      firstName,
      lastName,
      email,
      phone,
      birthDate,
      gender,
      label,
      address,
      bloodType,
    });

    const updatedPatient = await db.patients.update(patientId, {
      ...dataToUpdate,
    });

    if (updatedPatient || updatedUser) {
      revalidatePath(`/list/patients`);
      revalidatePath(`/list/patients/${patientId}`);

      return { success: true };
    } else {
      return { success: false, message: "Error updating patient" };
    }
  } catch (error) {
    console.error("Error updating patient details", error);

    return { success: false, message: "An error occurred. Please try again" };
  }
};

export const deletePatient = async (patientId: string) => {
  try {
    const userToDelete = await getPatient(patientId, [
      Query.select(["user.identificationDocumentId", "accountId", "$id"]),
    ]);

    if (!userToDelete) throw Error("User not found");

    if (userToDelete?.user?.identificationDocumentId) {
      await storage.deleteFile(
        BUCKET_ID!,
        userToDelete.user.identificationDocumentId
      );
    }

    await users.delete(userToDelete.accountId);

    const deletedPatient = await db.patients.delete(userToDelete.$id);

    if (!deletedPatient) throw Error("Patient wasn't deleted");

    revalidatePath("/list/patients");
    revalidatePath(`/list/patients/${patientId}`);

    return { success: true };
  } catch (error) {
    console.error("An error occurred while deleting patient", error);

    return { success: false, message: "An error occurred. Please try again" };
  }
};
