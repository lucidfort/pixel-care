"use server";

import { StaffProps } from "@/types";
import { Staff } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { Query } from "node-appwrite";
import { users } from "../appwrite.config";
import { db } from "../database.config";
import { parseStringify } from "../utils";
import { createUser } from "./user.actions";

// STAFF ( DOCTORS && NURSES )
export const createStaff = async ({ password, ...userData }: StaffProps) => {
  const { email, firstName, lastName, role } = userData;

  try {
    const newUser = await createUser({
      email,
      password,
      name: `${firstName} ${lastName}`,
    });

    if (newUser) {
      await users.updateLabels(newUser.$id, [role]);
    }

    const newStaff = await db.staffs.create(userData, newUser.$id);

    if (newStaff) {
      role === "doctor"
        ? revalidatePath("/list/doctors")
        : revalidatePath("/list/nurses");
    } else {
      await users.delete(newUser.$id);
    }

    return parseStringify(newStaff);
  } catch (error: any) {
    console.error(`Error creating ${role}`, error);
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

export const getStaff = async ({ id }: { id: string }) => {
  try {
    const staff = await db.staffs.get(id);

    return parseStringify(staff);
  } catch (error) {
    console.error(`Error fetching staff`, error);
  }
};

export const updateStaff = async ({
  data,
  id,
}: {
  data: Partial<Staff>;
  id: string;
}) => {
  try {
    const updatedStaff = await db.staffs.update(id, data);

    if (updatedStaff) {
      if (data.role === "doctor") {
        revalidatePath(`/list/doctors`);
        revalidatePath(`/list/doctors/${id}`);
      } else if (data.role === "nurse") {
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
    const deletedStaff = await db.staffs.delete(id);

    if (deletedStaff) await users.delete(id);

    role === "doctor"
      ? revalidatePath(`/list/doctors`)
      : revalidatePath("/list/nurses");

    return parseStringify(deletedStaff);
  } catch (error) {
    console.error("An error occurred while deleting staff", error);
  }
};
