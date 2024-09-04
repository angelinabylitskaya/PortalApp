import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  getFirestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
  updateDoc,
  setDoc,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";

import { firebaseConfig } from "@/constants/firebase-config";

try {
  initializeApp(firebaseConfig);
} catch (e) {
  console.log(e);
}

const db = getFirestore();

const defaultConverter: FirestoreDataConverter<any, DocumentData> = {
  toFirestore(data: any): DocumentData {
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): any {
    const data = snapshot.data(options)!;
    return { ...data, id: snapshot.id };
  },
};

export const getDocuments = async <T extends DocumentData>(
  path: string,
  converter: FirestoreDataConverter<T> = defaultConverter,
): Promise<T[]> => {
  const collectionRef = collection(db, path).withConverter(converter);
  const documentsQuery = query(collectionRef, orderBy("dateCreated", "desc"));
  const snapshots = await getDocs<T, DocumentData>(documentsQuery);
  return snapshots.docs.map((snap) => ({ ...snap.data(), id: snap.id }) as T);
};

export const getDocument = async <T extends DocumentData>(
  path: string,
  converter: FirestoreDataConverter<T> = defaultConverter,
): Promise<T | undefined> => {
  const snapshot = await getDoc<T, DocumentData>(
    doc(db, path).withConverter(converter),
  );
  return { ...(snapshot.data() as T), id: snapshot.id };
};

export const updateDocument = async <T extends DocumentData>(
  path: string,
  data: Partial<T>,
  converter: FirestoreDataConverter<T> = defaultConverter,
): Promise<void> => {
  await updateDoc<T, DocumentData>(
    doc(db, path).withConverter(converter),
    data,
  );
};

export const createDocument = async (
  path: string,
  data: DocumentData,
): Promise<string> => {
  const ref = await addDoc<DocumentData, DocumentData>(
    collection(db, path),
    data,
  );
  return ref.id;
};

export const setDocument = async (
  path: string,
  data: DocumentData,
): Promise<void> => {
  await setDoc<DocumentData, DocumentData>(doc(db, path), data);
};
