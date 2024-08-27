export interface News {
  id: string;
  title: string;
  description: string;
  images: string[];
  dateCreated: number;
  creatorName: string;
  likes: number;
  isLiked: boolean;
}
