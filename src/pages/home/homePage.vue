<template>
  <!-- 加载状态 -->
  <div v-if="loading" class="loading-container">
    <a-spin tip="数据加载中..." size="large" />
  </div>

  <!-- 错误提示 -->
  <a-alert
    v-else-if="error"
    message="加载失败"
    :description="error"
    type="error"
    show-icon
  />

  <div id="phaser-example">
    <create-island v-if="isCreateIsland"></create-island>
    <manage-islands v-if="isManageIsland"></manage-islands>
  </div>
</template>

<script setup lang="ts">
//  x - >
//y
//|
//v
import Phaser from "phaser";
import { Island, IslandType } from "@/api/islandApi";
import { message, Spin } from "ant-design-vue";
import router from "@/router";
import { onMounted, onUnmounted, ref } from "vue";
import { useIslandStore } from "@/stores/getIslands";
import { useUserStore } from "@/stores/user";
import {
  isManageIsland,
  login,
  map,
  isCreateIsland,
} from "@/pages/home/UIFunction";
import createIsland from "@/pages/home/createIsland.vue";
import ManageIslands from "@/pages/home/manageIslands.vue";
let module;
// 响应式状态
const loading = ref(true);
const error = ref<string | null>(null);

const userStore = useUserStore();
const islandStore = useIslandStore();
const preLoad = async () => {
  try {
    loading.value = true;
    error.value = null;
    if (userStore.isLogin() || (await userStore.loadUser())) {
      console.log("islogining");
    } else {
      await login();
    }
    await islandStore.getIslandsMsg();
    console.log(islandStore.islandData);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "未知错误";
    message.error("数据加载失败");
  } finally {
    loading.value = false;
  }
};

