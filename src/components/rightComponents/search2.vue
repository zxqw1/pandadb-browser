<template>
  <div
    class="search"
  
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
          
          @keydown.enter.prevent="handleEnter"
        >
          <!-- logo -->
          <img
            src="../../assets/img/logos.png"
            style="width: 44px; height: 30px"
           
            alt=""
          />
          <!-- 真实输入 -->
          <div
            contenteditable="true"
            style="width: 96%;"
            class="searchText"
            @blur="handleBlur"
          >{{ context }}</div>
          <!-- 展示 -->
          <CaretRightOutlined
            style="color: #6a8322; font-size: 28px"
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
          style="font-size: 20px"
          @click="toggleFullScreen"
         
          v-else
        />
        <CloseOutlined
          style="font-size: 20px"
         
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
import request from "../../utils/request.js";
import { useStore } from "vuex";
const store = useStore();
const isFullscreen = ref<boolean>(false);
const context = ref('')
// 全屏
const toggleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value;
};
// 拿到输入数据
const handleBlur = (event)=>{
  context.value = event.target.innerText;
  // console.log(context.value);
}
// const nodeShow = ()=>{
//   // console.log(context.value,92)
  
//   let promiseData = request.fetchData(
//         "neo4j",
//         "bigdata",
//         context.value
//       );
//       promiseData
//         .then((result: any) => {
//           console.log(result,102)
//           store.commit("increment", result);
//         })
//         .catch((error: any) => {
//           console.log(error,106);
//           store.commit("increment", {type:"error",error});
//         });
//       context.value = '';
// }
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