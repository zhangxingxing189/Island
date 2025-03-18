// stores/parent.ts
import { defineStore } from "pinia";
import { getIslandMessages, IslandType } from "@/api/islandApi";
import { ref } from "vue";

export const useIslandStore = defineStore("parent", {
  state: () => ({
    islandData: null as IslandType | null,
    // islandData: ref<IslandType | null>(null),
  }),
  actions: {
    async getIslands() {
      const res = await getIslandMessages();
      console.log(res);
      this.islandData = res;
      console.log(this.islandData);
    },
  },
});
