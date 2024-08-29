export enum NewsType {
  All = "all",
  EventCoverage = "events",
  Newcomers = "newcomers",
  CompanyLife = "company_life",
}

export interface News {
  id: string;
  title: string;
  description: string;
  images: string[];
  dateCreated: number;
  creatorName: string;
  creatorId: string;
  likes: number;
  isLiked: boolean;
  type: NewsType;
}
