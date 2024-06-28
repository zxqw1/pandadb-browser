<template>
  <div
    class="search"
    :style="{
      height: isFullscreen ? '100vh' : 'auto',
      padding: isFullscreen ? '20px' : 'auto',
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
            height: isFullscreen ? '100vh' : 'auto',
            position: isFullscreen ? 'relative' : 'static',
          }"
        >
          <!-- logo -->
          <img
            src="../../assets/img/logos.png"
            style="width: 44px; height: 30px"
            :style="{
              position: isFullscreen ? 'absolute' : 'static',
              top: isFullscreen ? '10px' : 'auto',
            }"
            alt=""
          />
          <!-- 真实输入 -->
          <input
            type="text  "
            autosize
            v-model="context"
            style="width: 96%; font-size: 16px;color: #666666;background-color: rgb(246, 246, 246);border: none;"
            class="searchText"
            :style="{
              position: isFullscreen ? 'absolute' : 'static',
              top: isFullscreen ? '10px' : 'auto',
              right: isFullscreen ? '10px' : 'auto',
            }"
          />
          <!-- <div
            contenteditable="true"
            style="width: 96%"
            class="searchText"
            @blur="handleBlur"
            :style="{
              position: isFullscreen ? 'absolute' : 'static',
              top: isFullscreen ? '10px' : 'auto',
              right: isFullscreen ? '10px' : 'auto',
            }"
          >
            {{ context }}
          </div> -->
          <!-- 展示 -->
          <CaretRightOutlined
            style="color: #6a8322; font-size: 28px"
            :style="{
              position: isFullscreen ? 'absolute' : 'static',
              top: isFullscreen ? '10px' : 'auto',
              right: isFullscreen ? '10px' : 'auto',
            }"
            @click="nodeShow"
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
          style="font-size: 20px; position: absolute; top: 10px"
          @click="toggleFullScreen"
          v-else
        />
        <CloseOutlined
          style="font-size: 20px"
          :style="{
            position: isFullscreen ? 'absolute' : 'static',
            top: isFullscreen ? '10px' : 'auto',
            right: isFullscreen ? '10px' : 'auto',
          }"
          @click="deleteClick"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

import {
  CaretRightOutlined,
  ExpandAltOutlined,
  CloseOutlined,
  ShrinkOutlined,
} from "@ant-design/icons-vue";
import { ElMessageBox } from "element-plus";
import request from "../../utils/request.js";
import { useStore } from "vuex";
import { el, type he } from "element-plus/es/locale/index.mjs";
import { autoCompleteProps } from "ant-design-vue/es/auto-complete/index.js";
const store = useStore();
const isFullscreen = ref<boolean>(false);
const context = ref("");
// 全屏
const toggleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value;
};
//删除
const deleteClick = () => {
  context.value = "";
};
const nodeShow = async () => {
  await nextTick();
  if (context.value === "") {
  } else {
    const startTime = performance.now();
    let promiseData = request.fetchData("neo4j", "admin", context.value);
    promiseData
      .then((result: any) => {
        const endTime = performance.now();
        const responseTime = endTime - startTime
        result.resTime = Math.round(responseTime) +'ms'
        store.commit("increment", result);
      })
      .catch((error: any) => {
        console.log(error, 106);
        ElMessageBox.alert(error, "错误提示", {
          confirmButtonText: "好的",
        });
      });
    context.value = "";
  }
};
</script>

<style scoped>
.search {
  width: 100%;
  background-color: #ffffff;
  padding: 14px 16px;
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