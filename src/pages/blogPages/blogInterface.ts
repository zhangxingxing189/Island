export type ContentItem = {
  id: number;
  title: string;
  cover: string;
  clickCount: number;
  likes: number;
  author: string;
  authorID: number;
  timestamp: string;
};

export type HotItem = {
  rank: number;
  title: string;
  heat: number;
  url: string;
  contentItemID: number;
};

export type CreateType = "question" | "answer" | "article" | "idea";
