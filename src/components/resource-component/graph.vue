<template>
    <div class="graph-wrapper" :class="{ fullscreen: isenlarge }">
      <!-- 控制面板，包含全屏切换按钮和2D/3D切换按钮 -->
      <div class="control-panel">
        <span class="enlarge-button" :class="{'enlarge-button_full_screen':isenlarge}" @click="toggleEnlarge">
          <el-icon><Rank /></el-icon>
        </span>
        <span class="control-button" :class="{'control-button-fullscreen': isenlarge}" @click="toggle2D3D">
          {{ is3D ? '2D' : '3D' }}
        </span>
      </div>
      <!-- 图形容器 -->
      <div ref="containerRef" class="graph-container"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import * as d3 from "d3";
  import { useElementSize } from '@vueuse/core';
  import * as THREE from "three";
  import { onMounted, onUnmounted, ref, watch, shallowRef, watchEffect, nextTick } from "vue";
  import { xml2js } from "xml-js";
  
  // 定义组件的 props
  const props = defineProps({
    course_url: {
      type: String,
      required: true,
      default: "默认值",
    },
  });
  // 引用图形容器的 DOM 元素
  const containerRef = ref<HTMLElement | null>(null);
  const { width, height } = useElementSize(containerRef);
  // 控制是否全屏显示的状态
  const isenlarge = ref(false);
  // 控制是否显示3D渲染的状态
  const is3D = ref(false);
  let graph: any;
  
  // 使用 shallowRef 来存储动态导入的 ForceGraph3D
  const ForceGraph3D = shallowRef<any>(null);
  
  // 动态导入 ForceGraph3D
  watchEffect(async () => {
    if (is3D.value && !ForceGraph3D.value) {
      const module = await import('3d-force-graph');
      ForceGraph3D.value = module.default;
    }
  });
  
  // 渲染2D图形的主函数
  const render2DGraph = async(container: HTMLElement) => {
    if (!container) return;
  
    // 清理现有的 SVG
    d3.select(container).selectAll("*").remove();
  
    // 解析 GraphML 数据
    const graphData = await parseGraphML(props.course_url);
    if (!graphData || !graphData.nodes.length) return;
  
    // 使用固定的尺寸
    const containerWidth = 800;
    const containerHeight = 600;
  
    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
  
    // 添加缩放和平移功能
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
  
    svg.call(zoom as any);
  
    // 创建一个包含所有元素的组
    const g = svg.append("g");
  
    // 创建力导向图
    const simulation = d3
      .forceSimulation(graphData.nodes)
      .force(
        "link",
        d3
          .forceLink(graphData.links)
          .id((d: any) => d.id)
          .distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(containerWidth / 2, containerHeight / 2))
      .force("collision", d3.forceCollide().radius(50));
  
    // 绘制连接线
    const link = g
      .append("g")
      .selectAll("line")
      .data(graphData.links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5);
  
     // 创建节点组
     const node = g
      .append("g")
      .selectAll(".node")
      .data(graphData.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(drag(simulation) as any);
  
    // 绘制节点圆
    node
      .append("circle")
      .attr("r", 30)
      .attr("fill", (d: any) => d3.schemeCategory10[d.id.charCodeAt(0) % 10])
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);
  
    // 添加节点标签
    node
      .append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text((d: any) => d.id)
      .attr("fill", "white")
      .style("font-size", "12px")
      .style("font-weight", "bold");
  
    // 添加点击高亮效果
    node.on("click", function(event, d) {
      // 重置所有节点和连接线的样式
      node.select("circle")
        .attr("r", 30)
        .attr("stroke", "#fff")
        .style("opacity", 0.3); // 将未选中的节点变灰
      node.select("text")
        .style("font-size", "12px")
        .style("opacity", 0.3); // 将未选中的文本变灰
      link
        .attr("stroke", "#999")
        .attr("stroke-width", 1.5)
        .style("opacity", 0.3); // 将未选中的连接线变灰
  
      // 高亮被的节点及其相关连接
      const clickedNode = d3.select(this);
      clickedNode.select("circle")
        .attr("r", 35)
        .attr("stroke", "#ff0")
        .style("opacity", 1); // 恢复选中节点的不透明度
      clickedNode.select("text")
        .style("font-size", "14px")
        .style("opacity", 1); // 恢复选中节点文本的不透明度
  
      // 高亮与被点击节点相连的所有连接线和节点
      link.filter((l: any) => l.source === d || l.target === d)
        .attr("stroke", "#ff0")
        .attr("stroke-width", 3)
        .style("opacity", 1) // 恢复相关连接线的不透明度
        .each(function(l: any) {
          // 高亮相连的节点
          const connectedNode = l.source === d ? l.target : l.source;
          node.filter((n: any) => n === connectedNode)
            .select("circle")
            .style("opacity", 1)
            .attr("stroke", "#ff0");
          node.filter((n: any) => n === connectedNode)
            .select("text")
            .style("opacity", 1);
        });
  
      // 停止模拟
      simulation.stop();
    });
  
    // 添加点击背景重置效果
    svg.on("click", function(event) {
      if (event.target === this) {
        // 重置所有节点和连接线的样式
        node.select("circle")
          .attr("r", 30)
          .attr("stroke", "#fff")
          .style("opacity", 1);
        node.select("text")
          .style("font-size", "12px")
          .style("opacity", 1);
        link
          .attr("stroke", "#999")
          .attr("stroke-width", 1.5)
          .style("opacity", 1);
  
        // 重新启动模拟
        simulation.restart();
      }
    });
    // 更新力导向图
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
  
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });
  };
  
  // 渲染3D图形的主函数
  const render3DGraph = async() => {
    if (!containerRef.value || !ForceGraph3D.value) return;
  
    // 清理现有的图形
    if (graph) graph._destructor();
  
    // 解析 GraphML 数据
    const graphData = await parseGraphML(props.course_url);
    if (!graphData || !graphData.nodes.length) return;
  
    // 获取容器的实际尺寸
    const containerWidth = containerRef.value.clientWidth;
    const containerHeight = containerRef.value.clientHeight;
  
    // 创建颜色生成函数
    const getNodeColor = d3.scaleOrdinal(d3.schemeCategory10);
  
    // 创建3D力导向图
    graph = ForceGraph3D.value()(containerRef.value)
      .graphData(graphData)
      .width(containerWidth)
      .height(containerHeight)
      .nodeLabel('label')
      .linkColor(() => '#ffffff')
      .linkWidth(1)
      .linkOpacity(0.2)
      .nodeThreeObject((node: any) => {
        const group = new THREE.Group();
  
        // 创建球体几何体
        const geometry = new THREE.SphereGeometry(3, 32, 32);
        const material = new THREE.MeshPhongMaterial({
          color: getNodeColor(node.id),
          shininess: 100,
          specular: 0x111111
        });
        const sphere = new THREE.Mesh(geometry, material);
        group.add(sphere);
  
        // 创建文字标签
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(createTextCanvas(node.label)),
            depthWrite: false,
          })
        );
        sprite.scale.set(20, 10, 1);
        sprite.position.set(0, 5, 0);
  
        group.add(sprite);
        return group;
      })
      .onNodeClick(handleNodeClick)
      .onBackgroundClick(resetHighlight);
  
    // 添加环境光和平行光
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    graph.scene().add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    graph.scene().add(directionalLight);
  
    // 加窗口大小变化监听
    window.addEventListener('resize', handleResize);
  };
  
  // 处理节点点击事件
  const handleNodeClick = (node: any) => {
    highlightNode(node);
    highlightConnectedNodes(node);
  };
  
  // 高亮选中的节点
  const highlightNode = (node: any) => {
    const nodeObject = node.__threeObj;
    if (nodeObject) {
      nodeObject.children[0].material.emissive.setHex(0xff0000);
      nodeObject.children[0].material.emissiveIntensity = 0.5;
    }
  };
  
  // 高亮相连的节点和连接线
  const highlightConnectedNodes = (node: any) => {
    graph.graphData().links.forEach((link: any) => {
      if (link.source === node || link.target === node) {
        const connectedNode = link.source === node ? link.target : link.source;
        highlightNode(connectedNode);
        link.__lineObj.material.color.setHex(0xff0000);
        link.__lineObj.material.opacity = 1;
      }
    });
  };
  
  // 重置高亮
  const resetHighlight = () => {
    graph.graphData().nodes.forEach((node: any) => {
      const nodeObject = node.__threeObj;
      if (nodeObject) {
        nodeObject.children[0].material.emissive.setHex(0x000000);
        nodeObject.children[0].material.emissiveIntensity = 0;
      }
    });
  
    graph.graphData().links.forEach((link: any) => {
      link.__lineObj.material.color.setHex(0xffffff);
      link.__lineObj.material.opacity = 0.2;
    });
  };
  
  const handleResize = () => {
    if (graph && containerRef.value) {
      graph.width(width.value);
      graph.height(height.value);
    }
  };
  
  // 创建文字画布
  const createTextCanvas = (text: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
  
    const fontSize = 24;
    ctx.font = `${fontSize}px Sans-Serif`;
  
    // 设置画布大小
    const textWidth = ctx.measureText(text).width;
    canvas.width = textWidth + 4;
    canvas.height = fontSize + 4;
  
    // 重新设置字，因为改变画布大小会重置上下文
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
    return canvas;
  };
  
  // 解析 GraphML 数据
  const parseGraphML = async (url: string) => {
  try {
    const response = await fetch(url);
    const graphmlString = await response.text();
    const result = xml2js(graphmlString, { compact: true });
    const graph = result.graphml.graph;

    const nodes = graph.node.map((node: any) => ({
      id: node._attributes.id,
      label: node._attributes.id,
    }));

    const links = graph.edge.map((edge: any) => ({
      source: edge._attributes.source,
      target: edge._attributes.target,
    }));

    return { nodes, links };
  } catch (error) {
    console.error('Error parsing GraphML:', error);
    return { nodes: [], links: [] };
  }
};
  
  // 实现拖拽功能
  const drag = (simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) => {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
  
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
  
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  
    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };
  
  // 添加一个加载锁
  const isRendering = ref(false);
  
  // 修改 renderGraph 函数
  const renderGraph = async () => {
    // 如果正在渲染，直接返回
    if (isRendering.value) {
      console.log('Already rendering, skipping...');
      return;
    }

    try {
      isRendering.value = true;
      console.log('Start rendering, is3D:', is3D.value);

      if (!containerRef.value) return;

      if (is3D.value) {
        d3.select(containerRef.value).selectAll("svg").remove();
        if (ForceGraph3D.value) {
          await render3DGraph();
        }
      } else {
        if (graph) {
          graph._destructor();
          graph = null;
        }
        await render2DGraph(containerRef.value);
      }
    } finally {
      isRendering.value = false;
      console.log('Finished rendering');
    }
  };
  
  // 合并所有的监听到一个函数
  const handleStateChange = async () => {
    // 等待 DOM 更新
    await nextTick();
    await renderGraph();
  };
  
  // 简化监听逻辑，只保留必要的监听
  watch(is3D, async (newValue) => {
    if (newValue && !ForceGraph3D.value) {
      const module = await import('3d-force-graph');
      ForceGraph3D.value = module.default;
    }
    await handleStateChange();
  }, { flush: 'post' });
  
  // 监听全屏状态
  watch(isenlarge, handleStateChange, { flush: 'post' });
  
  // 组件挂载时
  onMounted(async () => {
    console.log("组件挂载完成");
    await handleStateChange();
  });
  
  // 组件卸载时确保清理
  onUnmounted(() => {
    if (graph) {
      graph._destructor();
      graph = null;
    }
    if (containerRef.value) {
      d3.select(containerRef.value).selectAll("*").remove();
    }
    window.removeEventListener('resize', handleResize);
  });
  
  // 切换全屏显示
  const toggleEnlarge = () => {
    isenlarge.value = !isenlarge.value;
  };
  
  // 切换2D/3D显示
  const toggle2D3D = () => {
    is3D.value = !is3D.value;
  };
  
  // 监听容器大小变化
  watch([width, height], async () => {
    if (!is3D.value && containerRef.value) {
      const svg = d3.select(containerRef.value).select("svg");
      if (!svg.empty()) {
        const containerWidth = containerRef.value.clientWidth;
        const containerHeight = containerRef.value.clientHeight;
        const width = Math.max(containerWidth, 800);
        const height = Math.max(containerHeight, 600);
        
        svg
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("viewBox", [0, 0, width, height])
          .attr("preserveAspectRatio", "xMidYMid meet");
      }
    }
  });
  
  </script>
  
  <style scoped>
  /* 图形包装器样式 */
  .graph-wrapper {
    position: relative;
    width: 100%;
    height: 600px;
    min-width: 800px;
  }
  
  /* 图形容器样式 */
  .graph-container {
    width: 100%;
    height: 100%;
    min-height: 600px;
    min-width: 800px;
    background: #000;
    position: relative;
    overflow: hidden;
    flex: 1; /* 让容器填充剩余空间 */
  }
  
  /* 确保全屏模式下的尺寸正确 */
  .fullscreen .graph-container {
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    min-width: 100vw;
  }
  
  /* 全屏样式 */
  .fullscreen {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 10000;
  }
  
  /* 控制面板样式 */
  .control-panel {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10001; /* 确保控制面板始终在最上层 */
  }
  
  /* 放大按钮样式 */
  .enlarge-button {
    color: #bbb;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.5); /* 添加半透明背景 */
    /* padding: 5px; */
    border-radius: 4px;
    display: inline-block;
  }
  
  /* 全屏模式下的放大按钮样式 */
  .enlarge-button_full_screen {
    color: #fff;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.5); /* 添加半透明背景 */
    padding: 5px;
    border-radius: 4px;
    display: inline-block;
    margin-top: 8vh;
    margin-right: 1vw;
  }
  
  /* 控制按钮样式 */
  .control-button {
    width: 3rem;
    height: 3rem;
    text-align: center;
    line-height: 2rem;
    color: #bbb;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 5px;
    border-radius: 4px;
    display: inline-block;
    margin-left: 10px;
  }
  
  /* 全屏模式下的控制按钮样式 */
  .control-button-fullscreen {
    color: #fff;
    margin-top: 8vh;
    margin-right: 1vw;
  }
  
  .parent-container {
    width: 100%;
    height: 100%;
    min-height: 600px;
    display: flex;
  }
  
  /* 确保父容器也有正确的高度 */
  :deep(.parent-container) {
    height: 100%;
    min-height: 600px;
    display: flex;
    flex-direction: column;
  }
  </style>
  