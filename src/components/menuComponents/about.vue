<template>
  <div class="title">
    <div class="titleS">
      <div class="icon"></div>
      <span style="font-size: 20px; color: #333333; font-weight: 600"
        >关于我们</span
      >
    </div>
    <a-row
      v-for="(item, index) in aboutList"
      :key="index"
      style="display: flex; flex-direction: column"
    >
      <!-- 小标题 -->
      <a-col class="about" style="display: flex; align-items: center;margin-top: 24px;" >
        <div class="circle"></div>
        <div class="name">{{ item.title }}</div>
      </a-col>
      <!-- 内容 -->
      <a-col v-show="item.type === 'made'" class="text">
        {{ item.data }}
      </a-col>
      <a-col v-show="item.type === 'run'"class="text" v-for="(item2,index2) in item.data" :key="index2">
        {{ item2 }}
      </a-col>
      <a-col v-show="item.type === 'License'"class="text">
        {{ item.data }}
      </a-col>
      <a-col v-show="item.type === 'thanks'"class="text">
        {{ item.data }}
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import aboutList from "../../data/about";
</script>

<style scoped>
.title {
  margin: 18px 26px;
}
.titleS {
  display: flex;
  align-items: center;
  
}
.text{
  font-size: 14px;
  color: #666666;
  margin-top: 12px;
  margin-right: 14px;
}
</style>