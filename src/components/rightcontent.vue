<template>
  <div class="content" style="width: 100%; min-width: 50%;">
    <a-row>
      <!-- <search></search> -->
      <search />
      <div
        style="
          display: flex;
          flex-direction: column;
          width: 99%;
          max-height: 860px;
          overflow-y: auto;
        "
        class="scroll-container"
        ref="scrollContainer"
      >
        <!-- <login2/> -->
        <!-- <blockTop /> -->
        <block />
        <login></login>

      </div>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import search from "./rightComponents/search.vue";
import login from "./rightComponents/login.vue";
import block from "./rightComponents/block.vue";
// import blockTop from "./rightComponents/blockTop.vue";
// import mitts from "../utils/bus.js";
import { ref, watch, nextTick } from "vue";
import { useStore } from "vuex";
const store = useStore();
const scrollContainer = ref(null);
// const loading = ref(false);
// watch(store.state.list, () => {
//   // await nextTick();
//   //设置滚动条
//   // console.log("设置滚动条")
//   if (scrollContainer.value) {
//     scrollContainer.value.scrollTo({
//       top: -scrollContainer.value.scrollHeight,
//     });
//   }
// });

</script>

<style scoped>
.content {
  margin: 24px;
  background-color: #f6f6f6;
  width: 100%;
}
</style>