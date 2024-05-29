<template>
  <el-tabs :tab-position="tabPosition" style="height: 200px;" class="demo-tabs graphMenu">
    <el-tab-pane label="graph">
      <!-- graph标题 -->
      <template #label>
        <span style="display: flex; flex-direction: column;align-items: center">
          <img src="../../../assets/img/图谱.png" alt="" 
          style="
          width: 24px; 
          height: 24px;">
        <span style="font-weight:600;color: #666666;" class="graph">图谱</span>
        </span>
      </template>
      <!-- 图 -->
      <graph :graphData ="{data}"/>
      <!-- {{ data }} -->
    </el-tab-pane>
    <el-tab-pane label="table">
      <!-- table标题 -->
      <template #label>
        <div>
          <img src="../../../assets/img/表格.png" alt="" 
          style="
          width: 24px; 
          height: 24px;">
        <div style="font-weight:600;color: #666666;">表格</div>
        </div>
      </template>
      <!-- 表 -->
      <Ttable :tableData="{data}"/> 
      <!-- <div>{{ data }}</div> -->
    </el-tab-pane>
    <el-tab-pane label="text">
      <!-- text标题 -->
      <template #label>
        <div>
          <img src="../../../assets/img/文字.png" alt="" 
          style="
          width: 24px; 
          height: 24px;">
        <div style="font-weight:600;color: #666666;">文字</div>
        </div>
      </template>
      <!-- <Ttext/> -->
    </el-tab-pane>
    <el-tab-pane label="code">
      <template #label>
        <div>
          <img src="../../../assets/img/代码.png" alt="" 
          style="
          width: 24px; 
          height: 24px;">
        <div style="font-weight:600;color: #666666;">编码</div>
        </div>
      </template>
      <!-- <h1>code</h1> -->
    </el-tab-pane>
  </el-tabs>
  <!-- graph -->
</template>
<script setup lang="ts">
// 引入组件
// import graph from "./components/graph.vue";
import Ttable from "./components/Ttable.vue";
import Ttext from "./components/Ttext.vue";
import {  ref,watch } from "vue";
import { defineProps } from "vue";
import type { TabsInstance } from "element-plus";
import Table from "ant-design-vue/es/table/Table";
const tabPosition = ref<TabsInstance["tabPosition"]>("left");
const props = defineProps({
  data: Object,
});
watch(props, (newValue, oldValue) => {
console.log(props.data,75)
});

</script>
<style  scoped>


</style>
<style>
.graphMenu .el-tabs__item{
  height: 72px;
}
.graphMenu .el-tabs__item.is-active{
  color: #6a8322 !important;

}
.graphMenu .el-tabs__active-bar{
  --el-tabs-header-height: 72px;
  background-color: #6a8322;
}
.graphMenu .el-tabs__content{
  height: 100%;
}
.graphMenu .el-tab-pane{
  height: 100%;
}


</style>
