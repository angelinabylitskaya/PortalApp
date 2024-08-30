import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

import { News } from "@/models";

import { getDocument, getDocuments } from "./firebase-service";

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
