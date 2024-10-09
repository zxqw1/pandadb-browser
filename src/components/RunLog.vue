<template>
    <div class="content" style="width: 100%; min-width: 50%; position: relative; z-index: 2;padding: 24px;">
        <el-row>
            <el-col style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;">
                <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
                <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">运行日志</div>
            </el-col>
            <el-col style="margin-top: 10px;">
                <div style="margin-bottom: 10px;">
                    <span
                        style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
                    <span style="font-size: 15px; font-weight: bold;">日志</span>
                </div>
                <el-table :data="tableData" border style="width: 100%"  max-height="750">
                    <el-table-column prop="level" label="等级" />
                    <el-table-column prop="clazz" label="线程" />
                    <el-table-column prop="timestamp" label="时间" />
                    <el-table-column prop="content" label="内容" />
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import getManageInfo from "../utils/manageRequest"
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
onMounted(async()=>{
    const runLogqueryUrl = replaceOrAddUrlPath(url, '/runLog')
    const runLogData = await getManageInfo(runLogqueryUrl, "GET")
    tableData.value = runLogData.response
})
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