function intoIsland(islandId: string) {
  router.push({
    path: "/island/",
    query: {
      islandId: islandId,
      form: "home",
    },
  });
}
onMounted(async () => {
  console.log("start");
  await preLoad(); //这里start比preload快导致没加载到
  console.log(islandStore.islandData);
  const resImages = {
    tiles: {
      id: "1901154962285531136",
      wedPath:
        "http://118.31.119.216:8080/uploads/ae470b42fe2e49655227fc11303e95e1.png",
    },
  };
  const uiMap = {
    login: {
      id: "1900932951768567808",
      wedPath: userStore.currentUser.avatar
        ? userStore.currentUser.avatar
        : "http://118.31.119.216:8080/uploads/9d021d52cb27c6db74d4fc845cce98ea.png",
      // ,
    },
    map: {
      id: "1900933298763337728",
      wedPath:
        "http://118.31.119.216:8080/uploads/1705121ad471817d0ac2002626f7c0ba.png",
    },
  };
  const point = ref({ x: 0, y: 0 });

  class Scene extends Phaser.Scene {
    tiles = [0, 1];
    mapHeight = 4; // 每个地图块的高度（以瓦片为单位）
    mapWidth = 4; // 每个地图块的宽度（以瓦片为单位）
    tileWidth = 400;
    tileHeight = 400;
    maps = []; // 存储所有生成的地图块
    cameraBounds = { left: 0, right: 0, top: 0, bottom: 0 }; // 当前相机边界
    cursors; // 键盘输入
    loadedMap = {}; // 记录已加载的地图块
    zoomLevel = 1; // 当前缩放级别
    minZoom = 0.3; // 最小缩放级别
    maxZoom = 3; // 最大缩放级别
    // 玩家角色（带物理属性的精灵）
    player: Phaser.Physics.Arcade.Sprite;
    islandGroup: Phaser.Physics.Arcade.StaticGroup;
    moveSpeed = 160;
    NowPoint;
    uiLayer;
    uiPadding = { x: 20, y: 20 };
    // uiList = ["login", "map"]; //uiList
    VectorX = 0;
    VectorY = 0;
    VectorXLast = 0;
    VectorYLast = 0;
    Islands: IslandType = {
      islandPosition: [],
      islandMsg: {},
    };
    IslandsPoint;
    keys;

    preload() {
      // this.load.image("logo", "/images/login.png");

      this.load.image("tiles", resImages["tiles"].wedPath);
      this.load.spritesheet(
        "player",
        "http://118.31.119.216:8080/uploads/df1902b874775ccefa26b4433871f8c0.png",
        {
          frameWidth: 65, // 单帧宽度
          frameHeight: 96, // 单帧高度
        }
      );
      // this.load.image(
      //   "test",
      //   "http://118.31.119.216:8080/uploads/208805d2e7d5e520009f3c38649e94b5.png"
      // );
      // const test = this.add.image(114, 514, "test");
      // test.setDepth(10);
      // this.load.atlas("ui", "/images/uis.png", "/images/uis.json");
      for (const uiMapKey in uiMap) {
        this.load.image(uiMapKey, uiMap[uiMapKey].wedPath);
      }
      // 岛屿初始化
      // console.log(islandStore.islandData);
      if (islandStore.islandData) {
        this.Islands = islandStore.islandData;
        // console.log(this.Islands);
      } else {
        this.Islands = {
          islandPosition: [{ id: "0", x: -0.212, y: -0.232 }],
          islandMsg: {
            "0": {
              id: "0",
              imageUrl: "/images/island1.png",
              x: -0.212,
              y: -0.232,
              islandName: "island1", //name唯一,跳转地址也是name
              imageWidth: 20,
              imageHeight: 20,
            },
          },
        };
      }
      for (let key in this.Islands.islandMsg) {
        console.log(this.Islands.islandMsg[key].islandName);
        this.load.image(
          this.Islands.islandMsg[key].islandName,
          this.Islands.islandMsg[key].imageUrl
        );
      }
      // this.IslandsPoint = this.Islands.islandPosition.map((island) => {
      //   let x, y;
      //   if (island.y < 0) {
      //     y = -Math.ceil(-island.y);
      //   } else {
      //     y = Math.ceil(island.y);
      //   }
      //   if (island.x < 0) {
      //     x = -Math.ceil(-island.x);
      //   } else {
      //     x = Math.ceil(island.x);
      //   }
      //   return { id: island.id, x: x, y: y };
      // });
    }
    handleIslandCollision(
      player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
      islandGroup: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) {
      console.log(islandGroup);
      // 阻止穿透
      // this.physics.world.collide(player, islandGroup);

      // 添加碰撞效果
      (islandGroup as Phaser.Physics.Arcade.Image).setTint(0xff0000);

      // // 碰撞后反弹
      // if (player.body.touching.right) {
      //   player.setVelocityX(-this.moveSpeed);
      // } else if (player.body.touching.left) {
      //   player.setVelocityX(this.moveSpeed);
      // }
      //
      // if (player.body.touching.down) {
      //   player.setVelocityY(-this.moveSpeed);
      // } else if (player.body.touching.up) {
      //   player.setVelocityY(this.moveSpeed);
      // }
      router.push({
        path: "/island/",
        query: {
          islandId: islandGroup.getData("id"),
          form: "home",
        },
      });
      // 播放音效（需要先加载音频）
      // this.sound.play('collision-sound');
    }
    create() {
      // 初始化地图
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          this.generateMap(i, j);
        }
      }
      // 设置相机边界
      this.updateCameraBounds();
      // 启用键盘输入
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keys = this.input.keyboard.addKeys({
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D,
      });
      this.NowPoint = {
        X: this.cameras.main.scrollX,
        Y: this.cameras.main.scrollY,
      };

      this.createUILayer();

      // 创建角色
      this.PlayerAnim();

      // 添加鼠标滚轮缩放功能
      // this.cameraZoom(); //待修复
      // this.add.image(0, 0, "logo");
      this.islandGroup = this.physics.add.staticGroup();
      for (const key in this.Islands.islandMsg) {
        console.log(this.Islands.islandMsg[key].islandName);
        let island = this.Islands.islandMsg[key];
        const islandStatic = this.islandGroup.create(
          island.x,
          island.y,
          island.islandName
        );
        islandStatic.setInteractive();
        islandStatic.setData("id", key);
        islandStatic.setDepth(20);
        islandStatic.on("pointerdown", () => {
          intoIsland(key);
        });
        islandStatic.body?.setSize(island.imageWidth, island.imageHeight, true);
      }
      // 添加碰撞检测器
      this.physics.add.collider(
        this.player,
        this.islandGroup,
        this.handleIslandCollision
      );
    }

    update(time, delta) {
      this.PlayerMove();
      // 检查是否需要生成新地图
      this.checkAndGenerateMaps();
      this.NowPoint = {
        X: this.cameras.main.scrollX,
        Y: this.cameras.main.scrollY,
      };
      // console.log(this.NowPoint);
      this.updateCameraBounds();
    }

    generateMap(offsetX, offsetY) {
      if (this.isMapLoaded(offsetX, offsetY)) {
        return;
      }
      const mapData = [];
      for (let y = 0; y < this.mapHeight; y++) {
        const row = [];
        for (let x = 0; x < this.mapWidth; x++) {
          const tileIndex = Phaser.Math.RND.weightedPick(this.tiles);
          row.push(tileIndex);
        }
        mapData.push(row);
      }
      const map = this.make.tilemap({
        data: mapData,
        tileWidth: this.tileWidth,
        tileHeight: this.tileHeight,
      });
      const tileset = map.addTilesetImage("tiles");
      const layer = map.createLayer(
        0,
        tileset,
        offsetX * this.mapWidth * this.tileWidth,
        offsetY * this.mapHeight * this.tileHeight
      );
      layer.setVisible(true);
      this.maps.push({ map, layer, offsetX, offsetY });
      this.markMapAsLoaded(offsetX, offsetY);
    }

    updateCameraBounds() {
      const globalMinX =
        Math.min(...this.maps.map((m) => m.offsetX)) *
        this.mapWidth *
        this.tileWidth;
      const globalMaxX =
        Math.max(...this.maps.map((m) => m.offsetX + 1)) *
        this.mapWidth *
        this.tileWidth;
      const minY =
        Math.min(...this.maps.map((m) => m.offsetY)) *
        this.mapHeight *
        this.tileHeight;
      const maxY =
        Math.max(...this.maps.map((m) => m.offsetY + 1)) *
        this.mapHeight *
        this.tileHeight;
      this.cameraBounds = {
        left: globalMinX,
        right: globalMaxX,
        top: minY,
        bottom: maxY,
      };
      // console.log(this.cameraBounds.left, this.cameraBounds.top);
      this.cameras.main.setBounds(
        this.cameraBounds.left,
        this.cameraBounds.top,
        this.cameraBounds.right - this.cameraBounds.left,
        this.cameraBounds.bottom - this.cameraBounds.top
      );
    }

    checkAndGenerateMaps() {
      const cam = this.cameras.main;
      const buffer = 0;
      let offsetX;
      let offsetY;
      const y = cam.scrollY / (this.mapHeight * this.tileHeight);
      const x = cam.scrollX / (this.mapWidth * this.tileWidth);
      point.value.x = x;
      point.value.y = y;
      // console.log(point.value);
      if (y < 0) {
        offsetY = Math.ceil(-y);
        offsetY = -offsetY - buffer;
      } else {
        offsetY = Math.ceil(y) + buffer;
      }
      if (x < 0) {
        offsetX = Math.ceil(-x);
        offsetX = -offsetX - buffer;
      } else {
        offsetX = Math.ceil(x) + buffer;
      }

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const xCoord = offsetX + dx;
          const yCoord = offsetY + dy;
          if (!this.isMapLoaded(xCoord, yCoord)) {
            this.generateMap(xCoord, yCoord);
          }
        }
      }
      this.updateCameraBounds();
    }

    isMapLoaded(offsetX, offsetY) {
      return this.loadedMap[`${offsetX},${offsetY}`] === true;
    }

    markMapAsLoaded(offsetX, offsetY) {
      this.loadedMap[`${offsetX},${offsetY}`] = true;
    }

    PlayerMove() {
      //更新玩家位置,60是帧数
      const moveAmount = this.moveSpeed / 60;
      this.player.setVelocity(this.VectorXLast, this.VectorYLast);
      this.VectorX = 0;
      this.VectorY = 0;
      if (this.cursors.left.isDown) {
        this.uiLayer.x -= moveAmount;
        this.VectorX -= this.moveSpeed;
        this.cameras.main.scrollX -= moveAmount;
      }
      if (this.cursors.right.isDown) {
        this.uiLayer.x += moveAmount;
        this.VectorX += this.moveSpeed;
        this.cameras.main.scrollX += moveAmount;
      }
      if (this.cursors.up.isDown) {
        this.uiLayer.y -= moveAmount;
        this.VectorY -= this.moveSpeed;
        this.cameras.main.scrollY -= moveAmount;
      }
      if (this.cursors.down.isDown) {
        this.uiLayer.y += moveAmount;
        this.VectorY += this.moveSpeed;
        this.cameras.main.scrollY += moveAmount;
      }
      this.VectorXLast = this.VectorX;
      this.VectorYLast = this.VectorY;
      this.player.setVelocity(this.VectorX, this.VectorY);
    }

    PlayerAnim() {
      this.player = this.physics.add.sprite(
        window.innerWidth / 2,
        window.innerHeight / 2,
        "player"
      );

      this.player.setDepth(10);
      this.player.setCollideWorldBounds(true);
      this.player.body?.setSize(32, 48).setOffset(16, 16);
      // 设置角色动画
      this.anims.create({
        key: "stop",
        frames: this.anims.generateFrameNumbers("player", {
          frames: [0, 11, 22],
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "down",
        frames: this.anims.generateFrameNumbers("player", {
          frames: [3, 14, 25],
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "up",
        frames: this.anims.generateFrameNumbers("player", {
          frames: [10, 20, 30],
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("player", {
          frames: [9, 19, 29],
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "left-up",
        frames: this.anims.generateFrameNumbers("player", {
          frames: [7, 17, 27],
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "left-down",
        frames: this.anims.generateFrameNumbers("player", {
          frames: [2, 12, 22],
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "all",
        frames: this.anims.generateFrameNumbers("player", {
          start: 0,
          end: 17,
        }),
        frameRate: 1,
      });
    }

    async createUILayer() {
      let uiX = this.NowPoint.X + window.innerWidth;
      let uiY = this.NowPoint.Y;
      let uiborder = 10;
      //面板
      this.uiLayer = this.add.container();
      this.uiLayer.setDepth(10);
      try {
        module = await import("@/pages/home/UIFunction");
      } catch (error) {
        console.error("Failed to load component:", error);
      }
      for (const uiMapKey in uiMap) {
        let uiImage = this.add.image(
          uiX - this.uiPadding.x,
          uiY + this.uiPadding.y,
          uiMapKey
        );
        // 启用交互功能
        uiImage.setInteractive();
        // 获取原始宽高
        const originalWidth = uiImage.width;
        const originalHeight = uiImage.height;

        // 计算目标宽度和高度，保持宽高比
        const targetWidth = 50; // 目标宽度
        const targetHeight = (originalHeight / originalWidth) * targetWidth;

        // 设置显示大小
        uiImage.setDisplaySize(targetWidth, targetHeight);
        uiImage.setOrigin(1, 0);
        this.uiLayer.add(uiImage);
        uiX = uiX - targetWidth - uiborder;
        const component = module[uiMapKey];
        uiImage.on("pointerdown", component);
      }

      // for (let i = 0; i < this.uiList.length; i++) {
      //   let uiImage = this.add.sprite(
      //     uiX - this.uiPadding.x,
      //     uiY + this.uiPadding.y,
      //     "ui",
      //     this.uiList[i] + ".png"
      //   );
      //   // 启用交互功能
      //   uiImage.setInteractive();
      //   // 获取原始宽高
      //   const originalWidth = uiImage.width;
      //   const originalHeight = uiImage.height;
      //
      //   // 计算目标宽度和高度，保持宽高比
      //   const targetWidth = 50; // 目标宽度
      //   const targetHeight = (originalHeight / originalWidth) * targetWidth;
      //
      //   // 设置显示大小
      //   uiImage.setDisplaySize(targetWidth, targetHeight);
      //   uiImage.setOrigin(1, 0);
      //   this.uiLayer.add(uiImage);
      //   uiX = uiX - targetWidth - uiborder;
      //   let component = module[this.uiList[i]];
      //   uiImage.on("pointerdown", component);
      // }
    }

    cameraZoom() {
      this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        if (
          this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL).isDown
        ) {
          const zoomFactor = deltaY > 0 ? 0.1 : -0.1; // 根据滚轮方向调整缩放
          this.zoomLevel += zoomFactor;
          // 限制缩放范围
          this.zoomLevel = Phaser.Math.Clamp(
            this.zoomLevel,
            this.minZoom,
            this.maxZoom
          );

          // 应用缩放
          this.cameras.main.setZoom(this.zoomLevel);
        }
      });
    }
  }

  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "phaser-example",
    scene: Scene,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 }, // 如果需要重力可以设置
        debug: false, // 调试模式
      },
    },
  };

  game = new Phaser.Game(config);
});
let game = null;
onUnmounted(() => {
  if (game) {
    game.destroy(true);
  }
});
// 监听页面可见性变化
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // 页面隐藏时暂停游戏
    game.pause();
  } else {
    // 页面显示时恢复游戏
    game.resume();
  }
});
</script>

<style>
body {
  overflow: hidden;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
</style>
