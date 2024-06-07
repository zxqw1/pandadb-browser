<template>
   <div style="border: #efefef solid 1px; height:324px;width: 100%;">
      <relation-graph ref="graphRef$" :options="options" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import RelationGraph from 'relation-graph/vue3'
const graphRef$ = ref<RelationGraph>()
const options = {
  defaultExpandHolderPosition: 'right'
}
const props = defineProps({
  graphData: Object, 
});
console.log(props)
const graphList = ref({
  rootId:'a',
  nodes: [],
  lines: [],
});
watch(props,()=>{
  const records = props.graphData.item.result.records;
  let color = props.graphData.item.color
    if (records[0]._fields[0].properties.browserUsed) {
      graphList.value.nodes = records.map((item) => {
        return {
          id: item._fields[0].elementId,
          text: item._fields[0].properties.browserUsed,
          color: color,
        };
      });
    } else if (records[0]._fields[0].properties.name) {
      graphList.value.nodes = records.map((item) => {
        return {
          id: item._fields[0].elementId,
          text: item._fields[0].properties.name,
          color: color,
        };
      });
    }
  // }
  graphRef$.value.setJsonData(graphList.value);
})
onMounted(() => {
  console.log(graphRef$,"121")
  graphRef$.value.setJsonData(graphList.value);
});
</script>

<style>

</style>