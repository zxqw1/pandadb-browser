<template>
  <el-tabs :tab-position="tabPosition" style="height: 200px;" class="demo-tabs graphMenu">
    <el-tab-pane label="graph">
      <!-- {{ data.item.result.records[0]._fields }} -->
      <!-- graph标题 -->
      <template #label>
        <span style="display: flex; flex-direction: column;align-items: center">
          <img src="../../../assets/img/图谱.png" alt="" 
          style="
          width: 24px; 
          height: 24px;">
        <span style="font-weight:600;color: #666666;" class="graph">graph</span>
        </span>
      </template>
      <!-- 图 -->
      <graph :graphData="data" ref="graphRef"/>
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
        <div style="font-weight:600;color: #666666;">table</div>
        </div>
      </template>
      <!-- 表 -->
      <Ttable :tableData="{ data }"/> 
    </el-tab-pane>
    <el-tab-pane label="text">
      <!-- text标题 -->
      <template #label>
        <div>
          <img src="../../../assets/img/文字.png" alt="" 
          style="
          width: 24px; 
          height: 24px;">
        <div style="font-weight:600;color: #666666;">text</div>
        </div>
      </template>
      <Ttext :textData="{data}"/>
    </el-tab-pane>
    <el-tab-pane label="code">
      <template #label>
        <div>
          <img src="../../../assets/img/代码.png" alt="" 
          style="
          width: 24px; 
          height: 24px;">
        <div style="font-weight:600;color: #666666;">code</div>
        </div>
      </template>
    <Tcode :codeData="{data}"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
// 引入组件
// import graph from "./components/graph.vue";
import Ttable from "./components/Ttable.vue";
import Ttext from "./components/Ttext.vue";
import Tcode from "./components/Tcode.vue"
import { ref, watch } from "vue";
import { defineProps } from "vue";
import type { TabsInstance } from "element-plus";
import Table from "ant-design-vue/es/table/Table";
const tabPosition = ref<TabsInstance["tabPosition"]>("left");
const props = defineProps({
  data: Object,
});
console.log(props.data.item.result.records[0]._fields,73)
watch(props, (newValue, oldValue) => {
// console.log(graphRef.value,75)
  // this.$refs.graph.graphChange(props.data)
  // graphRef.value.graphChange(666);
});

</script>
<style scoped>


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
