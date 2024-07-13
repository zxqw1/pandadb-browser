<template>
  <div class="favorate" style="padding: 18px 26px">
    <!-- 标题 -->
    <div class="titleS">
      <div class="icon"></div>
      <span style="font-size: 20px; color: #333333; font-weight: 600"
        >偏好</span
      >
    </div>
    <!-- 内容 -->
    <a-row style="display: flex; flex-direction: column">
      <a-col style="margin-top: 30px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">本地</div>
      </a-col>
      <a-col>
      </a-col>
      <a-col style="margin-top: 30px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">示例</div>
      </a-col>
      <a-col>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue';
import { ref } from 'vue';


</script>

<style scoped>

/* 修改被选中节点的背景颜色 */
.ant-tree-node-content-wrapper:not(.ant-tree-node-disabled):focus-within,
.ant-tree-node-content-wrapper:not(.ant-tree-node-disabled):hover {
  background-color: #6a8322; /* 你想要的任何颜色 */
}
</style>