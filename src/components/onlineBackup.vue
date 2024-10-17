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
                        <el-button @click="addBackup(1)">增量备份</el-button>
                    </el-col>
                    <el-dialog v-model="backupsDialog" destroy-on-close :title="backupsTitle" width="800">
                        <el-form :rules="rules" :model="form" label-width="auto" ref="formRef">
                            <el-form-item label="任务名称" required prop="taskName">
                                <el-input v-model="form.taskName" />
                            </el-form-item>
                            <el-form-item label="节点Ip" required prop="nodeIp">
                                <el-select v-model="form.nodeIp" placeholder="请选择" style="width:80%" clearable>
                                    <el-option v-for="(item, index) in typeOption" :key="index"
                                        :label="item.description" :value="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="是否立即执行">
                                <el-switch v-model="form.executeImmediately" @change="switchChange" />
                            </el-form-item>
                            <el-form-item label="预计执行时间" prop="planRuntime" >
                                <!-- <el-input v-model="form.planRuntime" /> -->
                                <el-date-picker v-model="form.planRuntime" type="datetime" placeholder="请选择时间"
                                    :disabled="timedisable" />
                            </el-form-item>
                            <el-form-item label="备注" prop="remark" required>
                                <el-input v-model="form.remark" />
                            </el-form-item>
                            <el-form-item>
                                <el-button style="background-color: rgb(108, 125, 46); color: #fff;"
                                    @click="confirmBackup(formRef)">
                                    确定
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <el-col style="margin-top: 10px;">
                        <el-table :data="tableData" style="width: 100%" border row-key="key">
                            <el-table-column property="taskName" label="任务名称" />
                            <el-table-column property="createTime" label="创建时间" show-overflow-tooltip />
                            <el-table-column property="type" label="备份类型" />
                            <el-table-column property="planRunTime" label="预计执行时间" />
                            <el-table-column property="remark" label="备注" />
                            <el-table-column property="status" label="状态" />
                            <el-table-column property="progress" fixed="right" label="备份进度" min-width="120">
                                <template #default="scope">
                                    <el-button link type="primary" size="small" @click="Backup(scope.row)">{{
                                        scope.row.status }}</el-button>
                                    <el-dialog v-model="BackupProcess" title="备份流程" width="800">
                                        <!-- {{ progress }} -->
                                        <el-progress :percentage="progress" />
                                        <template #footer>
                                            <div class="dialog-footer">
                                                <el-button @click="BackupProcess = false">取消</el-button>
                                                <el-button type="primary" @click="stopbackup(scope.row)" color="red">
                                                    停止备份
                                                </el-button>
                                            </div>
                                        </template>
                                    </el-dialog>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template #default="scope">
                                    <el-col style="display: flex;">
                                        <el-button @click="handleEdit(scope.row)" text
                                            style="color: #6a8322;text-decoration: underline" :disabled="buttondisabled">
                                            修改
                                        </el-button>
                                        <el-button @click="handleDelete(scope.row)" text
                                            style="color: #6a8322;text-decoration: underline" :disabled="buttondisabled">
                                            删除
                                        </el-button>
                                    </el-col>

                                </template>
                            </el-table-column>
                        </el-table>
                        <el-dialog v-model="rebackups" title="修改备份" destroy-on-close width="800">
                            <el-form :rules="rerules" :model="reform" label-width="auto" ref="formRef2">
                                <el-form-item label="任务名称" required prop="taskName">
                                    <el-input v-model="reform.taskName" />
                                </el-form-item>
                                <el-form-item label="备份类型" required prop="type">
                                    <el-select v-model="reform.type" placeholder="请选择" style="width:80%" clearable>
                                        <el-option v-for="(item, index) in typeOption" :key="index"
                                            :label="item.description" :value="item.value" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="节点Ip" required prop="nodeIp">
                                    <el-select v-model="reform.nodeIp" placeholder="请选择" style="width: 240px">
                                        <el-option v-for="(item, index) in nodeIpoption" :key="index"
                                            :label="item.description" :value="item.value" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="是否立即执行">
                                    <el-switch v-model="reform.executeImmediately" @change="reswitchChange" />
                                </el-form-item>
                                <el-form-item label="预计执行时间" prop="planRuntime" required>
                                    <el-date-picker v-model="reform.planRuntime" type="datetime" :disabled="retimedisable"
                                        placeholder="请选择时间" />
                                </el-form-item>
                                <el-form-item label="备注" prop="remark" required>
                                    <el-input v-model="reform.remark" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button style="background-color: rgb(108, 125, 46); color: #fff;"
                                        @click="confirm(formRef2)">
                                        确定
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-dialog>
                    </el-col>
                    <el-col style="margin-top: 20px; display: flex; flex-direction: row-reverse;">
                        <el-pagination background layout="prev, pager, next" :total="page.totalRow"
                            @current-change="handleCurrentChange" />
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElTable } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import getManageInfo from "../utils/manageRequest"
const BackupProcess = ref(false)
const backupsDialog = ref(false)
const rebackups = ref(false)
const buttondisabled = ref(false)
const nodeIpoption = ref([])
const page = ref({})
const form = ref({
    taskName: '',
    remark: '',
    planRuntime: '',
    executeImmediately: true,
    nodeIp: ""
})
const reform = ref({
    taskName: '',
    remark: '',
    planRuntime: '',
    type: "",
    executeImmediately: true,
    nodeIp: ""
})
const timedisable = ref(true)
const retimedisable = ref(true)
const typeOption = ref([])
const tableData = ref([])
const type = ref(0)
const backupsTitle = ref("")
const rules = ref({
    "taskName": [{ required: true, message: '请输入任务名称' }],
    "remark": [{ required: true, message: '请输入备注' }],
    "nodeIp": [{ required: true, message: '请选择节点Ip', trigger: 'change' }]
})
const rerules = ref({
    "taskName": [{ required: true, message: '请输入任务名称' }],
    "remark": [{ required: true, message: '请输入备注' }],
    "type": [{ required: true, message: '请选择类型', trigger: 'change' }],
    "nodeIp": [{ required: true, message: '请选择节点Ip', trigger: 'change' }]
})
const formRef = ref(null)
const formRef2 = ref(null)
const progress = ref(null)
let url = window.localStorage.getItem("address")//地址
function replaceOrAddUrlPath(ipWithMaybePath, newPath) {
    const hasPath = ipWithMaybePath.includes('/') && !ipWithMaybePath.endsWith(':');
    if (hasPath) {
        return ipWithMaybePath.replace(/\/[^\/]*$/, `${newPath}`);
    } else {
        return `${ipWithMaybePath}/${newPath}`;
    }
}
const generateRandomId = () => {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    return `id_${timestamp}_${randomNum}`;
};
const timeConversion = (timestamp) => {
    const date = new Date(timestamp)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate
}
//表格数据
const BackupList = async () => {
    const BackupqueryUrl = replaceOrAddUrlPath(url, "/dataBackup/page")
    const Backupquery = {
        "queryId": generateRandomId(),
        "pageSize": 10,
        "currentPage": 1
    }
    const BackupqueryData = await getManageInfo(BackupqueryUrl, "POST", JSON.stringify(Backupquery))
    tableData.value = BackupqueryData.response
    const BackupselectUrl = replaceOrAddUrlPath(url, "/dataBackup/select")
    const BackupselectData = await getManageInfo(BackupselectUrl, "GET")
    tableData.value.forEach(item => {
        item.createTime = timeConversion(Number(item.createTime))
        item.planRunTime = timeConversion(Number(item.planRunTime))
        if(item.status !== "wait"){
            buttondisabled.value = true
        }else{
            buttondisabled.value = false
        }
        BackupselectData.response.status.forEach(item2 => {
            if (item2.value === item.status) {
                item.status = item2.description
            }
        })
        BackupselectData.response.type.forEach(item3 => {
            if (item3.value == item.type) {
                item.type = item3.description
            }
        })
    })
    page.value = BackupqueryData.page
}
onMounted( async() => {
   await BackupList()
})
//分页查询数据备份
const handleCurrentChange = async (val: number) => {
    const BackupqueryUrl = replaceOrAddUrlPath(url, "/dataBackup")
    const Backupquery = {
        "queryId": generateRandomId(),
        "pageSize": 10,
        "currentPage": val
    }
    const BackupqueryData = await getManageInfo(BackupqueryUrl, "POST", JSON.stringify(Backupquery))
    tableData.value = BackupqueryData.response
    const BackupselectUrl = replaceOrAddUrlPath(url, "/dataBackup/select")
    const BackupselectData = await getManageInfo(BackupselectUrl, "GET")
    tableData.value.forEach(item => {
        item.createTime = timeConversion(Number(item.createTime))
        item.planRunTime = timeConversion(Number(item.planRunTime))
        if(item.status !== "wait"){
            buttondisabled.value = true
        }else{
            buttondisabled.value = false
        }
        BackupselectData.response.status.forEach(item2 => {
            if (item2.value === item.status) {
                item.status = item2.description
            }
        })
        BackupselectData.response.type.forEach(item3 => {
            if (item3.value == item.type) {
                item.type = item3.description
            }
        })
    })
    page.value = BackupqueryData.page
}
//新增数据备份
const addBackup = async (backuptype: number) => {
    form.value = ({
        taskName: '',
        remark: '',
        planRuntime: '',
        executeImmediately: true
    })
    if (backuptype === 0) {
        backupsTitle.value = "全量备份"
    } else {
        backupsTitle.value = "增量备份"
    }
    backupsDialog.value = true
    type.value = backuptype
    //下拉获取nodeip
    const nodeIpUrl = replaceOrAddUrlPath(url, "/dataBase/NodeList")
    const nodeIpData = await getManageInfo(nodeIpUrl, "GET")
    nodeIpoption.value = nodeIpData.response

}
const switchChange = (value) => {
    timedisable.value = value

}
//确定新增备份
const confirmBackup = async (formRef) => {
    await formRef.validate(async (valid, fields) => {
        if (valid) {
            const dataBackupqueryUrl = replaceOrAddUrlPath(url, "/dataBackup")
            if (timedisable.value === true) {
                form.value.planRuntime = JSON.stringify(Date.now())
            } else {
                form.value.planRuntime = JSON.stringify(new Date(form.value.planRuntime).getTime())
            }
            const dataBackupQuery = {
                'taskName': form.value.taskName,
                'type': type.value,
                'planRuntime': form.value.planRuntime === "" ? JSON.stringify(Date.now()) :form.value.planRuntime,
                'remark': form.value.remark,
                'executeImmediately': form.value.executeImmediately,
                "nodeIp": form.value.nodeIp
            }
            await getManageInfo(dataBackupqueryUrl, "POST", JSON.stringify(dataBackupQuery))
            await BackupList()
            backupsDialog.value = false
        }
    })

}
//备份进度
const Backup = (record) => {
    BackupProcess.value = true
    progress.value = record.progress
}
//删除
const handleDelete = (row) => {
    ElMessageBox.confirm('是否确认删除？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const deldataBuckupUrl = replaceOrAddUrlPath(url, '/dataBuckup')
        getManageInfo(deldataBuckupUrl, "DELETE", JSON.stringify(row.key))
        BackupList()
        ElMessage({
            type: 'success',
            message: "删除成功",
        })
    }).catch(() => { })
}

