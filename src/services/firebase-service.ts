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
} from "firebase/firestore";

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
  const snapshots = await getDocs<T, DocumentData>(
    collection(db, path).withConverter(converter),
  );
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
