<template>
  <div
    style="
      margin-top: 24px;
      height: 424px;
      width: 100%;
      background-color: #ffffff;
    "
    v-for="(item, index) in store.state.list"
    :key="index"
  >
    {{ item }}
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
const store = useStore();
</script>

<style scoped>
</style>

