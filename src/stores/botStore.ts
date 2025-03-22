import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export interface Robot {
  id: string;
  name: string;
  function?: string;
  createdAt: Date;
  status: "在线" | "离线" | "维护中";
}

export const useBotStore = defineStore("bot", {
  state: () => ({
    robots: [] as Robot[],
    initialized: false,
  }),
  actions: {
    // 初始化本地数据
    initLocalData() {
      if (this.initialized) return;

      const localData = localStorage.getItem("robot-store");
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          this.robots = parsed.map((r: any) => ({
            ...r,
            createdAt: new Date(r.createdAt),
          }));
        } catch (e) {
          localStorage.removeItem("robot-store");
        }
      }

      // 初始示例数据
      if (this.robots.length === 0) {
        this.robots = [this.createRobotTemplate("默认教学机器人", "")];
        this.saveToLocal();
      }

      this.initialized = true;
    },

    // 创建机器人模板
    createRobotTemplate(name: string, func?: string): Robot {
      return {
        id: uuidv4(),
        name,
        function: func,
        createdAt: new Date(),
        status: "离线",
      };
    },

    // 创建机器人
    createRobot(robot: Omit<Robot, "id" | "createdAt" | "status">) {
      const newRobot: Robot = {
        ...robot,
        ...this.createRobotTemplate(robot.name),
      };
      this.robots.push(newRobot);
      this.saveToLocal();
      return newRobot;
    },

    // 删除机器人
    deleteRobot(id: string) {
      this.robots = this.robots.filter((r) => r.id !== id);
      this.saveToLocal();
    },

    // 更新机器人
    updateRobot(id: string, update: Partial<Robot>) {
      const index = this.robots.findIndex((r) => r.id === id);
      if (index > -1) {
        // 只允许修改的字段
        const allowedUpdates = {
          name: update.name,
          function: update.function,
        };

        // 合并更新且保留未修改字段
        this.robots[index] = {
          ...this.robots[index],
          ...allowedUpdates,
        };

        this.saveToLocal();
      }
    },

    // 持久化存储
    saveToLocal() {
      const serialized = JSON.stringify(
        this.robots.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))
      );
      localStorage.setItem("robot-store", serialized);
    },

    getRobot(id: string) {
      for (const robot of this.robots) {
        if (robot.id === id) {
          return robot;
        }
      }
      return null;
    },
  },
  getters: {
    // 按创建时间排序
    sortedRobots: (state) => {
      return [...state.robots].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    },
  },
});