//修改
const handleEdit = async (row) => {
    rebackups.value = true
    backupsTitle.value = "修改备份"
    const BackupselectUrl = replaceOrAddUrlPath(url, "/dataBackup/select")
    const BackupselectData = await getManageInfo(BackupselectUrl, "GET")
    typeOption.value = BackupselectData.response.type
    let type
    typeOption.value.forEach((item) => {
        if (row.type === item.description) {
            type = item.value
        }
    })
    reform.value = {
        taskName: row.taskName,
        remark: row.remark,
        planRuntime: row.planRunTime,
        executeImmediately: row.executeImmediately,
        type
    }
}
const reswitchChange = (value) => {
    retimedisable.value = value

}
//确定修改
const confirm = async (formRef) => {
    await formRef.validate(async (valid, fields) => {
        if (valid) {
            const dataBackupqueryUrl = replaceOrAddUrlPath(url, "/dataBackup")
            if (timedisable.value === true) {
                reform.value.planRuntime = JSON.stringify(Date.now())
            } else {
                reform.value.planRuntime = JSON.stringify(new Date(form.value.planRuntime).getTime())
            }
            const dataBackupQuery = {
                'taskName': reform.value.taskName,
                'type': reform.value.type,
                'planRuntime': form.value.planRuntime === "" ? JSON.stringify(Date.now()) :form.value.planRuntime,
                'remark': reform.value.remark,
                'executeImmediately': reform.value.executeImmediately,
                "nodeIp": reform.value.remark
            }
            await getManageInfo(dataBackupqueryUrl, "PUT", JSON.stringify(dataBackupQuery))
            await BackupList()
            rebackups.value = false
        }
    })

}
//停止备份
const stopbackup = async (row) => {
    const stopURL = replaceOrAddUrlPath(url, "/dataBackup/stop")
    const stopquery = {
        "key": row.key
    }
    await getManageInfo(stopURL, "POST", JSON.stringify(stopquery))
    await BackupList()
    BackupProcess.value = false
}

</script>

<style scoped>
.content {
    margin: 24px;
    background-color: #ffffff;
    width: 100%;
}

::v-deep .is-checked .el-checkbox__inner {
    background: #6C7D2E !important;
    border: 1px solid #6C7D2E !important;
}

::v-deep .el-pager .is-active {
    background: #6C7D2E !important;
}
</style>