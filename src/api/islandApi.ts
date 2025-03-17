import { useAxios } from "@/api/index";
import axios from "axios";

export interface Island {
  imageUrl: string; //"/images/name.png"
  islandName: string; //name唯一,跳转地址也是name
  imageWidth: number;
  imageHeight: number;
  x: number;
  y: number;
}
export interface Point {
  id: string;
  x: number;
  y: number;
}
export interface IslandType {
  islandPosition: Point[];
  islandMsg: Record<string, Island>;
}
export interface Response {
  /**
   * 岛屿个数
   */
  count: number;
  list: List[];
}

export interface List {
  id: string;
  name: string;
  path: string;
  userid: number;
  height: number;
  width: number;
  xPoint: number;
  yPoint: number;
}
export async function getIslandMessages() {
  let res = await useAxios.get("/api/island"); // 指定响应类型为 Response
  console.log(res);
  const islands: IslandType = {
    islandPosition: [],
    islandMsg: {},
  };
  // 遍历 list 数据

  res.data.list.forEach((item) => {
    // 1. 转换每个 list 项为 Island 并存入 islandMsg

    const islandKey = item.id; // 假设 name 是唯一键
    islands.islandMsg[islandKey] = {
      imageUrl: item.path, // 对应 list.path -> Island.imageUrl
      islandName: item.name, // 对应 list.name -> Island.islandName
      imageWidth: item.width, // 字符串转数字
      imageHeight: item.height,
      x: item.xPoint, // 对应 list.xPoint -> Island.x
      y: item.yPoint, // 对应 list.yPoint -> Island.y
    };

    // 2. 收集坐标到 islandPosition
    islands.islandPosition.push({
      id: item.id, // 确保 id 是字符串
      x: item.xPoint,
      y: item.yPoint,
    });
  });
  console.log(islands);
  return islands;
}

export async function createIsland(newIsland: Island) {
  return await axios.post("/api/island", newIsland);
}
