<template>
  <el-tabs
    v-model="tabsName"
    @tab-click="tabsClick"
    :tab-position="tabPosition"
    style="height: 960px"
    class="demo-tabs Leftmenu"
    >
    <el-tab-pane name="首页" :disabled="loginelse">
      <template #label>
        <span
          class="custom-tabs-label"
          style="display: flex; flex-direction: column">
          <HomeOutlined style="width: 1em; height: 1em" />
          <span>首页</span>
        </span>
      </template>
      <!--首页内容  -->
      <div v-if="tabsName" class="content">
        <!-- <home /> -->
        <home2/>
      </div>
    </el-tab-pane>
    <el-tab-pane name="偏好" :disabled="loginelse">
      <template #label>
        <span
          class="custom-tabs-label"
          style="display: flex; flex-direction: column">
          <StarOutlined />
          <span>偏好</span>
        </span>
      </template>
      <div v-if="tabsName" class="content">
      <favorate/>
      </div>
    </el-tab-pane>
    <el-tab-pane name="教程" :disabled="loginelse">
      <template #label>
        <span
          class="custom-tabs-label"
          style="display: flex; flex-direction: column"
        >
          <BookOutlined />
          <span>教程</span>
        </span>
      </template>
      <div v-if="tabsName" class="content"><guides /></div>
    </el-tab-pane>
    <el-tab-pane name="帮助" :disabled="loginelse">
      <template #label>
        <span
          class="custom-tabs-label"
          style="display: flex; flex-direction: column"
        >
          <InfoCircleOutlined />
          <span>帮助</span>
        </span>
      </template>
      <div v-if="tabsName" class="content">
        <help />
      </div>
    </el-tab-pane>
    <el-tab-pane name="设置" :disabled="loginelse">
      <template #label>
        <span
          class="custom-tabs-label"
          style="display: flex; flex-direction: column"
        >
          <ToolOutlined />
          <span>设置</span>
        </span>
      </template>
      <div v-if="tabsName" class="content"><setter/></div>
    </el-tab-pane>
    <el-tab-pane name="关于我们" :disabled="loginelse">
      <template #label>
        <span
          class="custom-tabs-label"
          style="display: flex; flex-direction: column"
        >
          <CustomerServiceFilled />
          <span>关于我们</span>
        </span>
      </template>
      <div v-if="tabsName" class="content"><about/></div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { TabsInstance } from "element-plus";
// 导入icon
import {
  HomeOutlined,
  StarOutlined,
  BookOutlined,
  InfoCircleOutlined,
  ToolOutlined,
  CustomerServiceFilled,
} from "@ant-design/icons-vue";
// import home from "./menuComponents/home.vue";
import home2 from "./menuComponents/home2.vue";
import guides from "./menuComponents/guides.vue";
import help from "./menuComponents/help.vue";
import about from "./menuComponents/about.vue";
import setter from "./menuComponents/setter.vue";
import favorate from "./menuComponents/Favorate.vue"
const tabPosition = ref<TabsInstance["tabPosition"]>("left");
// 左导航
let tabsName = ref<string | undefined>(undefined);
const tabsClick = (value: any, value2: any) => {
  if (tabsName.value === value2.target.innerText) {
    tabsName.value = undefined;
  } else {
    tabsName.value = value2.target.innerText;
  }
};
// 判断是否登录
const loginelse = ref<boolean>(false) 
if(window.localStorage.getItem("username") === null){
  loginelse.value = true
}else{
  loginelse.value = false
}
</script>
<style scoped>
.el-tab-pane {
  display: flex;
}
.el-tabs {
  background-color: #ffffff;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
  height: calc(100%-72px) !important;
}

.custom-tabs-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
}
.content {
  width: 300px;
}
</style>
<style>
.Leftmenu .el-tabs__header {
  margin-right: 0 !important;
}
.Leftmenu .el-tabs__item {
  height: 76px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center !important;
}
.Leftmenu .el-tabs__item.is-active {
  color: #6a8322 !important;
  background-color: #f8ffe3;
}
.Leftmenu .el-tabs__item:hover {
  color: #6a8322;
}
.Leftmenu .el-tabs__active-bar {
  background-color: #6a8322;
}
</style>