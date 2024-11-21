<template>
  <div class="content" style="width: 100%; min-width: 50%; position: relative; z-index: 2;padding: 24px;">
    <el-row>
      <el-col style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;">
        <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
        <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">离线备份任务列表</div>
      </el-col>
      <el-col>
        <div style="margin-top: 10px;">
          <span
            style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
          <span style="font-size: 15px; font-weight: bold;">自动备份列表</span>
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
                  <el-option v-for="(item, index) in nodeIpoption" :key="index" :label="item.description"
                    :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-switch v-model="form.state" @change="switchChange" />
              </el-form-item>
              <el-form-item label="cron表达式" required prop="cron">
                <el-input v-model="form.cron" />
              </el-form-item>
              <el-form-item label="备注" prop="remark" required>
                <el-input v-model="form.remark" />
              </el-form-item>
              <el-form-item>
                <el-button style="background-color: rgb(108, 125, 46); color: #fff;" @click="confirmBackup(formRef)">
                  确定
                </el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-col style="margin-top: 10px;">
            <el-table :data="tableData" style="width: 100%" border row-key="key">
              <el-table-column property="taskName" label="任务名称" />
              <el-table-column property="cron" label="cron表达式" show-overflow-tooltip width="200" />
              <el-table-column property="type" label="备份类型" width="120" />
              <el-table-column property="remark" label="备注" />
              <el-table-column property="status" label="状态" width="200" />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-col style="display: flex;">
                    <el-button @click="handleEdit(scope.row)" text style="color: #6a8322;text-decoration: underline">
                      修改
                    </el-button>
                    <el-button @click="handleDelete(scope.row)" text style="color: #6a8322;text-decoration: underline">
                      删除
                    </el-button>
                    <el-button @click="restore(scope.row)" text style="color: #6a8322;text-decoration: underline">
                      恢复
                    </el-button>
                  </el-col>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog v-model="rebackups" title="修改备份" width="800" @close="close">
              <el-form :rules="rerules" :model="reform" label-width="auto" ref="formRef2">
                <el-form-item label="任务名称" prop="taskName">
                  <el-input v-model="reform.taskName" />
                </el-form-item>
                <el-form-item label="备份类型" prop="type">
                  <el-select v-model="reform.type" placeholder="请选择" style="width:80%" clearable>
                    <el-option v-for="(item, index) in typeOption" :key="index" :label="item.description"
                      :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="节点Ip" prop="nodeIp">
                  <el-select v-model="reform.nodeIp" placeholder="请选择" style="width: 240px">
                    <el-option v-for="(item, index) in renodeIpoption" :key="index" :label="item.description"
                      :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态">
                  <el-switch v-model="reform.state" @change="reswitchChange" />
                </el-form-item>
                <el-form-item label="备份类型">
                  <!-- <el-switch v-model="reform.type" @change="reswitchChange" /> -->
                  <el-select v-model="reform.type">
                    <el-option :key="0">全量备份</el-option>
                    <el-option :key="1">增量备份</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="cron表达式" required prop="cron">
                  <el-input v-model="form.cron" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="reform.remark" />
                </el-form-item>
                <el-form-item>
                  <el-button style="background-color: rgb(108, 125, 46); color: #fff;" @click="confirm(formRef2)">
                    确定
                  </el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
            <el-dialog v-model="BackupProcess" title="备份流程" width="800">
              <el-progress :percentage="progress" />
              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="BackupProcess = false">取消</el-button>
                  <el-button type="primary" @click="stopbackup(recordInfo)">
                    停止备份
                  </el-button>
                </div>
              </template>
            </el-dialog>
          </el-col>
          <el-col style="margin-top: 20px; display: flex; flex-direction: row-reverse;">
            <el-pagination background layout="prev, pager, next" :total="page.totalRow"
              @current-change="handleCurrentChange" :current-page="currentPage" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElTable } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import getManageInfo from "../utils/manageRequest"
