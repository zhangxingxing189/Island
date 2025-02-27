import axios from "axios";

export async function getAnalysis(data: { content: string }) {
  let res = await axios.post("/api/ai/analysis", data);
  console.log(res.data.data.abstract);
  return res.data.data.abstract;
}
