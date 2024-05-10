<template>
  <div class="home" style="margin: 18px 26px">
    <div class="titleS">
      <div class="icon"></div>
      <span style="font-size: 20px; color: #333333; font-weight: 600"
        >数据库基本信息</span>
    </div>
    <a-row
      v-for="(item, index) in homeList"
      :key="index"
      style="display: flex; flex-direction: column"
    >
    <!-- 标题 -->
      <a-col style="margin-top: 30px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">{{ item.title }}</div>
      </a-col>
      <!-- 连数据库连接选择 -->
      <a-col>
        <a-select
          v-if="item.type === 'select'"
          style="width: 100%; margin-top: 18px"
          placeholder="请选择"
        ></a-select>
      </a-col>
      <!-- 节点标签 -->
      <a-col>
        <a-checkable-tag
          v-show="item.type === 'tag'"
          v-for="(item2, index2) in item.class"
          :key="index2"
          color="pink"
          bordered="true"
          style="background-color: antiquewhite; border: 1px pink solid"
          @click="labelShow(item2.name)"
          >{{ item2.name }}</a-checkable-tag
        >
      </a-col>
      <!-- 关系类型 -->
      <a-col>
        <a-tag
          color="#f50"
          style="cursor: pointer"
          v-show="item.type === 'tag2'"
          v-for="(item3, index3) in item.relationship"
          :key="index3"
          @click="labelShow(item3)"
          >{{ item3 }}</a-tag
        >
      </a-col>
      <!-- 属性值 -->
      <a-col>
        <a-tag
          color="orange"
          style="cursor: pointer"
          v-show="item.type === 'tag3'"
          v-for="(item4, index4) in item.label"
          :key="index4"
          @click="labelShow(item4)"
          >{{ item4 }}</a-tag
        >
      </a-col>
      <!-- 连接库信息 -->
      <a-col>
        <div
          v-show="item.type === 'text'"
          v-for="(item5, index5) in item.data"
          :key="index5"
        >
          用户名：{{ item5 }}
         <div
         style="
         font-size: 14px;
         color: #6a8322;
         font-weight: 600;
         text-decoration: underline;
         margin-top: 10px;
         cursor: pointer;
         "
         @click="disconnect"
         >断开连接</div>
        </div>
      </a-col>
      <!-- 系统介绍 -->
     <div v-show="item.type === 'text2'" >
      <!-- {{ item }} -->
      <div>群集角色：{{ item.clusterRole }}</div>
      <div>版本介绍：{{ item.version }}</div>
      <div>版本：{{ item.edition }}</div>
      <div>用户名：{{ item.username }}</div>
      <div>基本信息：
        <span style="
        font-weight: 600; 
        color: #6a8322;
        text-decoration: underline;
        cursor: pointer;"
        @click="labelShow(item.information)"
        >点击查看</span>
      </div>
     </div>
      <a-col>

      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import homeList from "../../data/home";
import { useStore } from "vuex";
const store = useStore();
//点击展示节点关系
const labelShow = (value: any) => {
  store.commit("increment", value);
};
// 断开连接
const disconnect = ()=>{
  window.localStorage.removeItem('username')
  window.localStorage.removeItem('password')
  location.reload()
}
</script>

<style scope>
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
</style>
