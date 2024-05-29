<template>
<div>
<!-- {{ tableData }} -->
<el-row>
  <el-col style=" 
  font-size: 16px; 
  color:#666666 ;
  height: 32px; 
  border-bottom: 1px #999999 dashed;
  padding-left: 16px;
  position: sticky;
  top: 0;
  ">
    {{ list[0].keys[0] }}
  </el-col>
 
  <el-col style="height: 306px; overflow-y: scroll;">
    <div v-for="(item, index) in list" :key="index" style="margin-bottom: 10px; background-color: #f5f5f5;">
      {{ item._fields }}
     </div>
  </el-col>
  
</el-row>
</div>

</template>

<script setup lang="ts">
import 'highlight.js/styles/stackoverflow-light.css';// 可以切换其它样式风格，例如黑色主题
import 'highlight.js/lib/common';
import hljsVuePlugin from "@highlightjs/vue-plugin";
import { onMounted,  ref,toRaw } from 'vue';
 const props = defineProps({
  tableData: Object,
});
const list = toRaw(props.tableData.data.item.records)
// console.log(list)
let jsonCode = JSON.stringify(list, null, 2);

</script>

<style scoped>

</style>