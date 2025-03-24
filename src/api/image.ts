import { useAxios } from "@/api/index";
import { message } from "ant-design-vue";

export async function post_image(formData: FormData) {
  const res = await useAxios.post("/api/common/images", formData);
  message.success("图片上传成功");
  return res;
}
