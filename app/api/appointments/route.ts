// File: /app/api/updateRecords/route.js

import { cancelOutdatedAppointments } from "@/lib/actions/appointment.actions";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch and update records in your Appwrite database
    const response = await cancelOutdatedAppointments();

    revalidatePath("/list/appointments");

    return NextResponse.json({ status: "success", response });
  } catch (error) {
    console.error("Error updating records:", error);
    return NextResponse.json({ status: "error", error });
  }
}
