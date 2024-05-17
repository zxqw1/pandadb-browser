<template>
  <div style="width: 100%; height: 100%">
    <div
      style="
        border: #efefef solid 1px;
        height: 100%;
        width: 100%;
        overflow-y: scroll;
      "
    >
      <relation-graph ref="graphRef$" :options="options" />
      <div>
        <!-- {{ data }} -->
      </div>
    </div>
  </div>
</template>
  
  <script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import RelationGraph from "relation-graph/vue3";
import { defineProps, toRefs,toRaw } from "vue";
const props = defineProps({
  data: Object,
});
// console.log(props,26)
const arr:any = ref([]);
watch(props, () => {
  if (props.data.item.type === "node") {
    // props.data.item.item.lines = arr
    // console.log(props.data.item.item.lines)
    // console.log(props.data.item.item.liness)
  }
  graphRef$.value.setJsonData(props.data.item.item);
});
const graphRef$ = ref<RelationGraph>();
const options = {
  defaultExpandHolderPosition: "right",
};
onMounted(() => {
  if (props.data.item.type === "node") {
    props.data.item.item.lines = [];
  }
  // console.log(props.data.item,32)
  graphRef$.value.setJsonData(props.data.item.item); //重要
  // The graphRef$.value.setJsonData(jsonData, callback) method is a convenient method that is equivalent to the following code:
  //  const graphInstance = graphRef$.value.getInstance();
  //  graphInstance.addNodes(jsonData.nodes);
  //  graphInstance.addLines(jsonData.lines);
  //  graphInstance.rootNode = graphInstance.getNodeById(jsonData.rootId);
  //  await graphInstance.doLayout(); // Layout using the layouter set in graphOptions
  //  await graphInstance.moveToCenter(); // Find the center based on node distribution and center the view
  //  await graphInstance.zoomToFit(); // Zoom to fit, so that all nodes can be displayed in the visible area
});
</script>