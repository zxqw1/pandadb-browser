<template>
  <div class="content">
    <a-row>
      <search></search>
      <div style="display: flex; flex-flow: row wrap !important;width: 100%;height: 868px; overflow-y: scroll;">
        <block style="margin-bottom: 16px;"></block>
        <login></login>
        <!-- <relationGraphVue/> -->
      </div>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import search from "./rightComponents/search.vue";
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