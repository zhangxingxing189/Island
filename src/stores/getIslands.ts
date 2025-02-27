// stores/parent.ts
import { defineStore } from "pinia";
import { getIslandMessages, IslandType } from "@/api/islandApi";

export const useParentStore = defineStore("parent", {
  state: () => ({
    resData: null as IslandType,
  }),
  actions: {
    async fetchData() {
      this.resData = await getIslandMessages();
    },
  },
});
