<template>
  <div class="h-full w-full">
    <el-tabs :tab-position="tabPosition" class="demo-tabs">
      <el-tab-pane label="pdf渲染">
        <PdfView :course_url="resource.pdf"/>
      </el-tab-pane>
      <el-tab-pane label="Video渲染">
        <VideoView :course_url="resource.video"/>
      </el-tab-pane>
      <el-tab-pane label="image渲染">
        <ImageView :course_url="resource.image"/>
      </el-tab-pane>
      <el-tab-pane label="audio渲染">
        <AudioView :course_url="resource.audio"/>
      </el-tab-pane>
      <el-tab-pane label="docx渲染">
        <DocxView :course_url="resource.docx"/>
      </el-tab-pane>
      <el-tab-pane label="知识图谱渲染">
        <GraphView :course_url="resource.graph"/>
      </el-tab-pane>
      <el-tab-pane label="文件下载">
        
        <DownloadView :course_url="resource.Download"/>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { TabsInstance } from "element-plus";
import PdfView from "@/components/resource-component/pdf.vue"
import VideoView from "@/components/resource-component/video.vue"
import ImageView from "@/components/resource-component/image.vue"
import AudioView from "@/components/resource-component/audio.vue";
import DocxView from "../components/resource-component/docx.vue";
import GraphView from "@/components/resource-component/graph.vue";
import DownloadView from "@/components/resource-component/Download.vue"
const tabPosition = ref<TabsInstance["tabPosition"]>("left");
const { t:_ } = useI18n();
const router = useRouter();
const resource=reactive({
    pdf:"https://hhzy-knowledge-base.s3.cn-northwest-1.amazonaws.com.cn/shanxicaijing/cn/Basic_knowledge_of_tour_guide/1/1.1/pdf/1.1_The_Struggle_History_of_the_Communist_Party_of_China.pdf",
    video:"https://hhzy-knowledge-base.s3.cn-northwest-1.amazonaws.com.cn/shanxicaijing/cn/Marketing_Practice/7/7.3/video/7.3_Product_Life_Cycle_Strategy.mp4",
    image:"https://guangxuejian.s3.cn-northwest-1.amazonaws.com.cn/%E6%88%91%E8%B6%85%E7%88%B1%E4%B8%8A%E7%8F%AD.jpg",
    audio:"https://guangxuejian.s3.cn-northwest-1.amazonaws.com.cn/%E7%AB%A5%E8%AF%9D%E9%95%87+-+%E6%88%B4%E7%BE%BD%E5%BD%A4.mp3",
    docx:"https://hhzy-knowledge-base.s3.cn-northwest-1.amazonaws.com.cn/shanxicaijing/cn/civil_aviation_service_skills/1/1.1/Supplementary_materials/docx/General_Aviation_Information.docx",
    graph:"https://hhzy-knowledge-base.s3.cn-northwest-1.amazonaws.com.cn/shanxicaijing/%E7%9F%A5%E8%AF%86%E5%9B%BE%E8%B0%B1%E6%96%87%E4%BB%B6/%E9%99%95%E5%95%86%E6%96%87%E5%8C%96/knowledge.graphml",
    Download:"https://hhzy-knowledge-base.s3.cn-northwest-1.amazonaws.com.cn/shanxicaijing/cn/Basic_knowledge_of_tour_guide/1/1.1/pdf/1.1_The_Struggle_History_of_the_Communist_Party_of_China.pdf"
})
</script>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
</style>
