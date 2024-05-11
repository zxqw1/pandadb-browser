<template>
  <div class="title">
    <div class="titleS">
      <div class="icon"></div>
      <span style="font-size: 20px; color: #333333; font-weight: 600"
        >设置</span
      >
    </div>
    <!-- 内容 -->
    <a-row v-for="(item, index) in setterList" :key="index">
      <a-col class="setter" style="display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">{{ item.title }}</div>
      </a-col>
      <a-col v-if="item.type === 'theme'">
        <h1>我是主题</h1>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import setterList from "../../data/setter";
</script>

<style scoped>
.title {
  margin: 18px 26px;
}
.titleS {
  display: flex;
  align-items: center;
}
</style>