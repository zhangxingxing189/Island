<template>
  <div id="phaser-example"></div>
</template>

<script setup>
// function cli(){//用于查看已加载的区块
//   for (let i=0;i<posision.length;i++)
//   {
//     console.log(posision[i]);
//   }
// }
import Phaser from "phaser";

let posision = ["0,0", "0,-1", "-1,0", "-1,-1", "1,1", "1,2"];

class Example extends Phaser.Scene {
  // tiles = [7, 7, 7, 6, 6, 6, 0, 0, 0, 1, 1, 2, 3, 4, 5];
  tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  mapHeight = 18; // 每个地图块的高度（以瓦片为单位）
  mapWidth = 45; // 每个地图块的宽度（以瓦片为单位）
  // tileWidth = 16;
  tileWidth = 40;
  // tileHeight = 16;
  tileHeight = 40;
  maps = []; // 存储所有生成的地图块
  cameraBounds = { left: 0, right: 0, top: 0, bottom: 0 }; // 当前相机边界
  cursors; // 键盘输入
  loadedMap = {}; // 记录已加载的地图块

  preload() {
    this.load.image("tiles", "/images/background.png");
  }

  create() {
    // 初始化地图
    // for (let i = -1; i < 2; i++) {
    //   for (let j = -1; j < 2; j++) {
    //     this.generateMap(i, j);
    //   }
    // }
    this.generateMap(-1, -1);
    this.generateMap(-1, 0);
    this.generateMap(0, -1);
    this.generateMap(0, 0);
    this.generateMap(1, 1);
    this.generateMap(1, 2);

    // this.generateMap(1,1);
    //
    // 初始化边界

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

    // 监听相机移动
    this.cameras.main.setBounds(
      this.cameraBounds.left,
      this.cameraBounds.top,
      this.cameraBounds.right - this.cameraBounds.left,
      this.cameraBounds.bottom - this.cameraBounds.top
    );
  }

  update(time, delta) {
    // 控制镜头移动
    const speed = 4;
    if (this.cursors.up.isDown || this.keys.w.isDown) {
      this.cameras.main.scrollY -= speed;
    }
    if (this.cursors.down.isDown || this.keys.s.isDown) {
      this.cameras.main.scrollY += speed;
    }
    if (this.cursors.left.isDown || this.keys.a.isDown) {
      this.cameras.main.scrollX -= speed;
    }
    if (this.cursors.right.isDown || this.keys.d.isDown) {
      this.cameras.main.scrollX += speed;
    }

    // 检查是否需要生成新地图
    this.checkAndGenerateMaps();
    // console.log(this.cameras.main.scrollX,this.cameras.main.scrollY);
  }

