// stores/parent.ts
import { defineStore } from "pinia";
import {
  getIslandMessages,
  getIslands,
  Island,
  IslandType,
} from "@/api/islandApi";
import { ref } from "vue";

export const useIslandStore = defineStore("parent", {
  state: () => ({
    islandData: null as IslandType | null,
    pureIslandData: null as Island,
    // islandData: ref<IslandType | null>(null),
  }),
  actions: {
    async getIslandsMsg() {
      const res = await getIslandMessages();
      console.log(res);
      this.islandData = res;
      console.log(this.islandData);
      await getIslands();
    },
  },
});
