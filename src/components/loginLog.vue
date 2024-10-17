<template>
  <div class="content" style="width: 100%; min-width: 50%; position: relative; z-index: 2;padding: 24px;">
    <el-row>
      <el-col style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;">
        <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
        <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">登录日志</div>
      </el-col>
      <el-col style="margin-top: 10px;">
        <div style="margin-top: 10px;">
          <span
            style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
          <span style="font-size: 15px; font-weight: bold;">筛选</span>
        </div>
        <el-row style="display: flex;align-items: flex-end;">
          <el-col :span="6">
            <div style="margin-top: 10px;">
              <div>
                <span class="demonstration">用户名：</span>
                <el-input v-model="userName" style="width: 80%;margin-top: 4px;" placeholder="请输入用户名" />
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" style="margin-left: 6px;" @click="siftClick">查询</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col style="margin-top: 10px;">
        <div style="margin-bottom: 10px;">
          <span
            style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
          <span style="font-size: 15px; font-weight: bold;">日志</span>
        </div>
        <el-table :data="tableData" max-height="630">
          <el-table-column fixed prop="type" label="类型">
            <template #default="scope">
              <el-tag type="primary"    color="rgb(236 255 165)" style="border: none; color: #6c7d2e;">{{scope.row.type === "login" ? "登录" : "登出"}}</el-tag>
            </template>
            </el-table-column>
            <el-table-column prop="time" label="登录/登出时间" />
            <el-table-column prop="userName" label="用户名" />
            <el-table-column prop="addressIp" label="客户端IP" />
        </el-table>
      </el-col>
      <el-col style="margin-top: 20px; display: flex; flex-direction: row-reverse;">
        <el-pagination background layout="prev, pager, next" :total="page.totalRow"
          @current-change="handleCurrentChange" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import getManageInfo from "../utils/manageRequest"
const userName = ref('')
const tableData = ref([])
const page = ref({})
let url = window.localStorage.getItem("address")//地址
function replaceOrAddUrlPath(ipWithMaybePath, newPath) {
  // 检查IP地址中是否包含'/'（除了最后一个字符可能是':'的情况）  
  // 这里假设IP地址格式正确，并且':'只出现在端口号之前  
  const hasPath = ipWithMaybePath.includes('/') && !ipWithMaybePath.endsWith(':');
  if (hasPath) {
    // 如果包含路径，则替换最后一个'/'及其后面的所有内容  
    return ipWithMaybePath.replace(/\/[^\/]*$/, `${newPath}`);
  } else {
    // 如果没有路径，则直接添加新路径  
    return `${ipWithMaybePath}/${newPath}`;
  }
}
const generateRandomId = () => {
  const timestamp = new Date().getTime(); // 获取当前时间戳
  const randomNum = Math.floor(Math.random() * 1000); // 生成一个0-999之间的随机数
  return `id_${timestamp}_${randomNum}`; // 返回拼接后的ID字符串
};
const timeConversion = (timestamp) => {
  const date = new Date(timestamp)
  // 提取年、月、日、时、分、秒  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需加1，并补零  
  const day = String(date.getDate()).padStart(2, '0'); // 补零  
  const hours = String(date.getHours()).padStart(2, '0'); // 补零  
  const minutes = String(date.getMinutes()).padStart(2, '0'); // 补零  
  const seconds = String(date.getSeconds()).padStart(2, '0'); // 补零
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate
}
onMounted(async () => {
  const loginLogUrl = replaceOrAddUrlPath(url, '/loginLog')
  const loginLogquery = {
    'userName': window.localStorage.getItem("username") ? window.localStorage.getItem("username") : "",
    "queryId": generateRandomId(),
    'pageSize': 10,
    'currentPage': 1
  }
  const loginLogData = await getManageInfo(loginLogUrl, "POST", JSON.stringify(loginLogquery))
  tableData.value = loginLogData.response
  tableData.value.forEach(item => {
    item.time = timeConversion(Number(item.time))
  })
  page.value = loginLogData.page
})
//分页
const handleCurrentChange = async (val: number) => {
  const loginLogUrl = replaceOrAddUrlPath(url, '/loginLog')
  const loginLogquery = {
    'userName': userName.value === "" ? window.localStorage.getItem("username") ? window.localStorage.getItem("username") : "" : userName.value,
    "queryId": generateRandomId(),
    'pageSize': 10,
    'currentPage': val
  }
  // const loginLogText = loginLogUrl + "?" + JSON.stringify(loginLogquery)
  const loginLogData = await getManageInfo(loginLogUrl, "POST", JSON.stringify(loginLogquery))
  tableData.value = loginLogData.response
  tableData.value.forEach(item => {
    item.time = timeConversion(Number(item.time))
  })
  page.value = loginLogData.page
}
//筛选
const siftClick = async () => {
  const loginLogUrl = replaceOrAddUrlPath(url, '/loginLog')
  const loginLogquery = {
    'userName': userName.value,
    "queryId": generateRandomId(),
    'pageSize': 10,
    'currentPage': 1
  }
  // const loginLogText = loginLogUrl + "?" + JSON.stringify(loginLogquery)
  const loginLogData = await getManageInfo(loginLogUrl, "POST", JSON.stringify(loginLogquery))
  tableData.value = loginLogData.response
  tableData.value.forEach(item => {
    item.time = timeConversion(Number(item.time))
  })
  page.value = loginLogData.page
}
</script>

<style scoped>
.content {
  margin: 24px;
  background-color: #ffffff;
  width: 100%;
}

.el-pager.is-active {
  background-color: rgb(108, 125, 46);
}

::v-deep .is-checked .el-checkbox__inner {
  background: #6C7D2E !important;
  border: 1px solid #6C7D2E !important;
}

::v-deep .el-pager .is-active {
  background: #6C7D2E !important;
}

.demonstration {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
}
</style>