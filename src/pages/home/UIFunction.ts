import { h, ref, render } from "vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";

// // 创建挂载容器
// let islandContainer = null;
const userStore = useUserStore();
export const isCreateIsland = ref(false);
export const isManageIsland = ref(false);
export async function login() {
  if (!userStore.isLogin()) {
    await router.push("/login");
  } else {
    isManageIsland.value = !isManageIsland.value;
    isCreateIsland.value = false;
  }
}

export function map() {
  isCreateIsland.value = !isCreateIsland.value;
  isManageIsland.value = false;
  // // 创建挂载容器
  // const container = document.createElement("div");
  // document.body.appendChild(container);
  //
  // // 创建虚拟 DOM
  // const vnode = h(createIsland, {
  //   // 可以传递 props
  //   onClose: () => {
  //     // 卸载时清理
  //     render(null, container);
  //     container.remove();
  //   },
  // });
  //
  // // 渲染到 DOM
  // render(vnode, container);
}
// export function map() {
//   // 清理旧容器
//   if (islandContainer) {
//     // 添加关闭动画
//     islandContainer.classList.add("island-exit");
//     setTimeout(() => {
//       render(null, islandContainer);
//       islandContainer?.remove();
//       islandContainer = null;
//     }, 300); // 匹配动画时长
//     return;
//   }
//
//   // 创建新容器
//   islandContainer = document.createElement("div");
//   islandContainer.className = "island-container island-enter";
//
//   // 定位样式（fixed 定位解决父级 overflow 问题）
//   Object.assign(islandContainer.style, {
//     position: "fixed",
//     zIndex: "9999",
//     top: "0",
//     left: "0",
//     width: "100%",
//     height: "100%",
//     pointerEvents: "none",
//     // 新增背景色
//     background: "rgba(0, 0, 0, 0.5)", // 半透明黑色遮罩
//     // 新增flex布局
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   });
//
//   document.body.appendChild(islandContainer);
//
//   // 创建虚拟节点
//   // 在创建虚拟节点时添加内容容器
//   const islandVNode = h(
//     "div", // 新增包裹容器
//     {
//       class: "island-content", // 添加内容样式
//       style: {
//         pointerEvents: "auto", // 启用内容区域点击
//       },
//     },
//     [
//       h(createIsland, {
//         onClose: () => {
//           // 触发关闭动画
//           islandContainer?.classList.add("island-exit");
//           setTimeout(() => {
//             render(null, islandContainer);
//             islandContainer?.remove();
//             islandContainer = null;
//           }, 300);
//         },
//       }),
//     ]
//   );
//   // 添加动画
//   requestAnimationFrame(() => {
//     islandContainer?.classList.remove("island-enter");
//   });
//
//   // 渲染内容
//   render(islandVNode, islandContainer);
//
//   // 点击穿透控制逻辑
//   const handlePointerEvents = (enable: boolean) => {
//     if (islandContainer) {
//       islandContainer.style.pointerEvents = enable ? "auto" : "none";
//     }
//   };
//
//   // 默认开启交互
//   handlePointerEvents(true);
// }

// // 添加全局样式
// const style = document.createElement("style");
// style.textContent = `
// .island-container {
//   transition: opacity 0.3s;
//   will-change: opacity;
// }
//
// .island-content {
//   background: white;
//   border-radius: 8px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//   padding: 24px;
//   max-width: 80%;
//   width: 600px;
//   transform: translateY(20px);
//   transition: transform 0.3s, opacity 0.3s;
// }
//
// .island-enter .island-content {
//   opacity: 0;
//   transform: translateY(20px);
// }
//
// .island-enter-active .island-content {
//   transition: all 0.3s;
// }
//
// .island-exit .island-content {
//   opacity: 0 !important;
//   transform: translateY(-20px) !important;
// }
// `;
// document.head.appendChild(style);
// 修改后的map函数
// export function map() {
//   // 如果容器已存在则先卸载
//   if (islandContainer) {
//     render(null, islandContainer);
//     islandContainer.remove();
//   }
//
//   // 创建新容器
//   islandContainer = document.createElement("div");
//   document.body.appendChild(islandContainer);
//
//   // 创建虚拟节点并渲染
//   const islandVNode = h(createIsland, {
//     onClose: () => {
//       render(null, islandContainer);
//       islandContainer.remove();
//       islandContainer = null;
//     },
//   });
//
//   render(islandVNode, islandContainer);
// }
