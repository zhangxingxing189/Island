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
import { onBeforeMount, onMounted, onUnmounted, ref } from "vue";
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
import { useGameStore } from "@/stores/gameStore";
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

function intoIsland(islandId: string, islandName: string) {
  console.log("click");
  localStorage.setItem(
    "data",
    JSON.stringify({
      user: userStore.currentUser,
      island: {
        id: islandId,
        name: islandName,
      },
    })
  );
  router.push({
    path: "/island/",
    query: {
      islandId: islandId,
      form: "home",
    },
  });
}
onBeforeMount(async () => {
  // console.log("start");
  await preLoad(); //这里start比preload快导致没加载到
  // console.log(islandStore.islandData);
  const resImages = {
    tiles: {
      id: "1903746578976346112",
      wedPath:
        "http://118.31.119.216:8080/uploads/f84d510985fcbfc72942a93ac99452c3.png",
    },
  };
  const uiMap = {
    login: {
      id: "1903746834774364160",
      wedPath: userStore.currentUser.avatar
        ? userStore.currentUser.avatar
        : "http://118.31.119.216:8080/uploads/9d021d52cb27c6db74d4fc845cce98ea.png",
      name: "管理岛屿",
    },
    map: {
      id: "1903751006844358656",
      wedPath:
        "http://118.31.119.216:8080/uploads/1705121ad471817d0ac2002626f7c0ba.png",
      name: "创建岛屿",
    },
  };
  class myScene extends Phaser.Scene {
    static key = "MyScene";
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
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    baseUIScale = 0.2;
    navigationArrow: Phaser.GameObjects.Sprite | null = null;
    navigationText: Phaser.GameObjects.Text | null = null;
    closeButton: Phaser.GameObjects.Image | null = null;
    isNavigating = false;
    targetIsland: { x: number; y: number; name: string };
    // 导航函数
    startNavigation(islandId: string) {
      if (
        (this.navigationArrow && this.navigationArrow.scene !== undefined) ||
        (this.navigationText && this.navigationText.scene !== undefined) ||
        (this.closeButton && this.closeButton.scene !== undefined)
      ) {
        this.clearNavigation();
      }
      // 1. 查找目标岛屿
      const target = this.Islands.islandMsg[islandId];
      if (!target) {
        message.error("未找到该岛屿");
        return;
      }

      // 2. 初始化导航状态
      this.isNavigating = true;
      this.targetIsland = {
        x: target.x,
        y: target.y,
        name: target.islandName,
      };

      if (!this.navigationArrow || this.navigationArrow.scene === undefined) {
        // 3. 创建箭头
        this.navigationArrow = this.add
          .sprite(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            "arrow"
          )
          .setDepth(100)
          .setScale(0.4)
          .setOrigin(0.5, 1); // 原点在底部中心
      } else {
        console.log("已经有箭头");
        // this.clearNavigation();
      }

      // 4. 创建导航文本
      if (!this.navigationText || this.navigationText.scene === undefined) {
        // console.log(this.targetIsland.name);
        this.navigationText = this.add
          .text(
            this.cameras.main.width / 2,
            50,
            `导航至：${this.targetIsland.name}`,
            {
              fontSize: "24px",
              color: "#ffffff",
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: { x: 20, y: 10 },
            }
          )
          .setDepth(100)
          .setScrollFactor(0)
          .setOrigin(0.5, 0);
      } else {
        console.log("已经有文本");
        // this.clearNavigation();
      }

      // 5. 创建关闭按钮
      if (!this.closeButton || this.closeButton.scene === undefined) {
        this.closeButton = this.add
          .image(this.cameras.main.width / 2 + 120, 50, "close")
          .setDepth(100)
          .setScale(0.5)
          .setScrollFactor(0)
          .setInteractive()
          .on("pointerdown", () => this.clearNavigation());
      } else {
        console.log("已经有关闭按钮");
        // this.clearNavigation();
      }

      // 每帧更新箭头位置和方向
      this.events.on("update", this.updateNavigation);
    }

    private updateNavigation = () => {
      if (!this.isNavigating) return;

      // 更新箭头位置（玩家脚下）
      // 在这里，我们不是直接设置箭头到玩家脚下，而是让箭头围绕玩家中心点转动
      const offsetDistance = 50; // 箭头围绕玩家转动的半径
      const playerCenterX = this.player.x;
      const playerCenterY = this.player.y;

      // 计算方向角度
      const angle = Phaser.Math.Angle.Between(
        playerCenterX, // 使用玩家中心点的 x 坐标
        playerCenterY, // 使用玩家中心点的 y 坐标
        this.targetIsland.x,
        this.targetIsland.y
      );

      // 计算箭头围绕玩家中心点的位置
      const arrowX = playerCenterX + offsetDistance * Math.cos(angle);
      const arrowY = playerCenterY + offsetDistance * Math.sin(angle);

      this.navigationArrow.setPosition(arrowX, arrowY);

      // 设置箭头旋转（弧度转角度）
      this.navigationArrow.setRotation(angle + Math.PI / 2);
    };

    private clearNavigation() {
      this.isNavigating = false;
      this.navigationArrow?.destroy();
      this.navigationText?.destroy();
      this.closeButton?.destroy();
      this.events.off("update", this.updateNavigation);
      console.log("箭头引用状态:", this.navigationArrow.scene); // 预期输出 null
      console.log("文本引用状态:", this.navigationText.scene); // 预期输出 null
      console.log("按钮引用状态:", this.closeButton.scene); // 预期输出 null
    }
    preload() {
      this.load.image("tiles", resImages["tiles"].wedPath);
      this.load.spritesheet(
        "player",
        "http://118.31.119.216:8080/uploads/83c62f3f41dc3e6f2bbe4fe0cbdc822e.png",
        // "http://118.31.119.216:8080/uploads/674530a944f56ff563eca43a8d97d41c.png",
        // "http://118.31.119.216:8080/uploads/df1902b874775ccefa26b4433871f8c0.png",
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
        if (!this.Islands.islandMsg[key].imageUrl) {
          continue;
        }

        console.log(this.Islands.islandMsg[key]);
        this.load.image(
          this.Islands.islandMsg[key].islandName,
          this.Islands.islandMsg[key].imageUrl
        );
      }
      // 添加导航相关资源
      this.load.image(
        "arrow",
        "http://118.31.119.216:8080/uploads/12ba34f5daa1630c09c6854d9feb0b11.png"
      );
      this.load.image(
        "close",
        "http://118.31.119.216:8080/uploads/65243f43f5090df0c27c38fd374dd698.png"
      );
    }
    handleIslandCollision(
      player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
      islandGroup: Phaser.Types.Physics.Arcade.GameObjectWithBody
    ) {
      // 添加安全校验
      if (!player || !player.body) {
        console.warn("Player not initialized");
        return;
      }

      // 添加岛屿对象校验
      if (!islandGroup.body) {
        console.warn("Invalid island collision");
        return;
      }

      // 类型断言确保物理属性存在
      const playerBody = player.body as Phaser.Physics.Arcade.Body;
      const islandBody = islandGroup.body as Phaser.Physics.Arcade.StaticBody;

      // 调试输出碰撞信息
      // console.log("Collision between:", {
      //   player: { x: player.x, y: player.y },
      //   island: { x: islandGroup.x, y: islandGroup.y },
      //   touching: playerBody.touching,
      // });

      // 修改碰撞响应逻辑
      if (playerBody.touching.right) {
        playerBody.velocity.x = -this.moveSpeed;
      } else if (playerBody.touching.left) {
        playerBody.velocity.x = this.moveSpeed;
      }

      if (playerBody.touching.down) {
        playerBody.velocity.y = -this.moveSpeed;
      } else if (playerBody.touching.up) {
        playerBody.velocity.y = this.moveSpeed;
      }
      localStorage.setItem(
        "data",
        JSON.stringify({
          user: userStore.currentUser,
          island: {
            id: islandGroup.getData("id"),
            name: islandGroup.getData("name"),
          },
        })
      );
      // 延迟路由跳转避免物理引擎冲突
      console.log("碰撞");
      router.push({
        path: "/island/",
        query: {
          islandId: islandGroup.getData("id"),
          form: "home",
        },
      });
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
      // 启用相机跟随（核心修改）
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      this.cameras.main.setDeadzone(10, 10); // 设置跟随缓冲区域

      // 添加鼠标滚轮缩放功能
      this.cameraZoom(); //待修复

      this.islandGroup = this.physics.add.staticGroup();
      for (const key in this.Islands.islandMsg) {
        // console.log(this.Islands.islandMsg[key].islandName);
        let island = this.Islands.islandMsg[key];
        const islandStatic = this.islandGroup.create(
          island.x,
          island.y,
          island.islandName
        ) as Phaser.Physics.Arcade.Image;
        // 初始化岛屿属性
        islandStatic.setInteractive();
        islandStatic.setData("id", key);
        islandStatic.setData("name", island.islandName);
        islandStatic.setDepth(20);

        const nameText = this.add.text(
          islandStatic.x - 50, // 根据文本长度适当调整
          islandStatic.y - islandStatic.height / 2 - 20, // 固定在岛屿上方
          island.islandName,
          {
            fontSize: "20px",
            color: "#ffffff",
            fontFamily: "Arial",
            stroke: "#000000",
            strokeThickness: 3,
          }
        );
        nameText.setAlpha(1); // 直接显示
        nameText.setDepth(100);
        nameText.setVisible(true);
        islandStatic.setData("nameText", nameText);
        // console.log(key);
        islandStatic.on("pointerdown", () => {
          console.log("click", key);
          this.startNavigation(key);
        });
        islandStatic.body
          .setSize(10, 10, true)
          .setOffset(island.imageHeight / 2, island.imageHeight / 2);

        islandStatic.setImmovable(false);
        this.time.delayedCall(0, () => {
          islandStatic.refreshBody();
        });
      }
      // this.islandGroup.body.setSize(100, 100, true);
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
      // console.log(
      //   `Camera Bounds: ${this.cameras.main.getBounds().toString()}`,
      //   `Player Position: ${this.player.x.toFixed(1)}, ${this.player.y.toFixed(
      //     1
      //   )}`
      // );
      if (gameStore.flag === true) {
        this.startNavigation(gameStore.currentVoyage);
        gameStore.flag = false;
      }
      console.log(gameStore.flag);
    }

    generateMap(offsetX, offsetY) {
      if (this.isMapLoaded(offsetX, offsetY)) {
        return;
      }

      // 生成随机地图数据
      const mapData = [];
      for (let y = 0; y < this.mapHeight; y++) {
        const row = [];
        for (let x = 0; x < this.mapWidth; x++) {
          const tileIndex = Phaser.Math.RND.weightedPick(this.tiles);
          row.push(tileIndex);
        }
        mapData.push(row);
      }

      // 创建地图并计算实际坐标（关键修改点）
      const actualX = offsetX * this.mapWidth * this.tileWidth;
      const actualY = offsetY * this.mapHeight * this.tileHeight;

      const map = this.make.tilemap({
        data: mapData,
        tileWidth: this.tileWidth,
        tileHeight: this.tileHeight,
      });

      const tileset = map.addTilesetImage("tiles");
      const layer = map.createLayer(
        0,
        tileset,
        actualX, // 使用计算后的实际X坐标
        actualY // 使用计算后的实际Y坐标
      );

      layer.setVisible(true);

      // 记录已生成的地图块
      this.maps.push({
        map,
        layer,
        offsetX,
        offsetY,
        actualX, // 新增实际坐标记录
        actualY,
      });

      this.markMapAsLoaded(offsetX, offsetY);
      this.updateCameraBounds(); // 生成后立即更新边界
    }

    updateCameraBounds() {
      if (this.maps.length === 0) return;

      // 计算实际边界
      const bounds = this.maps.reduce(
        (acc, map) => ({
          minX: Math.min(acc.minX, map.actualX),
          maxX: Math.max(acc.maxX, map.actualX + map.layer.width),
          minY: Math.min(acc.minY, map.actualY),
          maxY: Math.max(acc.maxY, map.actualY + map.layer.height),
        }),
        { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
      );

      // 设置30%动态缓冲
      const bufferRatio = 0.3;
      const bufferX = (bounds.maxX - bounds.minX) * bufferRatio;
      const bufferY = (bounds.maxY - bounds.minY) * bufferRatio;

      // 计算最终边界
      const worldBounds = {
        x: bounds.minX - bufferX,
        y: bounds.minY - bufferY,
        width: bounds.maxX - bounds.minX + bufferX * 2,
        height: bounds.maxY - bounds.minY + bufferY * 2,
      };

      // 同时设置物理世界边界和相机边界（关键！）
      this.physics.world.setBounds(
        worldBounds.x,
        worldBounds.y,
        worldBounds.width,
        worldBounds.height
      );

      this.cameras.main.setBounds(
        worldBounds.x,
        worldBounds.y,
        worldBounds.width,
        worldBounds.height
      );

      // 调试输出
      // console.log(
      //   "Updated Camera Bounds:",
      //   `X: ${globalBounds.minX - bufferX} ~ ${globalBounds.maxX + bufferX}`,
      //   `Y: ${globalBounds.minY - bufferY} ~ ${globalBounds.maxY + bufferY}`
      // );
      // console.log(
      //   minChunkX * this.mapWidth * this.tileWidth,
      //   minChunkY * this.mapHeight * this.tileHeight,
      //   (maxChunkX - minChunkX + 1) * this.mapWidth * this.tileWidth,
      //   (maxChunkY - minChunkY + 1) * this.mapHeight * this.tileHeight
      // );
      // console.log(
      //   this.cameraBounds.left,
      //   this.cameraBounds.top,
      //   this.cameraBounds.right - this.cameraBounds.left,
      //   this.cameraBounds.bottom - this.cameraBounds.top
      // );
    }

    checkAndGenerateMaps() {
      // 获取相机可见区域
      const cameraView = this.cameras.main.worldView;

      // 计算需要加载的区块范围
      const startX = Math.floor(
        (cameraView.x - cameraView.width * 0.5) /
          (this.mapWidth * this.tileWidth)
      );
      const endX = Math.ceil(
        (cameraView.x + cameraView.width * 1.5) /
          (this.mapWidth * this.tileWidth)
      );
      const startY = Math.floor(
        (cameraView.y - cameraView.height * 0.5) /
          (this.mapHeight * this.tileHeight)
      );
      const endY = Math.ceil(
        (cameraView.y + cameraView.height * 1.5) /
          (this.mapHeight * this.tileHeight)
      );

      // 生成所有可见和相邻区块
      for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
          if (!this.isMapLoaded(x, y)) {
            this.generateMap(x, y);
          }
        }
      }

      // 延迟更新确保所有地图块加载
      this.time.delayedCall(100, () => this.updateCameraBounds());
    }

    isMapLoaded(offsetX, offsetY) {
      return this.loadedMap[`${offsetX},${offsetY}`] === true;
    }

    markMapAsLoaded(offsetX, offsetY) {
      this.loadedMap[`${offsetX},${offsetY}`] = true;
    }

    PlayerMove() {
      const speed = this.moveSpeed;
      this.player.setVelocity(0);
      let movingDirection = null;

      // 方向检测优先顺序：组合方向 -> 水平方向 -> 垂直方向
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-speed);
        movingDirection = "left";

        if (this.cursors.up.isDown) {
          this.player.setVelocityY(-speed);
          movingDirection = "left-up";
        } else if (this.cursors.down.isDown) {
          this.player.setVelocityY(speed);
          movingDirection = "left-down";
        }
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(speed);
        movingDirection = "right";

        if (this.cursors.up.isDown) {
          this.player.setVelocityY(-speed);
          movingDirection = "right-up";
        } else if (this.cursors.down.isDown) {
          this.player.setVelocityY(speed);
          movingDirection = "right-down";
        }
      } else if (this.cursors.up.isDown) {
        this.player.setVelocityY(-speed);
        movingDirection = "up";
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(speed);
        movingDirection = "down";
      }

      // 动画控制逻辑
      let targetAnim = "stop";
      let needFlip = false;

      switch (movingDirection) {
        case "left":
          targetAnim = "left";
          needFlip = false;
          break;
        case "right":
          targetAnim = "left"; // 使用left动画配合翻转
          needFlip = true;
          break;
        case "up":
          targetAnim = "up";
          break;
        case "down":
          targetAnim = "down";
          break;
        case "left-up":
          targetAnim = "left-up";
          break;
        case "left-down":
          targetAnim = "left-down";
          break;
        case "right-up":
          targetAnim = "left-up"; // 使用left-up配合翻转
          needFlip = true;
          break;
        case "right-down":
          targetAnim = "left-down"; // 使用left-down配合翻转
          needFlip = true;
          break;
      }

      // 设置精灵翻转和播放动画
      this.player.setFlipX(needFlip);

      if (this.player.anims.currentAnim?.key !== targetAnim) {
        // console.log("into");
        if (targetAnim === "stop") {
          this.player.anims.playAfterRepeat("stop"); // 更自然的停止过渡
        } else {
          // console.log("start");
          this.player.anims.play(targetAnim, true);
        }
      }

      // 特殊处理完全停止状态
      if (!movingDirection && this.player.anims.currentAnim?.key !== "stop") {
        this.player.anims.play("stop", true);
      }
      // UI层跟随逻辑需要调整
      // this.uiLayer.setPosition(
      //   this.cameras.main.scrollX + window.innerWidth - 20,
      //   this.cameras.main.scrollY + 20
      // );
    }

    PlayerAnim() {
      this.player = this.physics.add.sprite(
        window.innerWidth / 2,
        window.innerHeight / 2,
        "player"
      );

      this.player.setDepth(101);
      // this.player.setCollideWorldBounds(true);
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
          frames: [10, 21, 32],
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("player", {
          frames: [9, 20, 31],
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "left-up",
        frames: this.anims.generateFrameNumbers("player", {
          frames: [7, 18, 29],
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "left-down",
        frames: this.anims.generateFrameNumbers("player", {
          frames: [1, 12, 23],
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
      // this.player.body!.collideWorldBounds = true;
      // this.player.body.x(900);
      // this.player.body.y(900);
    }

    async createUILayer() {
      // 使用相机中心坐标作为基准点
      const cameraCenterX =
        this.cameras.main.worldView.x + this.cameras.main.width / 2;
      const cameraCenterY =
        this.cameras.main.worldView.y + this.cameras.main.height / 2;

      // 创建UI容器并定位到屏幕右上角
      this.uiLayer = this.add.container();
      this.uiLayer.setDepth(1000); // 提升层级确保在最上层
      this.uiLayer.setScrollFactor(0); // 关键！禁止随相机滚动

      try {
        module = await import("@/pages/home/UIFunction");
      } catch (error) {
        console.error("Failed to load component:", error);
      }

      // 从右向左排列UI元素
      let currentX = window.innerWidth - this.uiPadding.x - this.uiPadding.x;
      const startY = this.uiPadding.y + this.uiPadding.y;

      for (const uiMapKey in uiMap) {
        const uiImage = this.add
          .image(currentX, startY, uiMapKey)
          .setInteractive()
          .setDepth(1001); // 单独设置更高层级
        // .setScrollFactor(0) // 禁止随相机滚动
        // .setData("name", uiMap[uiMapKey].name);

        // 动态调整尺寸
        const scaleRatio = 50 / uiImage.width;
        uiImage.setScale(scaleRatio);

        this.uiLayer.add(uiImage);

        // 调整间距计算方式
        currentX -= uiImage.displayWidth + 15; // 使用显示宽度计算间距

        // 绑定交互事件
        const component = module[uiMapKey];
        uiImage.on("pointerdown", component);
        // 创建文本对象并隐藏
        const nameText = this.add.text(
          currentX,
          startY + 30,
          uiMap[uiMapKey].name,
          {
            fontSize: "20px",
            color: "#ffffff",
            fontFamily: "Arial",
            stroke: "#000000",
            strokeThickness: 3,
          }
        );
        nameText.setAlpha(0); // 初始完全透明
        nameText.setDepth(100); // 确保在顶层
        nameText.setVisible(false);

        // 存储文本引用到岛屿对象
        uiImage.setData("text", nameText);
        uiImage.setData("currentX", currentX);
        // 鼠标悬停事件
        uiImage.on("pointerover", () => {
          const text = uiImage.getData("text") as Phaser.GameObjects.Text;

          // 停止之前的动画
          this.tweens.killTweensOf(text);

          // 更新文本位置（跟随岛屿中心）
          text.setPosition(uiImage.getData("currentX"), startY + 30);

          // 显示并渐入
          text.setVisible(true);
          this.tweens.add({
            targets: text,
            alpha: 1,
            duration: 300,
            ease: "Power2",
          });
        });

        // 鼠标移出事件
        uiImage.on("pointerout", () => {
          const text = uiImage.getData("text") as Phaser.GameObjects.Text;

          // 停止之前的动画
          this.tweens.killTweensOf(text);

          // 渐出后隐藏
          this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 200,
            ease: "Power2",
            onComplete: () => {
              text.setVisible(false);
            },
          });
        });
      }
      // this.scale.on("resize", this.updateUIPosition, this);
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
    // 新增方法：处理UI位置更新 =========================
    private updateUIPosition() {
      // 更新屏幕尺寸记录
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      let currentX = window.innerWidth - this.uiPadding.x - this.uiPadding.x;
      const startY = this.uiPadding.y + this.uiPadding.y;
      // 重新定位UI层到右上角
      this.uiLayer.setPosition(currentX, startY);

      // 更新所有UI元素的缩放补偿
      // this.uiLayer.each((child: Phaser.GameObjects.Image) => {
      //   child.setScale(
      //     this.baseUIScale / this.zoomLevel,
      //     this.baseUIScale / this.zoomLevel
      //   );
      // }, this);
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

          // this.updateUIPosition();
        }
      });
    }
  }

  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "phaser-example",
    scene: [myScene],
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 }, // 如果需要重力可以设置
        debug: false, // 调试模式
        debugShowBody: true,
        debugShowStaticBody: true,
      },
    },
  };
  game = new Phaser.Game(config);
  const scene = game.scene;
  console.log(scene);
  // scene("1904173695555866624");
  gameStore.registerGameInstance(game);
});
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
let game = null;
const gameStore = useGameStore();
</script>

<style scoped>
#phaser-example {
  overflow: hidden;
}
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
</style>
