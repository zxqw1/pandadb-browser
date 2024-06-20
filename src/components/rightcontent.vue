<template>
  <div class="content">
    <a-row>
      <search></search>
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
      >
        <login></login>
        <block3 />
        <!-- :scrollDom="scrollContainer" -->
      </div>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import search from "./rightComponents/search.vue";
import login from "./rightComponents/login.vue";
import block3 from "./rightComponents/block3.vue";
import {
  ref,
  watch,
  nextTick,
} from "vue";
import { useStore } from "vuex";
const store = useStore();
const scrollContainer = ref(null);
watch(store.state.list, async () => {
  await nextTick();
  //设置滚动条
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: -scrollContainer.value.scrollHeight
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