import { useAxios, baseResponse } from "@/api/index";

export interface ImageUploadResponse {
    url: string;
}

export const uploadImage = (file: File): Promise<baseResponse<ImageUploadResponse>> => {
    const formData = new FormData();
    formData.append("file", file);

    return useAxios.post("/api/common/images", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};