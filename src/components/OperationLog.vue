<template>
  <div class="content" style="width: 100%; min-width: 50%; position: relative; z-index: 2;padding: 24px;">
    <el-row>
      <el-col style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;">
        <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
        <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">操作日志</div>
      </el-col>
      <el-col style="margin-top: 10px;">
        <div style="margin-top: 10px;">
          <span
            style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
          <span style="font-size: 15px; font-weight: bold;">筛选</span>
        </div>
        <el-row style="display: flex;align-items: flex-end;">
          <el-col :span="10">
            <div style="margin-top: 10px;">
              <div>
                <span class="demonstration">操作时间：</span>
                <el-date-picker v-model="value1" type="datetimerange" start-placeholder="开始时间" end-placeholder="结束时间"
                  format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd" time-format="A hh:mm:ss" />
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div style="margin-top: 10px;">
              <div>
                <span class="demonstration">操作类型：</span>
                <el-select v-model="value" placeholder="请选择" style="width: 240px">
                  <el-option label="查询" value="query" />
                  <el-option label="插入" value="insert" />
                  <el-option label="更新" value="update" />
                  <el-option label="删除" value="del" />
                  <el-option label="其他" value="other" />
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="siftclick">确定</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col style="margin-top: 10px;">
        <div style="margin-bottom: 10px;">
          <span
            style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
          <span style="font-size: 15px; font-weight: bold;">日志</span>
        </div>
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column fixed prop="key" label="操作时间" />
          <el-table-column prop="userName" label="用户名" />
          <el-table-column prop="operationType" label="操作类型" />
          <el-table-column prop="operationContent" label="操作内容" />
        </el-table>
      </el-col>
      <el-col style="margin-top: 20px; display: flex; flex-direction: row-reverse;">
        <el-pagination background layout="prev, pager, next" :total="1000" @current-change="handleCurrentChange" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import getManageInfo from "../utils/manageRequest"
const value1 = ref('')
const value = ref('')
const tableData = ref([])
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

onMounted(async () => {
  const queryId = generateRandomId()
  const OperationLogUrl = replaceOrAddUrlPath(url,"/operationLog")
  console.log(OperationLogUrl,'93')
  const querytext = {
    "startTime": "",
    "endTime": "",
    "operationType": "",
    "queryId":queryId,
    "pageSize": 10,
    "currentPage": 1  
  }
   const data = await getManageInfo(OperationLogUrl,"POST",JSON.stringify(querytext))
  tableData.value = data.response
})
// 筛选
const siftclick = async ()=>{
  const OperationLogUrl = replaceOrAddUrlPath(url,"/operationLog")
  const querytext = {
    "startTime": value1.value[0] ? value1.value[0]: "",
    "endTime": value1.value[1] ? value1.value[1] : "",
    "operationType": value.value ? value.value : "",
    "queryId":generateRandomId(),
    "pageSize": 10,
    "currentPage": 1  
  }
  const data = await getManageInfo(OperationLogUrl,"POST",JSON.stringify(querytext))
  tableData.value = data.response
}
//分页
const handleCurrentChange = async (val: number)=>{
  const OperationLogUrl = replaceOrAddUrlPath(url,"/operationLog")
  const querytext = {
    "startTime": value1.value[0] ? value1.value[0] :"" ,
    "endTime": value1.value[1] ? value1.value[0] : "",
    "operationType": value.value ? value.value : "",
    "queryId":generateRandomId(),
    "pageSize": 10,
    "currentPage": val  
  }
  const data = await getManageInfo(OperationLogUrl,"POST",JSON.stringify(querytext))
  tableData.value = data.response
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