<template>
    <div class="content" style="width: 100%; min-width: 50%; position: relative; z-index: 2;padding: 24px;">
        <el-row>
            <el-col style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;">
                <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
                <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">告警管理</div>
            </el-col>
            <el-col>
                <div style="margin-top: 10px;">
                    <span
                        style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
                    <span style="font-size: 15px; font-weight: bold;">告警记录</span>

                </div>
                <el-row>
                    <el-col>
                        <el-row style="display: flex;align-items: flex-end;">
                            <el-col :span="10">
                                <div style="margin-top: 10px;">
                                    <div>
                                        <span class="demonstration">告警时间：</span>
                                        <el-date-picker v-model="timeValue" type="datetimerange"
                                            start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss"
                                            date-format="YYYY/MM/DD ddd" time-format="A hh:mm:ss"style="width: 80%" />
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div style="margin-top: 10px;">
                                    <div>
                                        <span class="demonstration">告警级别：</span>
                                        <el-select v-model="alarmleveValue" placeholder="请选择" style="width:60%" clearable>
                                            <el-option v-for="item in alarmleveloption" :key="item.value"
                                                :label="item.description" :value="item.value" />
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
                        <el-table :data="tableData" style="width: 100%" border max-height="630">
                            <el-table-column prop="time" label="告警时间" />
                            <el-table-column prop="level" label="告警级别" />
                            <el-table-column prop="content" label="告警内容" />
                            <el-table-column prop="sendType" label="告警信息发送类型" />
                            <el-table-column prop="isSend" label="是否已发送" />
                            <el-table-column prop="sendPath" label="发送地址" />
                            <el-table-column prop="remark" label="备注" />
                        </el-table>
                    </el-col>
                    <el-col style="margin-top: 20px; display: flex; flex-direction: row-reverse;">
                        <el-pagination background layout="prev, pager, next" :total="page.totalRow" @current-change="handleCurrentChange"/>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search, Filter } from '@element-plus/icons-vue'
import getManageInfo from "../utils/manageRequest"
const timeValue = ref('')
const alarmleveValue = ref('')
const tableData = ref([])
const alarmleveloption = ref({})
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
//时间戳转化
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
    //获取告警级别枚举
    const alarmlevelqueryUrl = replaceOrAddUrlPath(url, '/warnLevelTypeList')
    const alarmlevelData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/warnParam/select", "GET")
    // console.log(alarmlevelData.response,'94')
    alarmleveloption.value = alarmlevelData.response.warnLevelType
    //分页查询告警记录
    const warnLogqueryUrl = replaceOrAddUrlPath(url, '/warnLog')
    const warnLogquery = {
        "startTime": "",
        "endTime": "",
        "warnLevel": alarmleveloption.value[0],
        "queryId": generateRandomId(),
        "pageSize": 10,
        "currentPage": 1
    }
    // const warnLogqueryText = warnLogqueryUrl + "?" + JSON.stringify(warnLogquery)
    const warnLogData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/warnLog", "POST",JSON.stringify(warnLogquery))
    tableData.value = warnLogData.response
    tableData.value.forEach(item=>{
        item.time = timeConversion(Number(item.time))
        if(item.level ==='normal'){
            item.level = '一般'
        }else{
            item.level = '严重'
        }
        if(item.isSend === 0){
            item.isSend = "未发送"
        }else{
            item.isSend = "已发送"
        }
        if(item.sendType === "phone"){
            item.sendType = "手机"
        }else{
            item.sendType = "邮箱"
        }
    })
    page.value = warnLogData.page
})
//筛选
const siftclick = async ()=>{
    const warnLogqueryUrl = replaceOrAddUrlPath(url, '/warnLog')
    const warnLogquery = {
        "startTime": timeValue.value !== "" ? timeValue.value === null ? "": new Date(timeValue.value[0]).getTime(): "",
        "endTime": timeValue.value !== "" ? timeValue.value === null ? "": new Date(timeValue.value[1]).getTime(): "",
        "warnLevel":  alarmleveValue.value !=="" ? alarmleveValue.value === undefined ? "" : alarmleveValue.value : "" ,
        "queryId": generateRandomId(),
        "pageSize": 10,
        "currentPage": 1
    }
    // const warnLogqueryText = warnLogqueryUrl + "?" + JSON.stringify(warnLogquery)
    const warnLogData = await getManageInfo(warnLogqueryUrl, "POST",JSON.stringify(warnLogquery))
    tableData.value = warnLogData.response
    tableData.value.forEach(item=>{
        item.time = timeConversion(Number(item.time))
        if(item.level ==='normal'){
            item.level = '一般'
        }else{
            item.level = '严重'
        }
        if(item.isSend === 0){
            item.isSend = "未发送"
        }else{
            item.isSend = "已发送"
        }
        if(item.sendType === "phone"){
            item.sendType = "手机"
        }else{
            item.sendType = "邮箱"
        }
    })
    page.value = warnLogData.page
}
// 分页
const handleCurrentChange = async(val: number)=>{
    const warnLogqueryUrl = replaceOrAddUrlPath(url, '/warnLog')
    const warnLogquery = {
        "startTime": timeValue.value !== "" ? timeValue.value === null ? "": new Date(timeValue.value[0]).getTime(): "",
        "endTime": timeValue.value !== "" ? timeValue.value === null ? "": new Date(timeValue.value[1]).getTime(): "",
        "warnLevel": alarmleveValue.value !=="" ? alarmleveValue.value === undefined ? "" : alarmleveValue.value : "" ,
        "queryId": generateRandomId(),
        "pageSize": 10,
        "currentPage": val 
    }
    // const warnLogqueryText = warnLogqueryUrl + "?" + JSON.stringify(warnLogquery)
    const warnLogData = await getManageInfo(warnLogqueryUrl, "POST",JSON.stringify(warnLogquery))
    tableData.value = warnLogData.response
    tableData.value.forEach(item=>{
        item.time = timeConversion(Number(item.time))
        if(item.level ==='normal'){
            item.level = '一般'
        }else{
            item.level = '严重'
        }
        if(item.isSend === 0){
            item.isSend = "未发送"
        }else{
            item.isSend = "已发送"
        }
        if(item.sendType === "phone"){
            item.sendType = "手机"
        }else{
            item.sendType = "邮箱"
        }
    })
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
</style>