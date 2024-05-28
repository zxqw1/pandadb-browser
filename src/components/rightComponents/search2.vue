<template>
  <div
    class="search"
    :style="{
      width: isFullscreen ? '100vw' : '100%',
      height: isFullscreen ? '100vh' : '100%',
      position: isFullscreen ? 'fixed' : 'static',
      top: isFullscreen ? '0' : 'auto',
      left: isFullscreen ? '0' : 'auto',
      zIndex: isFullscreen ? '9999' : 'auto',
    }"
  >
    <el-row>
      <!-- position: relative; -->
      <el-col :span="22" style="display: flex; align-items: center">
        <!-- 输入框 -->
        <div
          class="searchBlock"
          style="
            background-color: #f6f6f6;
            width: 100%;
            border-radius: 5px;
            border: 1px dashed #d2dabb;
            min-height: 32px;
          "
          :style="{
            height: isFullscreen ? '98vh' : 'auto',
            position: isFullscreen ? 'relative' : 'static',
          }"
          @keydown.enter.prevent="handleEnter"
        >
          <!-- logo -->
          <img
            src="../../assets/img/logos.png"
            style="width: 44px; height: 30px"
            :style="{
              position: isFullscreen ? 'absolute' : 'static',
              top: isFullscreen ? '10px' : '',
            }"
            alt=""
          />
          <!-- 真实输入 -->
          <div
            contenteditable="true"
            style="width: 90%;"
            :style="{
              position: isFullscreen ? 'absolute' : 'static',
              top: isFullscreen ? '10px' : '',
            }"
            class="searchText"
          ></div>
          <!-- 展示 -->
          <CaretRightOutlined
            style="color: #6a8322; font-size: 28px"
            :style="{ position: isFullscreen ? 'absolute' : 'static',
              top: isFullscreen ? '10px' : '',
              right:isFullscreen ? '10px' : ''}"
          />
        </div>
      </el-col>
      <el-col
        :span="2"
        style="
          padding: 0 10px;
          display: flex;
          align-items: center;
          justify-content: space-around;
        "
      >
        <ExpandAltOutlined
          style="font-size: 20px"
          @click="toggleFullScreen"
          v-if="!isFullscreen"
        />
        <ShrinkOutlined
          style="font-size: 20px"
          @click="toggleFullScreen"
          :style="{
            position: isFullscreen ? 'absolute' : 'static',
            top: isFullscreen ? '10px' : '',
          }"
          v-else
        />
        <CloseOutlined
          style="font-size: 20px"
          :style="{
            position: isFullscreen ? 'absolute' : 'static',
            top: isFullscreen ? '10px' : '',
            right: isFullscreen ? '10px' : '',
          }"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  CaretRightOutlined,
  ExpandAltOutlined,
  CloseOutlined,
  ShrinkOutlined,
} from "@ant-design/icons-vue";
const isFullscreen = ref<boolean>(false);
// 全屏
const toggleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value;
};
// import { ref, onMounted, computed } from 'vue';
// import cypher from "../../assets/cypher.js"
// import hljs from 'highlight.js';
// 注册 Cypher 语言
// hljs.registerLanguage('cypher', cypher);
</script>

<style scoped>
.search {
  width: 100%;
  background-color: #ffffff;
  padding: 14px 16px 24px;
}
.searchBlock {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-wrap: break-word;
}
.searchText:focus {
  outline: none;
}
</style>