<template>
  <div class="content">
    <a-row>
      <search2></search2>
      <div style="display: flex; flex-direction: column; width: 100%;height: 868px; overflow-y: scroll;">
        <block style="margin-bottom: 16px;"></block>
        <login></login>
        <!-- <relationGraphVue/> -->
      </div>
    </a-row>
  </div>
</template>

<script setup lang="ts">
// import search from "./rightComponents/search.vue";
import search2 from "./rightComponents/search2.vue"
import login from "./rightComponents/login.vue";
import block from "./rightComponents/block.vue"; 
// import relationGraphVue from "./rightComponents/relation-graph.vue";
</script>

<style scoped>
.content {
  margin: 24px;
  background-color: #f6f6f6;
  width: 100%;
}
</style>