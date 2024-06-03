<template>
  <div style="padding: 10px; height: 338px; overflow-y: scroll;"> 
   <el-row style="border: 1px dashed #666666">
    <el-col class="td">
      {{ textList[0].keys[0] }}
    </el-col>
    <el-col v-for="(item,index) in textList" :key="index" class="td"> 
    {{ item._fields[0].labels[0 ] }}{{ item._fields[0].properties }}
    </el-col>
   </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref,toRaw, watch } from 'vue';
const props = defineProps({
  textData: Object, 
});
// console.log(props.textData.data.uten,19)
const textList = ref(props.textData.data.item.result.records)
watch(props, (newValue, oldValue) => {
   textList.value = props.textData.data.item.result.records
});
</script>

<style scoped>
table{
				border: 1px solid black;
        height: 306px;
        overflow-y: scroll;
			}
			
			.td{
				border-bottom: 1px dashed black;
        font-size: 14px;
        color: #666666;
        padding: 10px;
			}
</style>