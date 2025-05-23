import { useAxios } from "@/api/index";
import axios from "axios";

export interface Island {
  id: string;
  imageUrl: string; //"/images/name.png"
  islandName: string; //name唯一,跳转地址也是name
  imageWidth: number;
  imageHeight: number;
  x: number;
  y: number;
}
export interface islandType {
  userid: string;
  id: string;
  path: string; //"/images/name.png"
  name: string; //name唯一,跳转地址也是name
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
export interface Params {
  page?: number;
  limit?: number;
  order?: string;
  key?: string;
}
export async function getIslandMessages() {
  let res = await useAxios.get("/api/island", { params: { limit: 99 } }); // 指定响应类型为 Response
  console.log(res.data);
  const islands: IslandType = {
    islandPosition: [],
    islandMsg: {},
  };
  // 遍历 list 数据
  // console.log(res.data.list);
  res.data.list.forEach((item) => {
    // console.log(item);
    // 1. 转换每个 list 项为 Island 并存入 islandMsg
    const islandKey = item.id; // 假设 name 是唯一键
    islands.islandMsg[islandKey] = {
      id: item.id,
      imageUrl: item.path, // 对应 list.path -> Island.imageUrl
      islandName: item.name, // 对应 list.name -> Island.islandName
      imageWidth: item.width, //
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
  console.log(newIsland);

  const res = await useAxios.post(
    "/api/island",
    {
      name: newIsland.islandName,
      path: newIsland.imageUrl,
      width: newIsland.imageWidth,
      height: newIsland.imageHeight,
      xPoint: newIsland.x,
      yPoint: newIsland.y,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(res);
  return res;
}
export async function delIsland(id: string) {
  // console.log(newIsland);
  console.log(id);
  const res = await useAxios.delete("/api/island", {
    params: {
      id: id,
    },
  });
  console.log(res);
  return res;
}
export async function getIslands() {
  const res = await useAxios.get("/api/island", { params: { limit: 99 } });
  console.log(res.data);

  return res.data.list;
}
export async function putIsland(island: List) {
  return await useAxios.put("/api/island", JSON.stringify(island));
}
export async function getIslandDetail(id: string) {
  const res = await useAxios.get("/api/island/detail", { params: { id: id } });
  return res.data;
}
