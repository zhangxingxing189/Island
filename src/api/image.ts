import { useAxios } from "@/api/index";

export function post_image(formData: FormData) {
  return useAxios.post("/api/common/images", formData);
}
