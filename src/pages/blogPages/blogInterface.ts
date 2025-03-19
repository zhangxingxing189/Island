export interface ContentItem{
  id: string;
  title: string;
  abstract: string;
  cover: string;
  likes: number;
  comments: number;
  author: string;
  timestamp: string;
  content: string;
  authorId?: string;
}

export type HotItem = {
  rank: number;
  title: string;
  heat: number;
  url: string;
  contentItemID: string;
};
// 文章列表响应类型
export interface ArticleListResponse {
  list: {
    id: string;
    title: string;
    abstract: string;      // 摘要
    cover?: string;        // 封面图
    digg_count: number;    // 点赞数
    collect_count: number; // 收藏数（用作观看数）
    username: string;      // 作者名
    created_at: string;    // ISO 8601时间格式 示例："2024-05-20T08:30:45Z"
  }[];
  total: number;
}
export type CreateType = "question" | "answer" | "article" | "idea";

export interface IslandItem {
  id: string;
  islandName: string;

}