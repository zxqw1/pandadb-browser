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
    <pre v-for="(item, index) in list" :key="index" style="
    margin-bottom: 10px;
    padding: 10px; 
    background-color: rgb(251, 251, 251);
    border-bottom: 1px solid #000000;">
          {{ dataJson }}
    </pre>
      </el-col>
  
    </el-row>
  </div>

</template>

<script setup lang="ts">
import {  ref,toRaw,watch } from 'vue';
const props = defineProps({
  tableData: Object,
});
let list = ref(toRaw(props.tableData.data.item.result.records))
const dataJson = ref('')
watch(props, (newValue, oldValue) => {
   list.value = toRaw(props.tableData.data.item.result.records)
   list.value.map(item=>{
   dataJson.value = JSON.stringify(item._fields,null,2)
})
});


// console.log(list)
let jsonCode = JSON.stringify(list, null, 2);

</script>

<style scoped>
.hljs json{
  padding: 0;
}
</style>