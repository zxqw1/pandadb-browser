<template>
    <div class="content" style="width: 100%; min-width: 50%; position: relative; z-index: 2;padding: 24px;">
        <el-row>
            <el-col style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;">
                <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
                <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">任务列表在线备份</div>
            </el-col>
            <el-col>
                <div style="margin-top: 10px;">
                    <span
                        style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
                    <span style="font-size: 15px; font-weight: bold;">备份列表</span>
                </div>
                <el-row>
                    <el-col style="margin-top: 10px;display: flex;    flex-direction: row-reverse;">
                        <el-button style="margin-left: 10px;" @click="addBackup(0)">全量备份</el-button>
                        <el-button @click="addBackup(1)" >增量备份</el-button>
                    </el-col>
                    <el-dialog v-model="backupsDialog" title="备份" width="800">
                        <el-form :model="form" label-width="auto" style="max-width: 600px">
                            <el-form-item label="任务名称" required>
                                <el-input v-model="form.taskName" />
                            </el-form-item>
                            <el-form-item label="是否立即执行">
                                <el-switch v-model="form.executeImmediately" />
                            </el-form-item>
                            <el-form-item label="执行时间">
                                <el-input v-model="form.planRuntime" />
                            </el-form-item>
                            <el-form-item label="备注">
                                <el-input v-model="form.remark" />
                            </el-form-item>
                            <el-form-item>
                                <el-button style="background-color: rgb(108, 125, 46); color: #fff;" @click="confirmBackup">
                                    确定
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <el-col style="margin-top: 10px;">
                        <el-table :data="tableData" style="width: 100%" border>
                            <el-table-column type="selection" width="55" />
                            <el-table-column property="taskName" label="任务名称" width="120" />
                            <el-table-column property="time" label="备份时间" width="240" show-overflow-tooltip />
                            <el-table-column property="type" label="备份类型" />
                            <el-table-column fixed="right" label="备份进度" min-width="120">
                                <template #default>
                                    <el-button link type="primary" size="small"
                                        @click="BackupProcess = true">备份中</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column property="executionTime" label="执行时间" width="120" />
                            <el-table-column property="notes" label="备注" width="120" />
                        </el-table>
                        <el-dialog v-model="BackupProcess" title="备份流程" width="800">
                            <el-steps style="max-width: 600px" :space="200" :active="1" finish-status="success">
                                <el-step title="Done" />
                                <el-step title="Processing" />
                                <el-step title="Step 3" />
                            </el-steps>
                            <template #footer>
                                <div class="dialog-footer">
                                    <el-button @click="BackupProcess = false">取消</el-button>
                                    <el-button type="primary" @click="BackupProcess = false" color="red">
                                        停止备份
                                    </el-button>
                                </div>
                            </template>
                        </el-dialog>
                    </el-col>
                    <el-col style="margin-top: 20px; display: flex; flex-direction: row-reverse;">
                        <el-pagination background layout="prev, pager, next" :total="1000" @current-change="handleCurrentChange"/>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import { ElTable } from 'element-plus'
import getManageInfo from "../utils/manageRequest"
const BackupProcess = ref(false)
const backupsDialog = ref(false)
const form = ref({
    taskName: '',
    remark: '',
    planRuntime: '',
    executeImmediately:true
})
const tableData = ref([])
const type = ref(0)
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
onMounted( async()=>{
// 查询数据备份列表
const BackupqueryUrl = replaceOrAddUrlPath(url,"/dataBackup")
const Backupquery = {
    "queryId":generateRandomId(),
    "pageSize":10,
    "currentPage":1
}
const BackupqueryText = BackupqueryUrl + "?" + JSON.stringify(Backupquery)
const BackupqueryData = await getManageInfo(BackupqueryText , "GET")
tableData.value = BackupqueryData.response
})
//分页查询数据备份
const handleCurrentChange = async(val:number)=>{
const BackupqueryUrl = replaceOrAddUrlPath(url,"/dataBackup")
const Backupquery = {
    "queryId":generateRandomId(),
    "pageSize":10,
    "currentPage":val
}
const BackupqueryText = BackupqueryUrl + "?" + JSON.stringify(Backupquery)
const BackupqueryData = await getManageInfo(BackupqueryText , "GET")
tableData.value = BackupqueryData.response  
}
//新增数据备份
const addBackup = (backuptype:number)=>{
backupsDialog.value = true
type.value = backuptype
}
//确定备份
const confirmBackup = async() =>{
backupsDialog.value = false
const dataBackupqueryUrl = replaceOrAddUrlPath(url,"/dataBackup")
const dataBackupQuery = {
'taskName':form.value.taskName,
'type':type.value,
'planRuntime':form.value.planRuntime,
'remark':form.value.remark,
'executeImmediately':form.value.executeImmediately
}
const dataBackupData = await getManageInfo(dataBackupqueryUrl,"POST",JSON.stringify(dataBackupQuery))
if(dataBackupData.success=== true){
    dataBackupData.response =  tableData.value
}
}
// 分页

</script>

<style scopde>
.content {
    margin: 24px;
    background-color: #ffffff;
    width: 100%;
}
</style>