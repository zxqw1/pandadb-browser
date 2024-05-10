<template>
  <div class="title">
    <!-- 标题 -->
    <div class="titleS">
      <div class="icon"></div>
      <span style="font-size: 20px; color: #333333; font-weight: 600">教程</span>
    </div>
    <a-row v-for="(item, index) in guides" :key="index">
      <a-col>
        {{ item.promop }}
      </a-col>
      <a-col class="guide">
        <div class="circle"></div>
        <div class="name">{{ item.Builts.title }}</div>
      </a-col>
      <a-col
        v-for="(item2, index2) in item.Builts.data"
        :key="index2"
        class="point"
      >
        <a href="" style="color: #6a8322;text-decoration: underline;">{{ item2.introduce }}</a>
        <div>{{ item2.explain }}</div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import guides from "../../data/guides";
</script>

<style scoped>
.title {
  margin: 18px 26px;
}
.titleS {
  display: flex;
  align-items: center;
}
.icon {
  width: 4px;
  height: 20px;
  background-color: #6a8322;
  border-radius: 5px;
  margin-right: 10px;
}
.guide {
  display: flex;
  align-items: center;
}
</style>
<style>
.circle {
  width: 9px;
  height: 9px;
  background-color: #6a8322;
  border-radius: 50%;
}
.name {
  font-size: 16px;
  margin-left: 12px;
}
.point {
  display: flex;
  flex-direction: column;
}
</style>