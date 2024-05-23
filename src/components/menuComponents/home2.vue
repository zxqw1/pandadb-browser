<template>
  <!-- <h1>12345</h1> -->
  <div class="home" style="padding: 18px 26px">
    <!-- 标题 -->
    <div class="titleS">
      <div class="icon"></div>
      <span style="font-size: 20px; color: #333333; font-weight: 600"
        >数据库基本信息</span
      >
    </div>
    <!-- 内容 -->
    <a-row style="display: flex; flex-direction: column">
      <!-- 数据库选择 -->
      <a-col style="margin-top: 30px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">数据库选择</div>
      </a-col>
      <a-col>
        <a-select
          ref="select"
          v-model:value="value1"
          style="width: 100%; margin-top: 18px"
          @change="handleChange"
        >
          <a-select-option
            v-for="(item, index) in dataBase"
            :key="index"
            :value="item.name"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-col>
      <!-- 节点标签 -->
      <a-col style="margin-top: 30px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">节点标签</div>
      </a-col>
      <a-col style="margin-top: 24px; cursor: pointer;">
        <a-tag color="green" @click="labelShow(list[0].nodes[0])" > *({{ list[0].nodes[0].nodes.length }})</a-tag>
        <a-tag color="pink" v-for="(item,index) in list[0].nodes[0].nodes " :key="index" style="margin-left: 10px;"
        @click="labelShow({type:'node',item,isShowFlag: false})"
       >
          {{ item.category }}
        </a-tag>
      </a-col>
      <!-- 关系类型 -->
      <a-col style="margin-top: 30px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">关系类型</div>
      </a-col>
      <a-col style="margin-top: 24px">
        <a-tag color="green"> *({{ list[0].nodes[0].lines.length }})</a-tag>
        <a-tag color="pink" v-for="(item,index) in list[0].nodes[0].lines" :key="index" style="margin-left: 10px;">
          {{ item.text }}
        </a-tag>
      </a-col>
      <!-- 属性值 -->
      <a-col style="margin-top: 30px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">属性值</div>
      </a-col>
      <a-col style="margin-top: 24px">
        <a-tag color="green"> *({{list[0].nodes[0].lines.length }})</a-tag>
        <a-tag color="pink" v-for="(item,index) in list[0].nodes[0].lines" :key="index" style="margin-left: 10px;">
          {{ item.text }}
        </a-tag>
      </a-col>
      <!-- 连接库信息 -->
      <a-col style="margin-top: 30px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">连接库信息</div>
      </a-col>
      <a-col>
        <div>
          用户名：{{ list[0].username }}
        </div>
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
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import dataBase from "../../data/dataBase";
import { useStore } from "vuex";import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
let list = ref(dataBase.filter((item) => {
    return item.name === "dataBase";
  }) )

// 关系列表
// const lineList = list.value[0].nodes[0].lines
const value1 = ref("database");
// 默认数据库为dataBase 
onMounted(() => {
  list.value = dataBase.filter((item) => {
    return item.name === "dataBase";
  });
});

// 选择数据库
const handleChange = (value: string) => {
  list.value = dataBase.filter((item) => {
    return item.name === value;
  });
  ElMessageBox.alert('您已切换数据库', '提示', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: '好的'
  })
};
const store = useStore();
// 点击展示节点关系
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

<style scopes>

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
.point {
  display: flex;
  flex-direction: column;
}
</style>