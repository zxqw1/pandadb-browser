<template>
  <div class="content">
    <a-row>
      <!-- <search></search> -->
      <search />
      <div
        style="
          display: flex;
          flex-direction: column-reverse;
          width: 99%;
          max-height: 860px;
          overflow-y: auto;
        "
        class="scroll-container"
        ref="scrollContainer"
        v-loading="loading"
      >
        <login></login>
        <!-- <login2/> -->
        <block />
        <blockTop />
      </div>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import search from "./rightComponents/search.vue";
import login from "./rightComponents/login.vue";
import block from "./rightComponents/block.vue";
import blockTop from "./rightComponents/blockTop.vue";
// import mitts from "../utils/bus.js";
import { ref, watch, nextTick } from "vue";
import { useStore } from "vuex";
const store = useStore();
const scrollContainer = ref(null);
const loading = ref(false);
watch(store.state.list, async () => {
  await nextTick();
  //设置滚动条
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: -scrollContainer.value.scrollHeight,
    });
  }
});
</script>

<style scoped>
.content {
  margin: 24px;
  background-color: #f6f6f6;
  width: 100%;
}
</style>