"use server";

import { StaffProps } from "@/types";
import { revalidatePath } from "next/cache";
import { Query } from "node-appwrite";
import { BUCKET_ID, storage, users } from "../appwrite.config";
import { db } from "../database.config";
import { parseStringify } from "../utils";
import { createUser } from "./user.actions";

// STAFF ( DOCTORS && NURSES )
export const createStaff = async ({
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
  ...userData
}: StaffProps) => {
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

    const newStaff = await db.staffs.create({
      ...userData,
      role: label,
      user: newUser.userId,
      accountId: newUser.accountId,
    });

    if (!newStaff || newStaff === undefined) {
      await db.users.delete(newUser.userId);
      await users.delete(newUser.accountId);
      await storage.deleteFile(BUCKET_ID!, newUser.fileId);

      throw Error("Failed to create staff");
    }

    label === "doctor"
      ? revalidatePath("/list/doctors")
      : revalidatePath("/list/nurses");

    revalidatePath("/list/staffs");

    return parseStringify(newStaff);
  } catch (error: any) {
    console.error(`Error creating ${label}`, error);
  }
};

export const getStaffs = async ({
  role,
}: {
  role?: "doctor" | "nurse" | "intern";
}) => {
  try {
    if (role) {
      const staffs = await db.staffs.list([
        Query.equal("role", role),
        Query.orderDesc("$updatedAt"),
      ]);

      if (!staffs) return [];

      const data = {
        totalCount: staffs.total,
        documents: staffs.documents,
      };

      return parseStringify(data);
    } else {
      const staffs = await db.staffs.list([Query.orderDesc("$createdAt")]);

      const data = {
        totalCount: staffs.total,
        documents: staffs.documents,
      };

      return parseStringify(data);
    }
  } catch (error) {
    console.log(`Error fetching ${role}s`, error);
  }
};

export const getStaff = async ({
  id,
  query,
}: {
  id: string;
  query?: string[];
}) => {
  try {
    const staff = await db.staffs.get(id, query);

    return parseStringify(staff);
  } catch (error) {
    console.error(`Error fetching staff`, error);
  }
};

export const updateStaff = async ({
  data,
  userId,
  id,
}: {
  data: Partial<StaffProps>;
  userId: string;
  id: string;
}) => {
  try {
    const updatedUser = await db.users.update(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      birthDate: data.birthDate,
      gender: data.gender,
      label: data.label,
      address: data.address,
      bloodType: data.bloodType,
    });

    const updatedStaff = await db.staffs.update(id, {
      department: data.department,
      position: data.position,
    });

    if (updatedStaff || updatedUser) {
      if (data.label === "doctor") {
        revalidatePath(`/list/doctors`);
        revalidatePath(`/list/doctors/${id}`);
      } else if (data.label === "nurse") {
        revalidatePath(`/list/nurses`);
        revalidatePath(`/list/nurses/${id}`);
      } else {
        revalidatePath(`/list/interns`);
        revalidatePath(`/list/interns/${id}`);
      }

      return { success: true };
    } else {
      return { success: false, message: "Error updating staff" };
    }
  } catch (error) {
    console.error("Error updating staff details", error);
    return { success: false, message: "Error updating staff" };
  }
};

export const deleteStaff = async ({
  role,
  id,
}: {
  role: "doctor" | "nurse" | "intern";
  id: string;
}) => {
  try {
    const userToDelete = await db.staffs.get(id);

    if (!userToDelete) throw Error("User does not exist");

    if (userToDelete?.user?.identificationDocumentId) {
      await storage.deleteFile(
        BUCKET_ID!,
        userToDelete.user.identificationDocumentId
      );
    }

    await users.delete(userToDelete.accountId);

    const deletedStaff = await db.staffs.delete(userToDelete.$id);

    if (!deletedStaff) throw Error("Staff wasn't deleted");

    role === "doctor"
      ? revalidatePath(`/list/doctors`)
      : revalidatePath("/list/nurses");

    return parseStringify(deletedStaff);
  } catch (error) {
    console.error("An error occurred while deleting staff", error);
  }
};
