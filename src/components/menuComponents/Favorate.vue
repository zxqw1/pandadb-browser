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
        <a-directory-tree
          v-model:expandedKeys="expandedKeys"
          v-model:selectedKeys="selectedKeys"
          multiple
          :tree-data="treeData"
        ></a-directory-tree>
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

const expandedKeys = ref<string[]>(['0-0', '0-1']);
const selectedKeys = ref<string[]>([]);
const treeData: TreeProps['treeData'] = [
  {
    title: 'newfolder',
    key: '0-0',
    children: [
      {
        title: 'leaf 0-0',
        key: '0-0-0',
        isLeaf: true,
      },
      // {
      //   title: 'leaf 0-1',
      //   key: '0-0-1',
      //   isLeaf: true,
      // },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      // {
      //   title: 'leaf 1-0',
      //   key: '0-1-0',
      //   isLeaf: true,
      // },
      // {
      //   title: 'leaf 1-1',
      //   key: '0-1-1',
      //   isLeaf: true,
      // },
    ],
  },
];
</script>

<style scoped>

/* 修改被选中节点的背景颜色 */
.ant-tree-node-content-wrapper:not(.ant-tree-node-disabled):focus-within,
.ant-tree-node-content-wrapper:not(.ant-tree-node-disabled):hover {
  background-color: #6a8322; /* 你想要的任何颜色 */
}
</style>