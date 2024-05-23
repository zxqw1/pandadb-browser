<template>
<h1>table</h1>
<!-- {{ data.data.item.item.nodes }} -->
<div v-for="(item,index) in data.data.item.item.nodes" 
key="index" 
style="
width: 80%;
background-color: #e5e5e5;
margin-top: 16px
;
">
{{ item }}
<json-viewer :value="jsonData" copyable boxed sort />
</div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
 const props = defineProps({
  data: Object,
});
const list = props.data.data.item.item.nodes
// console.log(list)
const jsonData = []
onMounted(()=>{
    list.forEach(item=>{
const jsonData = reactive(item);
})
})


</script>

<style scoped>

</style>