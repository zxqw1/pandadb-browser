<template>
  <div style="height: 100%">
    <!-- {{ data }} -->
    <div style="height: 100%; width: 100%; display: flex; position: relative">
      <!-- 图 -->
      <relation-graph ref="graphRef$" :options="options" />
      <!-- {{ graphData }} -->
      <!-- overview按钮 -->
      <el-button
        type="primary"
        :icon="ArrowLeftBold"
        style="
          position: absolute;
          right: 15px;
          background-color: #dcdcdc36;
          border: 1px #f3f3f3 solid !important;
          color: #999999;
        "
        v-if="!overview"
        @click="expandOverview"
      />
      <!-- overview展开面板 -->
      <div
        style="
          width: 300px;
          height: 316px;
          background-color: #ffffff;
          margin-right: 15px;
          box-shadow: rgba(52, 58, 67, 0.1) 0px 0px 2px,
            rgba(52, 58, 67, 0.1) 0px 0px 2px,
            rgba(52, 58, 67, 0.08) 0px 1px 4px;
          border: 1px solid rgb(235, 235, 235);
        "
        v-else
      >
        <ArrowRightBold
          style="
            width: 14px;
            height: 14px;
            position: absolute;
            right: 22px;
            top: 12px;
            cursor: pointer;
          "
          @click="expandOverview"
        />
        <div
          style="
            width: 100%;
            height: 36px;
            line-height: 36px;
            padding: 0 12px;
            border-bottom: 1px solid rgb(233 233 233);
            font-size: 14px;
            font-weight: 600;
          "
        >
          纵览
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRaw, watch } from "vue";
import RelationGraph from "relation-graph/vue3";
import { ArrowRightBold, ArrowLeftBold } from "@element-plus/icons-vue";
const graphRef$ = ref<RelationGraph>();
const props = defineProps({
  graphData: Object,
});
const graphList = ref({
  nodes: [],
  lines: [],
});
watch(props, (oldValue, newValue) => {
  const records = props.graphData.data.item.records;
  records.forEach((item) => {
    if(item._fields[0].properties.browserUsed){
      graphList.value.nodes.push({
      id: item._fields[0].elementId,
      text: item._fields[0].properties.browserUsed,
    });
    }else{
      graphList.value.nodes.push({
      id: item._fields[0].elementId,
      text: item._fields[0].properties.name,
    });
    }
   
  });
  graphRef$.value.setJsonData(graphList.value);
});

// console.log(graphList.value,67)
const overview: Ref<boolean> = ref(false);
// 节点数据
const options = {
  defaultExpandHolderPosition: "right",
};
const expandOverview = () => {
  overview.value = !overview.value;
};
// options.allowAutoLayoutIfSupport = false
onMounted(() => {
  graphRef$.value.setJsonData(graphList.value);
});
</script>

<style scoped>
.relation-graph .rel-toolbar-v-center {
    top: calc((100% - 240px) / 2) !important;
}
</style>

