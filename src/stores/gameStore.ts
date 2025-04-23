// stores/game.ts
import { defineStore } from "pinia";
import Phaser from "phaser";
import { message } from "ant-design-vue";
import { ref } from "vue";
export const useGameStore = defineStore("game", {
  state: () => ({
    currentScene: null as Phaser.Game | null,
    game: null,
    flag: null,
    currentVoyage: "xxxxx",
  }),
  actions: {
    registerGameInstance(game: Phaser.Game) {
      this.game = game;
      console.log(game);
      // 方法2：获取当前真正活动的场景
      const activeScenes = game.scene
        .getScenes(true)
        .filter((s) => s.sys.isActive());
      if (activeScenes.length > 0) {
        this.currentScene = activeScenes[0]; // 取第一个活动的场景
        return;
      } else {
        console.log("No active scene found");
      }
    },
    startIslandNavigation(islandId: string) {
      console.log(islandId);
      // if (!this.currentScene) {
      //   console.error("Game scene not initialized");
      //   return;
      // }

      try {
        this.game.startNavigation(islandId);
      } catch (error) {
        console.error("Navigation failed:", error);
        message.error("xxxx导航启动失败xxxx");
      }
    },
    startVoyage(islandId: string) {
      this.flag = true;
      this.currentVoyage = islandId;
    },
  },
});
