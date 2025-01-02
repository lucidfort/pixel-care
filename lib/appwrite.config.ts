import * as sdk from "node-appwrite";
import { cookies } from "next/headers";
export const {
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  USERS_COLLECTION_ID,
  PATIENT_COLLECTION_ID,
  STAFF_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  REPORT_COLLECTION_ID,
  BUCKET_ID,
  NEXT_PUBLIC_ADMIN_PASSKEY: ADMIN_PASSKEY,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  TWILIO_ACCOUNT_SSID,
  TWILIO_AUTH_TOKEN,
} = process.env;

const client = new sdk.Client();

client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);

export const account = new sdk.Account(client);
export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);

export async function createSessionClient() {
  const client = new sdk.Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
    .setProject(process.env.PROJECT_ID!);

  const getCookie = await cookies();

  const session = getCookie.get("appwrite-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new sdk.Account(client);
    },
  };
}