const BackupProcess = ref(false) //备份进度
const backupsDialog = ref(false) //新增备份
const rebackups = ref(false) //修改备份
const nodeIpoption = ref([])
const renodeIpoption = ref([])
const page = ref({})
const currentPage = ref()
const form = ref({
  taskName: '',
  nodeIp: '',
  cron: '',
  state: true,
  remark: ""
})
const reform = ref({
  taskName: '',
  nodeIp: '',
  cron: '',
  state: true,
  type: "",
  remark: ""
})
const typeOption = ref([])
const tableData = ref([])
const type = ref(0)
const backupsTitle = ref("")
const rules = ref({
  "taskName": [{ required: true, message: '请输入任务名称' }],
  "nodeIp": [{ required: true, message: '请选择节点Ip', trigger: 'change' }],
  "cron": [{ required: true, message: '请输入cron表达式' }],
  "remark": [{ required: true, message: '请输入备注' }]
})
const rerules = ref({
  "taskName": [{ required: true, message: '请输入任务名称' }],
  "nodeIp": [{ required: true, message: '请选择节点Ip', trigger: 'change' }],
  "cron": [{ required: true, message: '请输入cron表达式' }],
  "remark": [{ required: true, message: '请输入备注' }],
  "type": [{ required: true, message: '请选择类型', trigger: 'change' }]
})
const formRef = ref(null)
const formRef2 = ref(null)
const progress = ref(null)
const recordInfo = ref({})
let url = window.localStorage.getItem("address")//地址
function replaceOrAddUrlPath(ipWithMaybePath, newPath) {
  const hasPath = ipWithMaybePath.includes('/') && !ipWithMaybePath.endsWith(':');
  if (hasPath) {
    return ipWithMaybePath.replace(/\/[^\/]*$/, `${newPath}`);
  } else {
    return `${ipWithMaybePath}/${newPath}`;
  }
}
const generateRandomId = async () => {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  return `id_${timestamp}_${randomNum}`;
};
//表格数据
const offlineList = async () => {
  const offlineUrl = replaceOrAddUrlPath(url, "/dataBackup/page")
  const offlinequery = {
    "queryId": generateRandomId(),
    "pageSize": 10,
    "currentPage": 1
  }
  const offlinequeryData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/dataBackup/page", "POST", JSON.stringify(offlinequery))
  const offlineselectUrl = replaceOrAddUrlPath(url, "/dataBackup/select")
  const offlineselectData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/dataBackup/select", "GET")
  offlinequeryData.response.forEach(item => {
    offlineselectData.response.status.forEach(item2 => {
      if (item2.value === item.status) {
        item.status = item2.description
      }
    })
    offlineselectData.response.type.forEach(item3 => {
      if (item3.value == item.type) {
        item.type = item3.description
      }
    })
  })
  tableData.value = offlinequeryData.response
  page.value = offlinequeryData.page
  currentPage.value = 1
}
onMounted(async () => {
  await offlineList()
})
//分页查询数据备份
const handleCurrentChange = async (val) => {
  const offlineUrl = replaceOrAddUrlPath(url, "/dataBackup/page")
  const offlinequery = {
    "queryId": generateRandomId(),
    "pageSize": 10,
    "currentPage": val
  }
  const offlinequeryData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/dataBackup/page", "POST", JSON.stringify(Backupquery))
  tableData.value = offlinequeryData.response
  const offlineselectUrl = replaceOrAddUrlPath(url, "/dataBackup/select")
  const offlineselectData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/dataBackup/select", "GET")
  tableData.value.forEach(item => {
    offlineselectData.response.status.forEach(item2 => {
      if (item2.value === item.status) {
        item.status = item2.description
      }
    })
    offlineselectData.response.type.forEach(item3 => {
      if (item3.value == item.type) {
        item.type = item3.description
      }
    })
  })
  page.value = BackupqueryData.page
  currentPage.value = val
}
//新增数据备份
const addBackup = ()=>{
  
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