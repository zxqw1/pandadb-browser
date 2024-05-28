<template>
  <div class="home" style="padding: 18px 26px">
    <!-- 标题 -->
    <div class="titleS">
      <div class="icon"></div>
      <span style="font-size: 20px; color: #333333; font-weight: 600">
        数据库基本信息</span
      >
    </div>
    <!-- 内容 -->
    <a-row style="display: flex; flex-direction: column">
      <!-- 数据库选择 -->
      <a-col style="margin-top: 20px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">数据库选择</div>
      </a-col>
      <a-col
        style="margin-top: 20px; display: flex; align-items: center"
        class="sele"
      >
        <el-select v-model="value" placeholder="Select" style="width: 240px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </a-col>
      <!-- 节点标签 -->
      <a-col style="margin-top: 20px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">节点标签</div>
      </a-col>
      <a-col style="margin-top: 20px">
        <a-tag color="green"> *(123)</a-tag>
        <a-tag color="pink" style="margin-left: 10px"> comment </a-tag>
      </a-col>
      <!-- 关系类型 -->
      <a-col style="margin-top: 20px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">关系类型</div>
      </a-col>
      <a-col style="margin-top: 20px">
        <a-tag>*(1234)</a-tag>
        <a-tag>CONTAINER_OF</a-tag>
      </a-col>
      <!-- 属性值 -->
      <a-col style="margin-top: 20px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">属性值</div>
      </a-col>
      <a-col style="margin-top: 20px">
      <a-tag>`1234`</a-tag>
      </a-col>
      <!-- 连接库信息 -->
      <a-col style="margin-top: 30px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">连接库信息</div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const value = ref("");

const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
];
</script>

<style scoped>
.Property:hover{
    background-color: #aaaaaa;
    color: #000;
    cursor: pointer;
}
</style>
<style>
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
</style>