import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

import { News } from "@/models";

import {
  createDocument,
  getDocument,
  getDocuments,
  updateDocument,
} from "./firebase-service";

const newsConverter = {
  toFirestore(news: News): DocumentData {
    return news.toDocumentData();
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): News {
    const data = snapshot.data(options)!;
    return new News(data);
  },
};

export const getAllNews = () => {
  return getDocuments("news", newsConverter);
};

export const getNews = (id: string) => {
  return getDocument(`news/${id}`, newsConverter);
};

export const updateNews = async (id: string, data: Partial<News>) => {
  await updateDocument(`news/${id}`, data, newsConverter);
};

export const createNews = async (data: Partial<News>): Promise<string> => {
  return createDocument("news", data);
};
