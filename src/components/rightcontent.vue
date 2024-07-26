<template>
  <div class="content">
    <a-row>
      <!-- <search></search> -->
       <search2 />
      <div
        style="
          display: flex;
          flex-direction: column-reverse;
          width: 100%;
          max-height: 868px;
          overflow-y: auto;
        "
        class="scroll-container"
        ref="scrollContainer"
        v-loading="loading"
      >
        <login></login>
         <!-- <login2/> -->
        <block/>
        <blockTop/>
      </div>
    </a-row>
  </div>
</template>

<script setup lang="ts">
// import search from "./rightComponents/search.vue";
import search2 from "./rightComponents/search2.vue"
import login from "./rightComponents/login.vue";
import login2 from "./rightComponents/login2.vue"
import block from "./rightComponents/block.vue"
import blockTop from "./rightComponents/blockTop.vue";
import mitts from "../utils/bus.js";

import { ref, watch, nextTick } from "vue";
// import { useStore } from "vuex";
// const store = useStore();
const scrollContainer = ref(null);
const loading = ref(false)
mitts.on("params",async () => {
  // console.log(123132213)
  await nextTick();
  //设置滚动条
  // if (scrollContainer.value) {
    console.log(document.getElementsByClassName("scroll-container")[0].scrollHeight,"44")
    document.getElementsByClassName("scroll-container")[0].scrollTo({
      top: -117400000
    })
    // scrollContainer.value.scrollTo({
      // top: -scrollContainer.value.scrollHeight,
      // top: -200,
    // });
  // }
})
// watch(store.state.list, async () => { 
//   
// });
</script>

<style scoped>
.content {
  margin: 24px;
  background-color: #f6f6f6;
  width: 100%;
}
</style>