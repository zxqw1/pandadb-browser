<template>
  <div style="overflow: hidden;">
  <a-row>
    <!-- 顶部 -->
    <a-col :span="24">
      <headerNav></headerNav>
    </a-col>
    <!-- 顶部 -->
    <a-col :span="24">
      <!-- 左面导航 -->
      <a-col :span="24" style="display: flex;">
        <LeftMenu></LeftMenu>
        <RightContent></RightContent>
      </a-col>
      <!-- 左面导航 -->
      <!-- 右面内容 -->
      <!-- <a-col :span="19"> -->
        <!-- style="flex: 1; max-width:100%; display: flex;" -->
      <!-- </a-col> -->
      <!-- 右面内容 -->
    </a-col>
  </a-row>

  </div>
</template>

<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import headerNav from "../components/header.vue";
import LeftMenu from "../components/menu.vue";
import RightContent from "../components/rightcontent.vue";
import { onMounted } from "vue";

// };
// 判断是否登录
// onMounted(()=>{
//   if(window.localStorage.getItem("username") === null){
//     ElMessageBox.alert('您还未登录，请先登录', '提示', {
//     confirmButtonText: 'OK'
//   })
//   }
// })
</script>

<style scoped>
.ant-row {
  background-color: rgb(246, 246, 246);
  height: 100%;
}
.ant-col:nth-child(2) {
  /* display: flex; */
}
</style>
<style>
.el-button--primary{
  background-color: #6a8322;
  border: 1px solid #6a8322 ;
}
.el-button--primary:hover{
  background-color: #6a8322;
  border: none;
}
</style>