import { useAxios, baseResponse } from "@/api/index";
import { IslandType } from "./islandApi";
import {FollowParams} from "@/api/focusApi";

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
    island?:string;
}

interface BaseResponse<T> {
    code: number;
    message: string;
    data: T;
}
// 文章列表响应类型
export interface ArticleListResponse {
    count: number;
    list: ArticleListItem[];
}

// 获取文章列表
export const getArticleList = (params: {
    page?: number;
    pageSize?: number;
    userIds?: string[];
    order?: string;
    content?: string;
    key?: string;
    islandId?: string;
    islandName?: string;
    limit?: number;
}): Promise<baseResponse<ArticleListResponse>> => {
    return useAxios.get("/api/article", { params });
};

// 获取文章详情
export const getArticleDetail = (id: string) => {
    console.log(id);
    return useAxios.get<BaseResponse<ArticleListItem>>("/api/article/detail", {
        params: {
            id: id, // 将id作为查询参数
        },
        headers: {
            Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0OTg1MDA0OTc2MDUwMDMyMTYsIm5hbWUiOiLmnKvmuKvmnKvmvSIsImVtYWlsIjoiIiwicGhvbmUiOiIiLCJpc1Rva2VuU3RhdHVzIjoiVXNlcl9BRE1JTiIsInVzZXJUeXBlIjoiVXNlciIsImV4cCI6MTY4NzE3NzYwMCwiaWF0IjoxNjg3MTc0MDAwfQ.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0OTg1MDA0OTc2MDUwMDMyMTYsIm5hbWUiOiLmnKvmuKvmnKvmvSIsImVtYWlsIjoiIiwicGhvbmUiOiIiLCJpc1Rva2VuU3RhdHVzIjoiVXNlcl9BRE1JTiIsInVzZXJUeXBlIjoiVXNlciIsImV4cCI6MTY4NzE3NzYwMCwiaWF0IjoxNjg3MTc0MDAwfQ.EYnG5rJyq2DdZc2Q6i00rL33P0nZkY86H5uVg9Yq5PQ', // 设置Authorization头
        },
    });
};


export interface OwnerArticleListResponse {
    count: number;
    list: ArticleListItem[];
}

// 获取用户文章
export const getOwnerArticleList = (params: {
    page: number;
    limit?: number;
    order?: string;
    key?: string;
    user_id?: string;
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
    page?: number;
    user_id?: string;
}): Promise<baseResponse<CollectArticleListResponse>> => {
    return useAxios.get("/api/article/collect/owner", { params });
};

export interface CreateArticleParams {
    title: string;
    abstract: string;
    content: string;
    cover?: string;
    island: string;
}

// 创建文章接口
export const createArticle = (params: CreateArticleParams) => {
    console.log(params);
    return useAxios.post("/api/article", params);
};
//文章删除
export const deleteArticle = (ids: string[]) => {
    console.log('删除请求参数:', { ids });
    return useAxios.delete("/api/article", {
        data: { ids },  // 使用data字段传数组
        headers: {
            "Content-Type": "application/json", // 明确指定内容类型
            "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJEV01BVF8xIiwidXNlck5hbWUiOiLmnKvmnZcigm2mm2EnmJOkIiwiZ3JvdXBzIjpbeyJpZCI6IkRXTUFUXzEiLCJyb2xlIjoiYWRtaW4ifV0sImlhdCI6MTY4NzQ4MjYyMywiZXhwIjoxNjg3NTY2NjIzfQ.ErYjw5kIiwiZXhwIjo0MDQxMjc1OTY2LCJpc3MiOiJ0dW5rdW5nIiwiYXVkIjoidHVua3VuZyJ9.MFbMnACeKAZf5bGi02MVk6mpMABQICn165bAapPlo30"

        }
    });
};

export interface CollectArticleParams  {
    article_id?: string;
}
export const collectArticle = (params: CollectArticleParams): Promise<baseResponse<null>> => {
    return useAxios.get("/api/article/collect", {params});
};

export interface DiggArticleParams {
    article_id: string;
}

export const diggArticle = (params: DiggArticleParams): Promise<baseResponse<{
    digg_count: number;
}>> => {
    return useAxios.get("/api/article/digg", {params});
};

export const getOwnerDiggArticles = (params: {
    page?: number;
}): Promise<baseResponse<ArticleListResponse>> => {
    return useAxios.get("/api/article/digg/owner", { params });
};

