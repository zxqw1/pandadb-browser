<template>
  <div class="home" style="padding: 18px 26px">
    <!-- 标题 -->
    <div class="titleS">
      <div class="icon"></div>
      <span style="font-size: 20px; color: #333333; font-weight: 600">
        数据库基本信息</span
      >
    </div>
    <!-- 内容 -->
    <a-row style="display: flex; flex-direction: column">
      <!-- 数据库选择 -->
      <a-col style="margin-top: 20px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">数据库选择</div>
      </a-col>
      <a-col
        style="margin-top: 20px; display: flex; align-items: center"
        class="sele"
      >
        <el-select v-model="value" placeholder="Select" style="width: 240px">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </a-col>
      <!-- 节点标签 -->
      <a-col style="margin-top: 20px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">节点标签</div>
      </a-col>
      <a-col style="margin-top: 20px">
        <a-tag color="rgb(145, 149, 160)" style="cursor: pointer" @click="labelShow">
          *(3,181,724)</a-tag
        >
        <a-tag
          :color=item.color
          style="margin-left: 10px; margin-top: 10px; cursor: pointer"
          v-for="(item, index) in dataBase[0].nodes"
          :key="index"
          @click="graphShow($event, item.color)"
        >
          {{ item.text }}
        </a-tag>
      </a-col>
      <!-- 关系类型 -->
      <a-col style="margin-top: 20px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">关系类型</div>
      </a-col>
      <a-col style="margin-top: 20px">
        <a-tag 
        style=""
        @click="relationShow()">*(17,256,038)</a-tag>
        <a-tag 
        style="margin-left: 10px; margin-top: 10px; cursor: pointer"
        v-for="(item, index) in dataBase[0].Relationship"
        :key="index"
        >{{ item }}</a-tag>
      </a-col>
      <!-- 属性值 -->
      <a-col style="margin-top: 20px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">属性值</div>
      </a-col>
      <a-col style="margin-top: 20px">
        <a-tag 
        style="margin-left: 10px; margin-top: 10px; cursor: pointer"
        v-for="(item,index) in  dataBase[0].Property" :key="index">{{ item }}</a-tag>
      </a-col>
      <!-- 连接库信息 -->
      <a-col style="margin-top: 30px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">连接库信息</div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import {  ref } from "vue";
import dataBase from "@/data/dataBase";
import request from "../../utils/request.js";
import { useStore } from "vuex";
    // 展示节点
    const store = useStore();
    const value = ref("");
    const options = [
      {
        value: "Option1",
        label: "Option1",
      },
      {
        value: "Option2",
        label: "Option2",
      },
    ];
    // 节点展示全局
  const labelShow = (color) => {
      let promiseData = request.fetchData(
        "neo4j",
        "bigdata",
        "MATCH (n) RETURN n LIMIT 25"
      );
      promiseData
        .then((result: any) => {
          console.log(result,"节点的数据")
          store.commit("increment", {color,result});
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
    // 节点展示部分
    const graphShow = (event, color)=>{
      let promiseData = request.fetchData(
        "neo4j",
        "bigdata",
        `MATCH(n:${event.target.innerText})RETURN n LIMIT 25`
      );
      promiseData
        .then((result: any) => {
          console.log(result,124)
          store.commit("increment", {color,result});
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
    // 关系
    const relationShow = ()=>{
      let promiseData = request.fetchData(
        "neo4j",
        "bigdata",
        // `MATCH p=()-->() RETURN p LIMIT 25`
        `MATCH p=(Message)-->(Person) RETURN p LIMIT 1`
      );
      promiseData
        .then((result: any) => {
          console.log(result,"关系的数据")
          store.commit("increment", {color: "red", result});
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  

</script>

<style scoped>
.Property:hover {
  background-color: #aaaaaa;
  color: #000;
  cursor: pointer;
}
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
</style>