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
  creatorName!: string;
  creatorId!: string;
  likes!: number;
  isLiked!: boolean;
  type!: NewsType;

  constructor(data: DocumentData) {
    this.id = data.id;
    this.title = data.title || "";
    this.description = data.description || "";
    this.images = data.images || [];
    this.dateCreated = (data.dateCreated as Timestamp)?.toDate();
    this.creatorName = data.creatorName;
    this.creatorId = data.creatorId;
    this.likes = data.likes || 0;
    this.isLiked = !!data.isLiked;
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
      likes: this.likes || 0,
      isLiked: !!this.isLiked,
      type: this.type,
    };
  }
}
