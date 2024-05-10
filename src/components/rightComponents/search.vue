<template>
  <div style="width: 100%">
    <div
      class="search"
      :style="{
        width: isFullscreen ? '100vw' : 'auto',
        height: isFullscreen ? '100vh' : 'auto',
        position: isFullscreen ? 'fixed' : 'static',
        top: isFullscreen ? '0' : 'auto',
        left: isFullscreen ? '0' : 'auto',
        zIndex: isFullscreen ? '9999' : 'auto',
      }"
    >
      <div class="bgSearch">
        <img
          v-show="!isFullscreen"
          src="../../assets/img/logos.png"
          alt=""
          style="position: absolute; z-index: 1; width: 46px; height: 30px ;top:1%"
        />
        <img
          v-show="isFullscreen"
          src="../../assets/img/logos.png"
          alt=""
          style="position: absolute; z-index: 1; top: 10px; width: 46px; height: 30px"
        />
        <a-textarea
          v-show="!isFullscreen"
          v-model:value="value1"
          placeholder="请输入"
          auto-size
          style="
            background-color: #f6f6f6;
            border: 1px #d2dabb dashed;
            padding:  0 38px;
            width: 100%;
          "
        />
        <a-textarea
          v-show="isFullscreen"
          v-model:value="value1"
          placeholder="请输入"
          style="
            height: 100vh;
            background-color: #f6f6f6;
            border: 1px #d2dabb dashed;
            padding: 0 36px ;
            width: 100%;
          "
        />
        <StarOutlined
        v-show="!isFullscreen"
          style="
            position: absolute;
            top: 5%;
            right: 28px;
            z-index: 1;
            font-size: 16px;
            color: #666666;
          "
        />
        <StarOutlined
        v-show="isFullscreen"
          style="
            position: absolute;
            top:15px;
            right: 28px;
            z-index: 1;
            font-size: 16px;
            color: #666666;
          "
        />
        <CaretRightOutlined
        v-show="!isFullscreen"
          style="
            position: absolute;
            top: 3%;
            right: 2px;
            font-size: 24px;
            z-index: 1;
            color: #6a8322;
          "
        />
        <CaretRightOutlined
        v-show="isFullscreen"
          style="
            position: absolute;
            top:  1%;;
            right: 2px;
            font-size: 24px;
            z-index: 1;
            color: #6a8322;"
        />
      </div>

      <ExpandAltOutlined
      v-show="!isFullscreen"
        style="font-size: 20px; color: #666666;position: absolute; top: 5%; right: 90px;"
        v-if="!isFullscreen"
        @click="toggleFullScreen"
      />
      <ShrinkOutlined
        style="font-size: 20px; color: #666666;position: absolute; top: 1%; right: 5%; "
        v-else
        @click="toggleFullScreen"
      />
      <CloseOutlined style="font-size: 20px; color: #666666;position: absolute; top: 5%; right: 50px;" @click="clear" v-show="!isFullscreen"/>
      <CloseOutlined style="font-size: 20px; color: #666666;position: absolute; top: 1%; right: 2%;" @click="clear" v-show="isFullscreen"/>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
// 导入icon
import {
  StarOutlined,
  CaretRightOutlined,
  ExpandAltOutlined,
  CloseOutlined,
  ShrinkOutlined,
} from "@ant-design/icons-vue";
const value1 = ref<string>("");
const isFullscreen = ref<boolean>(false);
// 全屏
const toggleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value;
};
//取消全屏

//清空
const clear = () => {
  // console.log(value1.value)
  value1.value = "";
};
</script>

<style scoped>
.search {
  width: 100%;
  background-color: #ffffff;
  padding: 18px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bgSearch {
  position: relative;
  width: 93%;
  display: flex;
  align-items: center;
  /* background-color: #ffffff; */
}
.CaretRightOutlined {
  width: 50px;
  height: 50px;
}
.ExpandAltOutlined:hover {
  color: #6a8322 !important;
}
</style>