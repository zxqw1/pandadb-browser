<template>
<div style="padding:0 10px 10px 10px 10px; height: 338px; overflow-y: scroll; background-color: #ffffff">
<el-row>
  <el-col style=" 
  font-size: 16px; 
  color:#666666 ;
  height: 32px; 
  background-color: #ffffff;
  border-bottom: 1px #999999 dashed;
  padding-left: 16px;
  position: sticky;
  top: 0;
  ">
    {{ list[0].keys[0] }}
  </el-col>
 
  <el-col >
    <div v-for="(item, index) in list" :key="index" style="margin-bottom: 10px;padding: 10px; background-color: #f5f5f5;">
      {{ dataJson }}
     </div>
  </el-col>
  
</el-row>
</div>

</template>

<script setup lang="ts">
import 'highlight.js/styles/stackoverflow-light.css';// 可以切换其它样式风格，例如黑色主题
import 'highlight.js/lib/common';
import hljsVuePlugin from "@highlightjs/vue-plugin";
import { onMounted,  ref,toRaw,watch } from 'vue';
 const props = defineProps({
  tableData: Object, 
});
let list = ref(toRaw(props.tableData.data.item.records))
const dataJson = ref('')
watch(props, (newValue, oldValue) => {
   list.value = toRaw(props.tableData.data.item.records)
   list.value.forEach(item=>{
   dataJson.value = JSON.stringify(item._fields,null,3)
})
});


// console.log(list)
let jsonCode = JSON.stringify(list, null, 2);

</script>

<style scoped>

</style>