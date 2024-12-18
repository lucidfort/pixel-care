"use server";

import { PatientType } from "@/types";
import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import {
  BUCKET_ID,
  ENDPOINT,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config";
import { db } from "../database.config";
import { parseStringify } from "../utils";

export const createPatient = async ({
  identificationDocument,
  ...userData
}: PatientType) => {
  try {
    const data = {
      ...userData,
      treatmentConsent: true,
      disclosureConsent: true,
      privacyConsent: true,
    };

    if (identificationDocument && identificationDocument.length > 0) {
      const fileId = await uploadFile(identificationDocument[0]);

      if (!fileId) throw Error("Uploading File failed");

      const newPatient = await db.patients.create({
        identificationDocumentId: fileId,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view??project=${PROJECT_ID}`,
        ...data,
      });

      if (!newPatient) {
        await storage.deleteFile(BUCKET_ID!, fileId);

        throw Error("Failed to create patient");
      }

      return parseStringify(newPatient);
    }

    const newPatient = await db.patients.create(data);

    if (!newPatient) throw Error("Failed to create patient");

    revalidatePath("/list/patients");

    return parseStringify(newPatient);
  } catch (error) {
    console.error("Error creating patient", error);
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

export const getPatient = async (patientId: string) => {
  try {
    const patient = await db.patients.get(patientId);

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
  dataToUpdate: { identificationDocument, ...dataToUpdate },
  patientId,
}: {
  dataToUpdate: PatientType;
  patientId: string;
}) => {
  try {
    const updatedPatient = await db.patients.update(patientId, dataToUpdate);

    if (updatedPatient) {
      revalidatePath("/list/patients");
      revalidatePath(`/list/patients/${patientId}`);
    }

    return parseStringify(updatedPatient);
  } catch (error) {
    console.error("Error updating patient details", error);
  }
};

export const deletePatient = async (patientId: string) => {
  try {
    const patient = await db.patients.get(patientId, [
      Query.select(["identificationDocumentId", "userId"]),
    ]);

    if (patient.identificationDocumentId !== null || patient.userId !== null) {
      await storage.deleteFile(BUCKET_ID!, patient.identificationDocumentId);

      await users.delete(patient.userId);
    }

    const deletedPatient = await db.patients.delete(patientId);

    if (!deletedPatient) throw Error;

    revalidatePath("/list/patients");
    revalidatePath(`/list/patients/${patientId}`);

    return { success: true };
  } catch (error) {
    console.error("An error occurred while deleting patient", error);

    return { success: false };
  }
};
