import { ID, Models } from "node-appwrite";
import {
  databases,
  DATABASE_ID,
  USERS_COLLECTION_ID,
  STAFF_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  PATIENT_COLLECTION_ID,
  REPORT_COLLECTION_ID,
} from "./appwrite.config";

type CollectionMethods = {
  list: (queries: string[]) => Promise<Models.DocumentList<Models.Document>>;
  create: (payload: any, id?: string) => Promise<Models.Document>;
  update: (id: string, payload: any) => Promise<Models.Document>;
  get: (id: string, queries?: string[]) => Promise<Models.Document>;
  delete: (id: string) => Promise<{}>;
};

const collections = [
  {
    databaseId: DATABASE_ID!,
    collectionId: USERS_COLLECTION_ID!,
    name: "users",
  },
  {
    databaseId: DATABASE_ID!,
    collectionId: STAFF_COLLECTION_ID!,
    name: "staffs",
  },
  {
    databaseId: DATABASE_ID!,
    collectionId: PATIENT_COLLECTION_ID!,
    name: "patients",
  },
  {
    databaseId: DATABASE_ID!,
    collectionId: APPOINTMENT_COLLECTION_ID!,
    name: "appointments",
  },
  {
    databaseId: DATABASE_ID!,
    collectionId: REPORT_COLLECTION_ID!,
    name: "reports",
  },
];

const db: { [key: string]: CollectionMethods } = {};

collections.forEach((col) => {
  const { databaseId, collectionId, name } = col;

  db[name] = {
    create: (payload, id = ID.unique()) =>
      databases.createDocument(databaseId, collectionId, id, payload),

    update: (id, payload) =>
      databases.updateDocument(databaseId, collectionId, id, payload),

    get: (id, queries) =>
      databases.getDocument(databaseId, collectionId, id, queries),

    list: (queries) =>
      databases.listDocuments(databaseId, collectionId, queries),

    delete: (id) => databases.deleteDocument(databaseId, collectionId, id),
  };
});

export { db };
