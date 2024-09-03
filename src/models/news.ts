import { dateToLongString } from "@/utils/date";

import { DocumentData, serverTimestamp, Timestamp } from "firebase/firestore";

export enum NewsType {
  All = "all",
  EventCoverage = "events",
  Newcomers = "newcomers",
  CompanyLife = "company_life",
}

export class News {
  id!: string;
  title!: string;
  description!: string;
  images!: string[];
  dateCreated!: Date;
  dateCreatedString!: string;
  creatorName!: string;
  creatorId!: string;
  likes!: string[];
  type!: NewsType;

  constructor(data: DocumentData) {
    this.id = data.id;
    this.title = data.title || "";
    this.description = data.description || "";
    this.images = data.images || [];
    this.dateCreated = (data.dateCreated as Timestamp)?.toDate();
    this.dateCreatedString = dateToLongString(this.dateCreated);
    this.creatorName = data.creatorName;
    this.creatorId = data.creatorId;
    this.likes = data.likes || [];
    this.type = data.type || NewsType.EventCoverage;
  }

  toDocumentData(): DocumentData {
    return {
      title: this.title || "",
      description: this.description || "",
      images: this.images || [],
      dateCreated: serverTimestamp(),
      creatorName: this.creatorName,
      creatorId: this.creatorId,
      likes: this.likes || [],
      type: this.type,
    };
  }
}
