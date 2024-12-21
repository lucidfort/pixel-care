"use server";

import { ID, Query } from "node-appwrite";
import {
  account,
  BUCKET_ID,
  createSessionClient,
  ENDPOINT,
  PROJECT_ID,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

import { SigninProps, SignupParams, Users } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { db } from "../database.config";
import { getAllPatients, uploadFile } from "./patient.actions";
import { getStaffs } from "./staff.actions";

export const createUser = async (user: Users & { password: string }) => {
  try {
    let fileId;

    const newUser = await account.create(
      ID.unique(),
      user.email,
      user.password,
      `${user.firstName} ${user.lastName}`
    );

    if (user.identificationDocument && user.identificationDocument.length > 0) {
      fileId = await uploadFile(user.identificationDocument[0]);

      if (!fileId) throw Error("Uploading File failed");
    }

    const addUserToDatabase = await db.users.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate,
      gender: user.gender,
      address: user.address,
      bloodType: user.bloodType,
      label: user.label,
      identificationDocumentId: fileId ? fileId : null,
      identificationDocumentUrl: fileId
        ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view??project=${PROJECT_ID}`
        : null,
    });

    if (!addUserToDatabase) {
      await storage.deleteFile(BUCKET_ID!, fileId);
      await users.delete(newUser.$id);

      throw Error("Failed to create user");
    }

    const data = {
      accountId: newUser.$id,
      userId: addUserToDatabase.$id,
      fileId: fileId,
    };

    return parseStringify(data);
  } catch (error: any) {
    if (error && error?.code === 409) {
      return { message: "User already exists" };
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

export const signIn = async (user: SigninProps) => {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    const cookieStore = await cookies();

    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return parseStringify({ success: true, userId: session.userId });
  } catch (error: any) {
    if (error.code === 401) {
      return {
        success: false,
        error: "Invalid credentials. Please check the email and password.",
      };
    }

    return {
      success: false,
      error: "An error occurred. Pleas try again",
    };
  }
};

export const handleAdminLogin = async ({
  phase,
  email,
  userId,
  secret,
}: {
  phase: "email" | "passkey";
  email?: string;
  userId?: string;
  secret?: string;
}) => {
  try {
    if (phase === "email") {
      const fetchedUser = await users.list([Query.equal("email", email!)]);
      const user = fetchedUser.users[0];

      if (!user) {
        return { success: false, message: "User does not exist" };
      }

      const role =
        Array.isArray(user.labels) && user.labels.length > 0
          ? user.labels[0]
          : null;

      if (role === "admin") {
        const sessionToken = await account.createEmailToken(
          ID.unique(),
          email!,
          true
        );

        const data = {
          phrase: sessionToken.phrase,
          secret: sessionToken.secret,
          userId: sessionToken.userId,
        };

        return { success: true, data: parseStringify(data) };
      } else {
        return {
          success: false,
          message: "You do not have the required role to access this page",
        };
      }
    }

    if (phase === "passkey") {
      const session = await account.createSession(userId!, secret!);

      const setCookie = await cookies();

      setCookie.set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });

      return { success: true, data: parseStringify(session.$createdAt) };
    }
  } catch (error) {
    console.error("An error occurred", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again",
    };
  }
};

export const signUp = async ({ password, ...userData }: SignupParams) => {
  const {
    email,
    firstName,
    lastName,
    phone,
    birthDate,
    gender,
    address,
    bloodType,
  } = userData;

  try {
    const newUser = await createUser({
      email,
      password,
      firstName,
      lastName,
      phone,
      birthDate,
      gender,
      address,
      bloodType,
      label: "patient",
    });

    if (!newUser) throw new Error("Error creating user");

    await users.updateLabels(newUser.userId, ["patient"]);

    const newPatient = await db.patients.create(userData);

    if (newPatient) {
      await signIn({ email, password });
      revalidatePath("/list/patients");
    }
    {
      await users.delete(newUser.$id);
    }

    return parseStringify(newPatient);
  } catch (error: any) {
    console.error("Error signing up", error);
  }
};

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();

    const user = await account.get();

    const role =
      Array.isArray(user?.labels) && user.labels.length > 0
        ? user.labels[0]
        : null;

    let data;

    if (role === "patient") {
      const patient = await db.patients.list([
        Query.equal("accountId", user.$id),
        Query.select(["$id"]),
      ]);

      data = {
        role: role,
        patientId: patient.documents[0].$id,
        ...user,
      };

      return parseStringify(data);
    }

    if (role === "doctor") {
      const doctor = await db.staffs.list([
        Query.equal("accountId", user.$id),
        Query.select(["$id"]),
      ]);

      data = {
        role: role,
        doctorId: doctor.documents[0].$id,
        ...user,
      };

      return parseStringify(data);
    }

    data = {
      role: role,
      ...user,
    };

    return parseStringify(data);
  } catch (error) {
    return null;
  }
};

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    const deleteCookie = await cookies();

    deleteCookie.delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const getUsers = async () => {
  try {
    const allUsers = await db.users.list([Query.orderDesc("$createdAt")]);

    const initialCounts = {
      patientCount: 0,
      staffCount: 0,
    };

    const counts = allUsers.documents.reduce((acc, user) => {
      if (user.label !== "patient") {
        acc.staffCount++;
      } else {
        acc.patientCount++;
      }

      return acc;
    }, initialCounts);

    const data = {
      ...counts,
      documents: allUsers.documents,
      total: allUsers.total,
    };

    return parseStringify(data);
  } catch (error) {
    console.log("Error getting users", error);
  }
};
