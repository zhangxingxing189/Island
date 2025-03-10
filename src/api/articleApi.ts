import { useAxios, baseResponse } from "@/api/index";
import { IslandType } from "./islandApi";

//文章列表项类型
export interface ArticleListItem {
    id: string;
    title: string;
    abstract: string;
    content: string;
    cover?: string;
    created_at: string;
    userid: string;
    username: string;
    avatar: string;
    digg_count: number;
    collect_count: number;
}

// 文章列表响应类型
export interface ArticleListResponse {
    count: number;
    list: ArticleListItem[];
}

// 获取文章列表
export const getArticleList = (params: {
    page: number;
    pageSize: number;
    islandId?: string;
}): Promise<baseResponse<ArticleListResponse>> => {
    return useAxios.get("/api/articles", { params });
};


export interface OwnerArticleListResponse {
    count: number;
    list: ArticleListItem[];
}

// 获取用户文章
export const getOwnerArticleList = (params: {
    page: number;
    pageSize: number;
    ownerId?: string;
}): Promise<baseResponse<OwnerArticleListResponse>> => {
    return useAxios.get("/api/article/owner", { params });
};

//收藏
export interface CollectArticleListResponse {
    count: number;
    list: ArticleListItem[];
}

//获取用户收藏文章
export const getOwnerCollectArticles = (params: {
    page: number;
    pageSize: number;
}): Promise<baseResponse<CollectArticleListResponse>> => {
    return useAxios.get("/api/article/collect/owner", { params });
};