import { useAxios, baseResponse } from "@/api/index";

// 用户详细信息类型
export interface UserDetail {
    user_id: string;
    username: string;
    avatar: string;
    created_at: string;
    following_count: number;
    followers_count: number;
}

// 关注操作参数
export interface FollowParams {
    focus_id: string;
}

// 关注列表项
export interface FollowItem {
    user_id: string;
    username: string;
    avatar: string;
    latest_article?: {
        title: string;
        article_id: string;
    };
}

// 获取用户详情
export const getUserDetail = (params: {
    user_id: string
}): Promise<baseResponse<UserDetail>> => {
    return useAxios.get("/api/user/detail", { params });
};

// 关注/取消关注用户
export const followUser = (params: FollowParams): Promise<baseResponse<null>> => {
    return useAxios.post("/api/user/focus", params);
};

// 获取关注列表（保持与文章列表一致的风格）
export const getFollowList = (params?: {
    user_id?: string;
    key?: string;
    order?: string;
    page?: number;
    limit?: number;
}): Promise<baseResponse<{
    list: FollowItem[];
    total: number;
}>> => {
    return useAxios.get("/api/user/focus/list", { params });
};