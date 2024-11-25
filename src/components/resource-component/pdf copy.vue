<template>
    <div class="interviewVideo_main">
      <!-- 只保留一个canvas用于渲染当前页 -->
      <canvas
        :id="`pdf-canvas-` + currentPage"
        class="pdfcanvas"
        v-prevent-right-click
      ></canvas>
      <!-- 切换上下页 -->
      <div>
        <div
          id="page_box_scle"
          style="margin-top: -10%; margin-left: 35.6%"
        >
  
          <svg  @click="changePage(-1)" t="1728960435145" class="icon icon_top icon_hover" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14228" width="80" height="40"><path d="M960 276.16 299.84 482.56 299.84 229.056 64 229.056 64 794.944 299.84 794.944 299.84 541.44 960 747.84Z" fill="#8F9EB2" p-id="14229"></path></svg>
          <div class="page-indicator">
      <span class="page-number">
        {{ `${currentPage} / ${pdfPages}` }}
      </span>
    </div>
          <svg @click="changePage(1)" t="1728960555371"  class="icon icon_bot icon_hover" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15218" width="80" height="40"><path d="M724.16 229.056 724.16 482.56 64 276.16 64 747.84 724.16 541.44 724.16 794.944 960 794.944 960 229.056Z" fill="#8F9EB2" p-id="15219"></path></svg>
          <svg
            @click="changePagesles()"
             v-if="!isshow"
            t="1719997038112"
            class="icon icon_esc icon_hover"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3258"
            width="80"
            height="40"
          >
  <path d="M919.920093 725.414549q3.014188 26.122962 7.033105 58.776664t7.53547 66.814498 7.53547 67.819227 7.033105 60.786122q6.028376 47.222277-41.193901 44.208089-25.118232-2.009459-56.767205-5.526011t-64.805039-7.53547-65.809769-8.037834-59.781393-7.033105q-29.137149-3.014188-37.174984-16.578033t9.042564-30.644243q11.052022-10.047293 27.127691-27.630056t27.127691-28.634785q11.052022-12.056752 7.033105-22.104044t-16.075669-23.108774q-28.13242-27.127691-51.241194-49.231735t-51.241194-51.241194q-6.028376-6.028376-12.056752-13.061481t-9.042564-15.573304-1.004729-18.085127 13.061481-20.59695q6.028376-6.028376 10.047293-10.549658t8.037834-8.037834 8.540199-8.037834 11.554387-12.559116q20.094586-20.094586 37.174984-17.080398t37.174984 23.108774 41.193901 40.691536 47.222277 46.719912q19.089857 18.085127 32.653702 25.118232t26.625326-6.028376q9.042564-9.042564 22.606409-21.60168t23.611138-22.606409q17.080398-17.080398 30.644243-13.061481t16.578033 30.141879zM43.79615 383.80659q-3.014188-26.122962-7.033105-58.776664t-7.53547-66.814498-7.53547-67.819227-7.033105-60.786122q-3.014188-26.122962 6.53074-36.170255t33.658431-8.037834q25.118232 2.009459 56.767205 5.526011t64.805039 7.53547 65.809769 8.037834 59.781393 7.033105q30.141879 3.014188 37.677348 16.578033t-9.544928 30.644243q-10.047293 10.047293-24.615868 26.122962t-25.620597 27.127691q-12.056752 12.056752-8.037834 22.104044t17.080398 23.108774q13.061481 14.06621 24.615868 24.615868t22.606409 21.099315 23.108774 22.606409l25.118232 25.118232q6.028376 6.028376 11.554387 14.06621t8.037834 17.080398-0.502365 19.089857-13.061481 20.094586l-11.052022 11.052022q-4.018917 4.018917-7.53547 8.037834t-8.540199 8.037834l-11.052022 12.056752q-20.094586 20.094586-34.663161 15.070939t-34.663161-25.118232-38.179713-37.677348-44.208089-43.705724q-18.085127-18.085127-32.151337-25.118232t-27.127691 6.028376q-9.042564 10.047293-25.118232 24.615868t-26.122962 24.615868q-17.080398 17.080398-30.141879 13.061481t-16.075669-30.141879zM905.853883 84.397261q26.122962-3.014188 36.170255 6.53074t8.037834 34.663161-5.526011 56.767205-7.53547 64.805039-8.037834 65.809769-7.033105 59.781393q-3.014188 29.137149-16.578033 37.174984t-30.644243-10.047293q-10.047293-10.047293-26.122962-24.615868t-27.127691-25.620597q-12.056752-11.052022-22.104044-7.53547t-23.108774 16.578033q-27.127691 27.127691-47.724641 49.231735t-48.729371 50.236465q-6.028376 6.028376-14.06621 11.554387t-17.080398 8.037834-19.089857-0.502365-20.094586-14.06621q-6.028376-6.028376-10.549658-10.047293t-8.540199-8.037834-8.540199-8.037834-11.554387-12.056752q-20.094586-20.094586-16.075669-35.165525t25.118232-35.165525l38.179713-40.189172q19.089857-20.094586 45.212818-46.217547 19.089857-18.085127 26.122962-32.151337t-7.033105-26.122962q-9.042564-9.042564-23.108774-24.615868t-24.113503-25.620597q-17.080398-17.080398-13.061481-30.141879t30.141879-16.075669 58.776664-7.033105 67.316863-7.53547 67.819227-7.53547 60.283758-7.033105zM350.238584 640.012559q6.028376 6.028376 10.549658 10.047293t8.540199 8.037834l8.037834 9.042564 12.056752 11.052022q20.094586 20.094586 17.582763 36.672619t-23.611138 37.677348q-19.089857 19.089857-40.189172 40.691536t-47.222277 47.724641q-18.085127 18.085127-22.606409 29.639514t8.540199 24.615868q10.047293 9.042564 22.606409 22.606409t22.606409 23.611138q17.080398 17.080398 12.559116 30.141879t-30.644243 16.075669-58.274299 7.033105-66.814498 8.037834-68.321592 8.037834-60.786122 7.033105q-25.118232 2.009459-35.66789-7.53547t-8.540199-33.658431q2.009459-25.118232 5.526011-56.767205t7.53547-64.805039 8.037834-65.809769 7.033105-59.781393q3.014188-30.141879 16.578033-37.677348t30.644243 9.544928q10.047293 10.047293 27.630056 26.122962t28.634785 27.127691q12.056752 12.056752 20.094586 10.549658t20.094586-14.568575q13.061481-13.061481 25.118232-25.620597t24.113503-24.615868 24.615868-25.118232 26.625326-27.127691q6.028376-6.028376 13.061481-12.056752t15.573304-9.042564 18.085127-0.502365 20.59695 13.563845z" p-id="9240" fill="#8a8a8a"></path>
          </svg>
          <svg
            @click="changePagesles()"
             v-if="isshow"
            t="1719997038112"
            class="icon icon_esc icon_hover"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3258"
            width="80"
            height="40"
          >
            <path
              d="M422.648199 431.157895c5.67313 0 8.509695-2.836565 11.346261-5.67313 2.836565-2.836565 5.67313-8.509695 5.67313-11.346261V51.058172c0-2.836565 0-5.67313-2.836565-5.67313h-5.67313L306.34903 170.193906 141.828255 5.67313C138.99169 2.836565 133.31856 0 130.481994 0c-5.67313 0-11.34626 2.836565-14.182825 5.67313L5.67313 116.299169c-2.836565 2.836565-5.67313 8.509695-5.67313 11.34626 0 5.67313 2.836565 11.34626 5.67313 14.182826L170.193906 303.512465l-119.135734 119.135734c-2.836565 2.836565-2.836565 2.836565 0 5.673131 0 2.836565 2.836565 2.836565 5.67313 2.836565h365.916897z m0 156.01108c5.67313 0 8.509695 2.836565 11.346261 5.67313 2.836565 2.836565 5.67313 8.509695 5.67313 11.346261v365.916897c0 2.836565 0 5.67313-2.836565 5.67313h-5.67313L306.34903 850.969529 141.828255 1015.490305c-2.836565 2.836565-8.509695 5.67313-11.346261 5.67313-5.67313 0-8.509695-2.836565-11.34626-5.67313L8.509695 904.864266c-5.67313-2.836565-8.509695-8.509695-8.509695-11.34626s2.836565-8.509695 5.67313-11.346261L170.193906 717.65097l-119.135734-119.135735c-2.836565-2.836565-2.836565-2.836565 0-5.67313 0-2.836565 2.836565-2.836565 5.67313-2.836565l365.916897-2.836565z m175.867036-156.01108c-5.67313 0-8.509695-2.836565-11.34626-5.67313-2.836565-2.836565-5.67313-8.509695-5.67313-11.346261V51.058172c0-2.836565 0-5.67313 2.836565-5.67313h5.67313L714.814404 170.193906 879.33518 5.67313c2.836565-2.836565 8.509695-5.67313 11.34626-5.67313 5.67313 0 8.509695 2.836565 11.346261 5.67313l110.626039 110.626039c5.67313 2.836565 8.509695 8.509695 8.509695 11.34626 0 5.67313-2.836565 8.509695-5.67313 11.346261L850.969529 303.512465l119.135734 119.135734c2.836565 2.836565 2.836565 2.836565 0 5.673131 0 2.836565-2.836565 2.836565-5.67313 2.836565H598.515235z m0 156.01108c-5.67313 0-8.509695 2.836565-11.34626 5.67313-2.836565 2.836565-5.67313 8.509695-5.67313 11.346261v365.916897c0 2.836565 0 5.67313 2.836565 5.67313h5.67313l121.972299-121.972299 164.520776 164.520776c2.836565 2.836565 8.509695 5.67313 11.34626 5.67313 5.67313 0 8.509695-2.836565 11.346261-5.67313l110.626039-110.626039c2.836565-2.836565 5.67313-8.509695 5.67313-11.34626s-2.836565-8.509695-5.67313-11.346261L850.969529 717.65097l119.135734-119.135735c2.836565-2.836565 2.836565-2.836565 0-5.67313 0-2.836565-2.836565-2.836565-5.67313-2.836565l-365.916898-2.836565z"
              fill="#666666"
              p-id="3259"
            ></path>
          </svg>
        </div>
      </div>
  
      <!-- 添加一个占位元素，用于设置滚动区域的高度 -->
      <div ref="placeholder"></div>
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
  .button2 {
    display: inline-block;
    transition: all 0.2s ease-in;
    position: relative;
    overflow: hidden;
    z-index: 1;
    color: #090909;
    padding: 0.7em 1.7em;
    cursor: pointer;
    font-size: 18px;
    border-radius: 0.5em;
    background: #e8e8e8;
    border: 1px solid #e8e8e8;
    box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;
  }
  
  .button2:active {
    color: #666;
    box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff;
  }
  
  .button2:before {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%) scaleY(1) scaleX(1.25);
    top: 100%;
    width: 140%;
    height: 180%;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    display: block;
    transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
    z-index: -1;
  }
  
  .button2:after {
    content: "";
    position: absolute;
    left: 55%;
    transform: translateX(-50%) scaleY(1) scaleX(1.45);
    top: 180%;
    width: 160%;
    height: 190%;
    background-color: #009087;
    border-radius: 50%;
    display: block;
    transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
    z-index: -1;
  }
  
  .button2:hover {
    color: #ffffff;
    border: 1px solid #009087;
  }
  
  .button2:hover:before {
    top: -35%;
    background-color: #009087;
    transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
  }
  
  .button2:hover:after {
    top: -45%;
    background-color: #009087;
    transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
  }
  
  .pdfcanvas {
    margin: 0;
  }
  .pdfcanvas {
    width: 100%; /* 关键！ 让 canvas 宽度自适应 */
    height: auto; /* 关键！ 让高度根据宽度和纵横比自动调整 */
    /*max-width: 95%;
    max-height: 95%;*/
    display: block;
    margin: 0 auto;
    object-fit: contain; /* 如果需要图片充满整个画布，可以用 cover */
    transform-origin: 0 0 !important; /* 确保缩放的中心点 */
  }
  
  .pdfcanvas_scale {
    /* 其他样式 */
    width: 100%;
    height: auto;
    // max-width: 95%;
    // max-height: 95%;
    position: relative; /* 重要, 用于让 position 进行定位 */
    top: 0; /* 重要, 让元素从零开始定位 */
  }
  
  .pasrt {
    position: relative;
    bottom: 28%;
    left: 25%;
    rotate: 90deg;
  }
  #page_box {
    display: flex;
    justify-content: center;
  }
  #page_box_scle {
    width: 100%;
    text-align: left;
    position: fixed;
    bottom: 50%;
    left: 56%;
    // rotate: 90deg;
    padding-left: 2%;
  }
  .icon_top {
    rotate: 90deg;
    position: relative;
    // right: 2vw;
    left: 1vw;
  }
  .icon_bot {
    rotate: 90deg;
    position: relative;
    top: 6rem;
    // right: 2vw;
    left: 1vw;
  
  }
  .icon_esc {
    position: relative;
    top: 12rem;
    // right: 2vw;
    left: 1vw;
  
  }
  .icon_top,
  .icon_bot,
  .icon_esc:hover {
    cursor: pointer;
    // background: #518ae6;
  }
  .icon_hover {
    opacity: 0.5;
  }
  .icon_hover:hover {
    animation: icon_hover 0.5s forwards;
  }
  
  @keyframes icon_hover {
    from {
      transform: scale(1);
      opacity: 0.7;
    }
    to {
      transform: scale(1.2);
      opacity: 1;
    }
  }
  
  .no-scrollbar {
    overflow: hidden;
  }
  .no-maging {
    object-fit: cover;
  }
  .page-indicator {
    width: 8vw;
    display: flex;
    align-items: center;
    justify-content: center;
    // background-color: #c3cbd8;
    border-radius: 5px;
    position: relative;
    top: 6vh;
    // top: 5.2vh;
    right: 1vw;
    // rotate: 90deg;
  }
  
  .page-number {
    color: rgb(223, 205, 205);
    font-size: 1.2rem;
    font-weight: bold;
  }
  @media (max-width: 1100px) {
    .page-number {
      font-size: 1rem;
    }
   }
   @media (max-width: 1000px) {
    .page-number {
      font-size: 8px;
    }
   }
  </style>
  