  generateMap(offsetX, offsetY) {
    if (this.isMapLoaded(offsetX, offsetY)) {
      console.log(`地图块 (${offsetX}, ${offsetY}) 已加载，跳过生成`);
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
    const tileset = map.addTilesetImage("tiles"); //可以放多个瓦片地图
    const layer = map.createLayer(
      0,
      tileset,
      offsetX * this.mapWidth * this.tileWidth,
      offsetY * this.mapHeight * this.tileHeight
    );
    layer.setVisible(true);
    posision.push(`${offsetX},${offsetY}`);
    // console.log(`生成地图块 (${offsetX}, ${offsetY})`, offsetX * this.mapWidth * this.tileWidth, offsetY * this.mapHeight * this.tileHeight);
    this.maps.push({ map, layer, offsetX, offsetY });
    this.markMapAsLoaded(offsetX, offsetY); // 标记为已加载
  }

  updateCameraBounds() {
    // 更新全局边界（用于相机设置）
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

    // 设置相机的滚动范围
    console.log(this.cameraBounds.left, this.cameraBounds.top);
    this.cameras.main.setBounds(
      this.cameraBounds.left,
      this.cameraBounds.top,
      this.cameraBounds.right - this.cameraBounds.left,
      this.cameraBounds.bottom - this.cameraBounds.top
    );
  }

  checkAndGenerateMaps() {
    const cam = this.cameras.main;
    const buffer = 0; // 提前生成地图的缓冲距离
    let offsetX;
    let offsetY;
    const y = cam.scrollY / (this.mapHeight * this.tileHeight);
    const x = cam.scrollX / (this.mapWidth * this.tileWidth);
    // 计算当前镜头所在的行和列（以地图块为单位）

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
      offsetX = Math.ceil(x) + buffer; //向上取整
    }
    // console.log(x.toFixed(2), y.toFixed(2), offsetX, offsetY);
    //查看这个点四周的瓦片有没有加载
    if (offsetX >= 0 && offsetY >= 0) {
      if (!this.isMapLoaded(offsetX + 1, offsetY)) {
        this.generateMap(offsetX + 1, offsetY);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX + 1, offsetY - 1)) {
        this.generateMap(offsetX + 1, offsetY - 1);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX, offsetY + 1)) {
        this.generateMap(offsetX, offsetY + 1);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX - 1, offsetY + 1)) {
        this.generateMap(offsetX - 1, offsetY + 1);
        this.updateCameraBounds();
      }

      if (!this.isMapLoaded(offsetX - 1, offsetY - 1)) {
        this.generateMap(offsetX - 1, offsetY);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX, offsetY)) {
        this.generateMap(offsetX, offsetY);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX, offsetY - 1)) {
        this.generateMap(offsetX, offsetY - 1);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX - 1, offsetY)) {
        this.generateMap(offsetX - 1, offsetY);
        this.updateCameraBounds();
      }
    } else if (offsetX >= 0 && offsetY <= 0) {
      if (!this.isMapLoaded(offsetX - 1, offsetY)) {
        this.generateMap(offsetX - 1, offsetY);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX + 1, offsetY)) {
        this.generateMap(offsetX + 1, offsetY);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX + 1, offsetY - 1)) {
        this.generateMap(offsetX + 1, offsetY - 1);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX, offsetY + 1)) {
        this.generateMap(offsetX, offsetY + 1);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX - 1, offsetY + 1)) {
        this.generateMap(offsetX - 1, offsetY + 1);
        this.updateCameraBounds();
      }

      if (!this.isMapLoaded(offsetX - 1, offsetY)) {
        this.generateMap(offsetX - 1, offsetY);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX, offsetY)) {
        this.generateMap(offsetX, offsetY);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX, offsetY - 1)) {
        this.generateMap(offsetX, offsetY - 1);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX - 1, offsetY - 1)) {
        this.generateMap(offsetX - 1, offsetY - 1);
        this.updateCameraBounds();
      }
    } else if (offsetX <= 0 && offsetY >= 0) {
      if (!this.isMapLoaded(offsetX, offsetY + 1)) {
        this.generateMap(offsetX, offsetY + 1);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX - 1, offsetY + 1)) {
        this.generateMap(offsetX - 1, offsetY + 1);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX + 1, offsetY)) {
        this.generateMap(offsetX + 1, offsetY);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX + 1, offsetY + 1)) {
        this.generateMap(offsetX + 1, offsetY + 1);
        this.updateCameraBounds();
      }

      if (!this.isMapLoaded(offsetX, offsetY - 1)) {
        this.generateMap(offsetX, offsetY - 1);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX, offsetY)) {
        this.generateMap(offsetX, offsetY);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX - 1, offsetY - 1)) {
        this.generateMap(offsetX - 1, offsetY - 1);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX - 1, offsetY)) {
        this.generateMap(offsetX - 1, offsetY);
        this.updateCameraBounds();
      }
    } else if (offsetX <= 0 && offsetY <= 0) {
      if (!this.isMapLoaded(offsetX, offsetY)) {
        this.generateMap(offsetX, offsetY);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX - 1, offsetY - 1)) {
        this.generateMap(offsetX - 1, offsetY - 1);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX, offsetY - 1)) {
        this.generateMap(offsetX, offsetY - 1);
        this.updateCameraBounds();
      }
      if (!this.isMapLoaded(offsetX - 1, offsetY)) {
        this.generateMap(offsetX - 1, offsetY);
        this.updateCameraBounds();
      }
    }
  }

  isMapLoaded(offsetX, offsetY) {
    return this.loadedMap[`${offsetX},${offsetY}`] === true;
  }

  markMapAsLoaded(offsetX, offsetY) {
    this.loadedMap[`${offsetX},${offsetY}`] = true;
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "phaser-example",
  scene: Example,
};

new Phaser.Game(config);
document.body.style.overflow = "hidden";
</script>

<style>
canvas {
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}
</style>
<!--<template>//用于测试登录回调-->
<!--  <a-button @click="login">登录</a-button>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import router from "@/router";-->

<!--function login() {-->
<!--  router.push({-->
<!--    name: "login",-->
<!--    query: {-->
<!--      code: "123",-->
<!--      type: "QQ",-->
<!--    },-->
<!--  });-->
<!--}-->
<!--</script>-->

<!--<style scoped></style>-->
