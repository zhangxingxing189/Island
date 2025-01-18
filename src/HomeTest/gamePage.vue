<template>
  <div ref="gameContainer" id="gamePage"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Phaser from "phaser";

const gameContainer = ref(null);

onMounted(() => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1526,
    height: 806,
    parent: gameContainer.value,
    scene: {
      preload: function () {
        this.load.setBaseURL("https://labs.phaser.io");

        this.load.image("sky", "assets/skies/space3.png");
        this.load.image("logo", "assets/sprites/phaser3-logo.png");
        this.load.image("red", "assets/particles/red.png");
        this.load.image(
          "test",
          "D:\\deep_learning\\Items\\Web\\template\\src\\assets\\16x9_木头码头_蓝色的大海_几只海鸥_站在码头面向大海_像素画风 (3).png"
        );
      },
      create: function () {
        // this.add.image(400, 300, "sky");
        //
        // const particles = this.add.particles(0, 0, "red", {
        //   speed: 100,
        //   scale: { start: 1, end: 0 },
        //   blendMode: "ADD",
        // });
        //
        // const logo = this.physics.add.image(400, 100, "logo");
        //
        // logo.setVelocity(100, 200);
        // logo.setBounce(1, 1);
        // logo.setCollideWorldBounds(true);
        //
        // particles.startFollow(logo);
        this.add.image(400, 300, "test");
      },
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          x: 0,
          y: 200,
        },
      },
    },
  };

  const game = new Phaser.Game(config);
});
</script>

<style scoped>
/* 可以添加一些样式来调整游戏容器的外观 */
#gameContainer {
  width: 100vw;
  height: 100vh;
  margin: auto;
}
</style>
