<template>
  <div
    class="home"
    style="
      padding: 18px 0 0 26px;
      height: calc(100vh - 70px);
      overflow-y: auto;
    "
  >
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
        <a-tag
          color="rgb(145, 149, 160)"
          style="cursor: pointer"
          @click="labelShow"
        >
          *(908,224)</a-tag
        >
        <a-tag
          :color="getNodeColor(item.text)"
          style="margin-left: 10px; margin-top: 10px; cursor: pointer"
          v-for="(item, index) in dataBase[0].nodes"
          :key="index"
          @click="graphShow($event)"
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
        <a-tag style="cursor: pointer" @click="relationShow($event)"
          >*(17,256,038)</a-tag
        >
        <a-tag
          style="margin-left: 10px; margin-top: 10px; cursor: pointer"
          v-for="(item, index) in dataBase[0].Relationship"
          :key="index"
          @click="relationClick($event)"
          >{{ item }}</a-tag
        >
      </a-col>
      <!-- 属性值 -->
      <!-- <a-col style="margin-top: 20px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">属性值</div>
      </a-col>
      <a-col style="margin-top: 20px">
        <a-tag
          style="margin-left: 10px; margin-top: 10px; cursor: pointer"
          v-for="(item, index) in dataBase[0].Property"
          :key="index"
          @click="keysClick($event)"
          >{{ item }}</a-tag
        >
      </a-col> -->
      <!-- 连接库信息 -->
      <a-col style="margin-top: 30px; display: flex; align-items: center">
        <div class="circle"></div>
        <div class="name">连接库信息</div>
      </a-col>
      <el-col style="margin-top: 12">
        <div style="margin-top: 8px">
          <span style="font-size: 16px; color: #333; font-weight: 500"
            >username:</span
          >
          <span style="margin-left: 14px">{{ username }}</span>
        </div>
        <div style="margin-top: 8px">
          <span style="font-size: 16px; color: #333; font-weight: 500"
            >address:</span
          >
          <span style="margin-left: 14px">{{ address }}</span>
        </div>
        <div
          style="
            margin-top: 8px;
            font-size: 16px;
            color: #6a8322;
            font-weight: 500;
            text-decoration: underline;
            cursor: pointer;
          "
          @click="disconnectClick"
        >
          disconnect
        </div>
      </el-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ref ,watch } from "vue";
import dataBase from "@/data/dataBase";
import mitts from "../../utils/bus.js";
const username = window.localStorage.getItem("username");
const address = window.localStorage.getItem("address");
// 展示节点
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

//断开连接
const disconnectClick = () => {
  window.localStorage.removeItem("username"),
    window.localStorage.removeItem("password"),
    window.localStorage.removeItem("address"),
    location.reload();
};
//节点标签颜色
const getNodeColor = (key) => {
  const color = window.localStorage.getItem(key + "color")
    ? window.localStorage.getItem(key + "color")
    : "rgb(145, 149, 160)";
  return color;
};
//节点展示全部
const labelShow = () => {
  const startTime = performance.now()
  fetch("http://10.0.82.146:7601", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: "MATCH (n) RETURN n LIMIT 25",
  })
    .then((response) => response.text())
    .then((data) => {
      const endTime = performance.now()
      const responseTime = endTime - startTime
      const result = {};
      result.records = [];
      result.summary = {};
      result.summary.query = {};
      result.summary.server = {};
      console.log(JSON.parse(data), "data");
      result.resTime = Math.round(responseTime) + 'ms'
      const data2 = JSON.parse(data);
      data2.response.forEach((value, key) => {
        const keys = Object.keys(value);
        for (let key in value) {
          result.records.push({ keys: keys, _fields: [value[key]] });
        }
      });
      result.summary.query.text = data2.query;
      result.summary.server.address = "http://10.0.82.146:7601";
      result.summary.server.agent = "PandaDB";
      console.log(result);
      mitts.emit("params", result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
//节点展示部分
const graphShow = (e) => {
  const startTime = performance.now();
  fetch("http://10.0.82.146:7601", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: `MATCH (n:${e.target.innerText}) RETURN n LIMIT 25`,
  })
    .then((response) => response.text())
    .then((data) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      console.log(JSON.parse(data), "data");
      const result = {};
      result.records = [];
      result.summary = {};
      result.summary.query = {};
      result.summary.server = {};
      result.resTime = Math.round(responseTime) + "ms";
      const data2 = JSON.parse(data);
      data2.response.forEach((value, key) => {
        const keys = Object.keys(value);
        for (let key in value) {
          result.records.push({ keys: keys, _fields: [value[key]] });
        }
      });
      result.summary.query.text = data2.query;
      result.summary.server.address = "http://10.0.82.146:7601";
      result.summary.server.agent = "PandaDB";
      console.log(result);
      mitts.emit("params", result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
//关系展示全部
const relationShow = (e) => {
  const startTime = performance.now();
  fetch("http://10.0.82.146:7601", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: `MATCH p=()-->() RETURN p LIMIT 25`,
  })
    .then((response) => response.text())
    .then((data) => {
      const endTime = performance.now();
      const result = {};
      result.records = [];
      result.summary = {};
      result.summary.query = {};
      result.summary.server = {};
      const data2 = JSON.parse(data);
      result.resTime = Math.round(responseTime) + "ms";
      data2.response.forEach((value, key) => {
        const keys = Object.keys(value);
        for (let key in value) {
          result.records.push({ keys: keys, _fields: [value[key]] });
        }
      });
      result.summary.query.text = data2.query;
      result.summary.server.address = "http://10.0.82.146:7601";
      result.summary.server.agent = "PandaDB";
      console.log(result);
      mitts.emit("params", result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
//关系展示部分
const relationClick = (e) => {
  const startTime = performance.now();
  fetch("http://10.0.82.146:7601", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: `MATCH p=()-[r:${e.target.innerText}]->() RETURN p LIMIT 25`,
  })
    .then((response) => response.text())
    .then((data) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      console.log(JSON.parse(data), "data");
      const result = {};
      result.records = [];
      result.summary = {};
      result.summary.query = {};
      result.summary.server = {};
      const data2 = JSON.parse(data);
      result.resTime = Math.round(responseTime) + "ms";
      console.log(data2)
      data2.response.forEach((value, key) => {
        const keys = Object.keys(value);
        for (let key in value) {
          result.records.push({ keys: keys, _fields: [value[key]] });
        }
      });
      result.summary.query.text = data2.query;
      result.summary.server.address = "http://10.0.82.146:7601";
      result.summary.server.agent = "PandaDB";
      console.log(result);
      mitts.emit("params", result);
    })
    .catch((error) => {
      console.error("Error:", error);
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