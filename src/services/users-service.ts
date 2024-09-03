import { UserInfo } from "@/models";

import { getDocument, setDocument } from "./firebase-service";

export const getUser = (id: string) => {
  return getDocument(`users/${id}`);
};

export const createUser = async (
  uid: string,
  data: Partial<UserInfo>,
): Promise<UserInfo> => {
  await setDocument(`users/${uid}`, data);
  return {
    uid,
    ...data,
  } as UserInfo;
};
