<template>
  <div class="pdf-wrapper" :class="{ fullscreen: isshow }">
    <!-- PDF 画布 -->
    <canvas
      :id="`pdf-canvas-${currentPage}`"
      class="pdfcanvas"
      v-prevent-right-click
    ></canvas>

    <!-- 控制面板 -->
    <div class="control-panel" :class="{ 'control-panel-fullscreen': isshow }">
      <!-- 上一页按钮 -->
      <div class="control-button" @click="changePage(-1)" title="上一页">
        <Icon icon="mdi:chevron-up" width="24" height="24" />
      </div>

      <!-- 页码显示 -->
      <div class="page-indicator">
        <span class="page-number">{{ currentPage }} / {{ pdfPages }}</span>
      </div>

      <!-- 下一页按钮 -->
      <div class="control-button" @click="changePage(1)" title="下一页">
        <Icon icon="mdi:chevron-down" width="24" height="24" />
      </div>

      <!-- 全屏切换按钮 -->
      <div class="control-button" @click="changePagesles" title="全屏切换">
        <Icon 
          :icon="isshow ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'" 
          width="24" 
          height="24" 
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  reactive,
  onBeforeUnmount,
  onMounted,
  nextTick,
  onUpdated,
  watch,
  defineEmits,
} from "vue";
import { Icon } from '@iconify/vue';

const prop = defineProps({
  course_url: {
    type: String,
    required: true,
    default: "默认值",
  },
  path_key: {
    type: String,
    required: false,
    default: "默认值",
  },
});
// console.log(prop.course_url);
import * as pdfjsLib from "pdfjs-dist";
import { TypedArray, DocumentInitParameters } from "pdfjs-dist/types/src/display/api";
let pdfDoc = reactive({}); // 保存加载的pdf文件流
let pdfPages = ref(0); // pdf文件的页数
let currentPage = ref(1); // 当前显示的页码

let pdfUrl = ref(prop.course_url); //本地不能有其他路径
// let pdfScale = ref(1.34); // 缩放比例
let pdfScale = ref(1); // 缩放比例

// 获取pdf文档流与pdf文件的页数
const loadFile = async (url: string|URL|TypedArray|ArrayBuffer|DocumentInitParameters) => {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs";

  const loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then((pdf) => {
    console.log(pdf);
    pdfDoc = pdf; //获取pdf文档流
    pdfPages.value = pdf.numPages; //获取pdf文件的页数
    nextTick(() => {
      renderPage(currentPage.value);
    });
  });
};

// 定义渲染pdf文件的方法
const renderPage = (num) => {
  // console.log(`渲染第 ${num} 页`);
  pdfDoc.getPage(num).then((page) => {
    const canvasId = "pdf-canvas-" + num;
    const canvas = document.getElementById(canvasId);
    const ctx = canvas?.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    if (ctx) {
      const bsr =
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1;
      const ratio = dpr / bsr;
      const viewport = page.getViewport({ scale: pdfScale.value });
      canvas.width = viewport.width * ratio;
      canvas.height = viewport.height * ratio;
      // canvas.style.width = viewport.width + "px";
      // canvas.style.height = viewport.height + "px";
      // canvas.style.width = '95%'; //宽高固定
      // canvas.style.height = '95%'; //宽高固定
      canvas.style.width = "100%"; //宽高固定
      // canvas.style.height = "100%";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };
      page.render(renderContext);
    }
  });
};

// 调用loadFile方法
onMounted(() => {
  loadFile(pdfUrl.value);
  window.addEventListener("popstate", handlePopState);
});
//监听浏览器返回按键根据需求执行返回的地址
onBeforeUnmount(() => {
  window.removeEventListener("popstate", handlePopState);
  document.body.classList.remove("no-scrollbar");
});
const handlePopState = (event) => {
  // 检查是否满足特定条件
  if (isshow.value) {
    // 如果满足条件,退出全屏
    changePagesles();
    // router.go(router.route.path)
  }
};
const emit = defineEmits(['updatePdfPages','updatePageScroll']);
// 修改: 点击上、下一页
const changePage = (step) => {
  emit('updatePageScroll','scroll-top')
  const newPage = currentPage.value + step;
  if (newPage >= 1 && newPage <= pdfPages.value) {
    currentPage.value = newPage;  
    renderPage(currentPage.value);
    if (currentPage.value === pdfPages.value) {
      // console.log(currentPage.value);
      // console.log(pdfPages.value);
      isshow.value = false;
      Zoomout();
    }
  }
};
const Zoomout = () => {
  // isshow.value = false;
  let pdfcanvas=document.getElementById("pdf_id")
  if(pdfcanvas) pdfcanvas.classList.remove('Pdf_Scale_')
  document.body.classList.remove("no-scrollbar");


};
//全屏观看
let isshow = ref(false);
const changePagesles = () => {
  isshow.value = !isshow.value;
  MyStore.$state.isshow = isshow.value;
  // console.log(isshow.value);

  let pdfcanvas=document.getElementById("pdf_id")

  if (isshow.value) {
    //隐藏导航栏
    // document.body.classList.add("no-scrollbar");
    if(pdfcanvas) pdfcanvas.classList.add('Pdf_Scale_')

  } else {
    // console.log('退出全屏');
    Zoomout();
  }
};

document.addEventListener("keydown", function (event) {
  // 检查是否按下了F11键
  if (event.key === "F11") {
    event.preventDefault(); // 阻止浏览器的默认全屏行为（如果需要的话）
    changePagesles(); // 调用你的F11事件处理函数
  }

  // 检查是否按下了Esc键
  else if (event.key === "Escape") {
    changePagesles(); // 调用你的Esc事件处理函数
  }
  // 检查是否按下了向上箭头键
  else if (event.key === "ArrowUp") {
    event.preventDefault(); // 阻止浏览器的默认行为（如果需要的话）
    changePage(-1); // 调用你的向上箭头键事件处理函数
  }

  // 检查是否按下了向下箭头键
  else if (event.key === "ArrowDown") {
    event.preventDefault(); // 阻止浏览器的默认行为（如果需要的话）
    changePage(1); // 调用你的向下箭头键事件处理函数
  }
});

//发送加载好的pdf页数
// 使用defineEmits声明可以触发的事件
watch(pdfPages, (newval, nextval) => {
  console.log(newval,nextval);
  // 使用defineEmits声明的事件名来触发事件
  emit("updatePdfPages", newval);
});
</script>
<style lang="scss" scoped>
.pdf-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f5f6f8;

  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background: #000;
  }
}

.pdfcanvas {
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  object-fit: contain;
}

/* 控制面板样式 */
.control-panel {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.7);
  padding: 12px;
  border-radius: 8px;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.control-panel-fullscreen {
  right: 40px;
}

/* 控制按钮样式 */
.control-button {
  width: 3rem;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ffffff;
  margin: auto;
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
}

/* 页码指示器样式 */
.page-indicator {
  padding: 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  text-align: center;
  
  .page-number {
    color: #ffffff;
    font-size: 15px;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .control-panel {
    right: 10px;
    padding: 10px;
  }

  .control-button {
    width: 40px;
    height: 40px;
  }

  .page-indicator .page-number {
    font-size: 14px;
  }
}
</style>
  