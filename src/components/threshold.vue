<template>
    <div class="content" style="width: 100%; min-width: 50%; position: relative; z-index: 2;padding: 24px;">
        <el-row>
            <el-col style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;">
                <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
                <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">阈值信息配置</div>
            </el-col>
            <el-col style="margin-top: 10px;">
                <div style="margin-top: 10px;">
                    <span
                        style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
                    <span style="font-size: 15px; font-weight: bold;">阈值信息配置</span>
                </div>
                <el-row>
                    <el-col style="margin-top: 10px; ">
                        <el-row style="display: flex;align-items: flex-end;">
                            <el-col :span="6">
                                <div style="margin-top: 10px;">
                                    <div>
                                        <span class="demonstration">告警项：</span>
                                        <el-select v-model="warnValue" placeholder="请选择" style="width:80%" clearable>
                                            <el-option v-for="item in warnOption" :key="item.value"
                                                :label="item.description" :value="item.value" />
                                        </el-select>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div style="margin-top: 10px;">
                                    <div>
                                        <span class="demonstration">状态：</span>
                                        <el-select v-model="warnParamValue" placeholder="请选择" style="width:80%"
                                            clearable>
                                            <el-option v-for="item in warnParamStatus" :key="item.value"
                                                :label="item.description" :value="item.value" />
                                        </el-select>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <el-button type="primary" @click="siftclick">确定</el-button>
                            </el-col>
                            <el-col :span="8"></el-col>
                        </el-row>
                    </el-col>
                    <el-col style="margin-top: 10px;display: flex;flex-direction: row-reverse;">
                        <el-button type="primary" @click="addClick">新增</el-button>
                    </el-col>
                    <el-col>
                        <el-dialog v-model="warnParamFlag" :title="dialogTitle" width="800">
                            <el-form :rules="rules" :model="addWarnItem" ref="formRef">
                                <el-form-item label="告警项：" prop="warnOption">
                                    <el-select v-model="addWarnItem.warnOption" placeholder="请选择" style="width:80%"
                                        clearable>
                                        <el-option v-for="item in warnOption" :key="item.value"
                                            :label="item.description" :value="item.value" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="阈值：" prop="threshold">
                                    <el-input v-model="addWarnItem.threshold" placeholder="请输入" style="width:80%" />
                                </el-form-item>
                                <el-form-item label="告警地址：" prop="warnPath">
                                    <el-input v-model="addWarnItem.warnPath" placeholder="请输入" style="width:80%" />
                                </el-form-item>
                                <el-form-item label="发送方式：" prop="sendType">
                                    <el-select v-model="addWarnItem.sendType" placeholder="请选择" style="width:80%"
                                        clearable>
                                        <el-option value="phone" label="手机"></el-option>
                                        <el-option value="email" label="邮箱"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="告警级别：" prop="warnLevel">
                                    <el-select v-model="addWarnItem.warnLevel" placeholder="请选择" style="width:80%"
                                        clearable>
                                        <el-option value="badly" label="严重"></el-option>
                                        <el-option value="normal" label="一般"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="状态：" prop="status">
                                    <el-select v-model="addWarnItem.status" placeholder="请选择" style="width:80%"
                                        clearable>
                                        <el-option v-for="item in warnParamStatus" :key="item.value"
                                            :label="item.description" :value="item.value" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="频率：" prop="rate">
                                    <el-input v-model="addWarnItem.rate" placeholder="请输入" style="width:80%" />
                                </el-form-item>
                                <el-form-item label="告警内容：" prop="content">
                                    <el-input v-model="addWarnItem.content" placeholder="请输入" style="width:80%" />
                                </el-form-item>
                                <el-form-item label="备注：" prop="remark">
                                    <el-input v-model="addWarnItem.remark" placeholder="请输入" style="width:80%" />
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="addconfirmClick(formRef)">
                                        确认
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-dialog>
                    </el-col>
                    <el-col style="margin-top: 10px;">
                        <el-table :data="tableData" style="width: 100%;" border>
                            <el-table-column prop="warnOption" label="告警项" />
                            <el-table-column prop="threshold" label="阈值" />
                            <el-table-column prop="warnPath" label="告警地址" />
                            <el-table-column prop="sendType" label="发送方式" />
                            <el-table-column prop="warnLevel" label="告警级别" />
                            <el-table-column prop="status" label="状态" />
                            <el-table-column prop="rate" label="频率ms" />
                            <el-table-column prop="content" label="告警内容" />
                            <el-table-column prop="remark" label="备注" />
                            <el-table-column label="操作">
                                <template #default="scope">
                                    <el-col style="display: flex;">
                                        <el-button @click="handleEdit(scope.row)" text
                                            style="color: #6a8322;text-decoration: underline">
                                            修改
                                        </el-button>
                                        <el-button @click="handleDelete(scope.row)" text
                                            style="color: #6a8322;text-decoration: underline">
                                            删除
                                        </el-button>
                                    </el-col>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
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
import { ElMessage, ElMessageBox } from 'element-plus'
const tableData = ref([])
const warnOption = ref([])
const warnParamStatus = ref([])
const warnValue = ref("")
const warnParamValue = ref("")
const page = ref({})
const warnParamFlag = ref(false)
const addWarnItem = ref({
    "warnOption": "",
    "threshold": "",
    "warnPath": "",
    "sendType": "",
    "warnLevel": "",
    "status": "",
    "rate": "",
    "content": "",
    "remark": ""

})
const rules = ref({
    "warnOption": [{ required: true, message: '请输入告警项' }],
    "threshold": [{ required: true, message: '请输入阈值' }],
    "warnPath": [{ required: true, message: '请输入告警地址' }],
    "sendType": [{ required: true, message: '请选择发送方式' }],
    "warnLevel": [{ required: true, message: '请选择告警级别' }],
    "status": [{ required: true, message: '请选择状态' }],
    "rate": [{ required: true, message: '请输入频率' }],
    "content": [{ required: true, message: '请输入告警内容' }],
    "remark": [{ required: true, message: '请输入备注' }]
})
const formRef = ref(null)
let dialogTitle = ref("")
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
    //获取添加告警阈值时相关的下拉选择框列表
    const warnParamselectUrl = replaceOrAddUrlPath(url, '/warnParam/select')
    const warnParamselectData = await getManageInfo(warnParamselectUrl, "GET")
    warnOption.value = warnParamselectData.response.warnOption
    warnParamStatus.value = warnParamselectData.response.warnParamStatus
    //分页查询告警阈值
    const warnParampageUrl = replaceOrAddUrlPath(url, '/warnParam/page')
    const warnParampagequery = {
        "warnOption": "",
        "status": "",
        "pageSize": 10,
        "currentPage": 1
    }
    const warnParampageData = await getManageInfo(warnParampageUrl, "POST", JSON.stringify(warnParampagequery))
    tableData.value = warnParampageData.response
    tableData.value.forEach(item => {
        warnOption.value.forEach(item2 => {
            if (item.warnOption === item2.value) {
                item.warnOption = item2.description
            }
        })
        item.status === "on" ? item.status = "启用" : item.status = "禁用"
    })
    page.value = warnParampageData.page
})
//筛选
const siftclick = async () => {
    //分页查询告警阈值
    const warnParampageUrl = replaceOrAddUrlPath(url, '/warnParam/page')
    const warnParampagequery = {
        "warnOption": warnValue.value !== "" ? warnValue.value === undefined ? "" : warnValue.value : "",
        "status": warnParamValue.value !== "" ? warnParamValue.value === undefined ? "" : warnParamValue.value : "",
        "pageSize": 10,
        "currentPage": 1
    }
    const warnParampageData = await getManageInfo(warnParampageUrl, "POST", JSON.stringify(warnParampagequery))
    tableData.value = warnParampageData.response
    tableData.value.forEach(item => {
        warnOption.value.forEach(item2 => {
            if (item.warnOption === item2.value) {
                item.warnOption = item2.description
            }
        })
        item.status === "on" ? item.status = "启用" : item.status = "禁用"
    })
    page.value = warnParampageData.page
}
//分页
const handleCurrentChange = async (val: number) => {
    //分页查询告警阈值
    const warnParampageUrl = replaceOrAddUrlPath(url, '/warnParam/page')
    const warnParampagequery = {
        "warnOption": warnValue.value !== "" ? warnValue.value === undefined ? "" : warnValue.value : "",
        "status": warnParamValue.value !== "" ? warnParamValue.value === undefined ? "" : warnParamValue.value : "",
        "pageSize": 10,
        "currentPage": val
    }
    const warnParampageData = await getManageInfo(warnParampageUrl, "POST", JSON.stringify(warnParampagequery))
    tableData.value = warnParampageData.response
    tableData.value.forEach(item => {
        warnOption.value.forEach(item2 => {
            if (item.warnOption === item2.value) {
                item.warnOption = item2.description
            }
        })
        item.status === "on" ? item.status = "启用" : item.status = "禁用"
    })
    page.value = warnParampageData.page
}
//新增
const addClick = () => {
    warnParamFlag.value = true
    dialogTitle.value = "新增"
}
const addconfirmClick = async (formRef) => {
    await formRef.validate(async (valid, fields) => {
        if (valid) {
            if (dialogTitle.value === "新增") {
                const addwarnParamUrl = replaceOrAddUrlPath(url, '/warnParam')
                await getManageInfo(addwarnParamUrl, "POST", JSON.stringify(addWarnItem.value))
                const warnParampageUrl = replaceOrAddUrlPath(url, '/warnParam/page')
                const warnParampagequery = {
                    "warnOption": warnValue.value !== "" ? warnValue.value === undefined ? "" : warnValue.value : "",
                    "status": warnParamValue.value !== "" ? warnParamValue.value === undefined ? "" : warnParamValue.value : "",
                    "pageSize": 10,
                    "currentPage": 1
                }
                const warnParampageData = await getManageInfo(warnParampageUrl, "POST", JSON.stringify(warnParampagequery))
                tableData.value = warnParampageData.response
                tableData.value.forEach(item => {
                    warnOption.value.forEach(item2 => {
                        if (item.warnOption === item2.value) {
                            item.warnOption = item2.description
                        }
                    })
                    item.status === "on" ? item.status = "启用" : item.status = "禁用"
                })
                page.value = warnParampageData.page
                warnParamFlag.value = false
            } else if (dialogTitle.value === "修改") {
                const replacewarnParamUrl = replaceOrAddUrlPath(url, '/warnParam')
                await getManageInfo(replacewarnParamUrl, "PUT", JSON.stringify(addWarnItem.value))
                const warnParampageUrl = replaceOrAddUrlPath(url, '/warnParam/page')
                const warnParampagequery = {
                    "warnOption": warnValue.value !== "" ? warnValue.value === undefined ? "" : warnValue.value : "",
                    "status": warnParamValue.value !== "" ? warnParamValue.value === undefined ? "" : warnParamValue.value : "",
                    "pageSize": 10,
                    "currentPage": 1
                }
                const warnParampageData = await getManageInfo(warnParampageUrl, "POST", JSON.stringify(warnParampagequery))
                tableData.value = warnParampageData.response
                tableData.value.forEach(item => {
                    warnOption.value.forEach(item2 => {
                        if (item.warnOption === item2.value) {
                            item.warnOption = item2.description
                        }
                    })
                    item.status === "on" ? item.status = "启用" : item.status = "禁用"
                })
                page.value = warnParampageData.page
                warnParamFlag.value = false
            }
        }
    })
}
//删除
const handleDelete = (row) => {
    ElMessageBox.confirm('是否确认删除？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        const delwarnParamUrl = replaceOrAddUrlPath(url, '/warnParam')
        getManageInfo(delwarnParamUrl, "DELETE", JSON.stringify(row.key))
        const warnParampageUrl = replaceOrAddUrlPath(url, '/warnParam/page')
        const warnParampagequery = {
            "warnOption": warnValue.value !== "" ? warnValue.value === undefined ? "" : warnValue.value : "",
            "status": warnParamValue.value !== "" ? warnParamValue.value === undefined ? "" : warnParamValue.value : "",
            "pageSize": 10,
            "currentPage": 1
        }
        const warnParampageData = getManageInfo(warnParampageUrl, "POST", JSON.stringify(warnParampagequery))
        tableData.value = warnParampageData.response
        tableData.value.forEach(item => {
            warnOption.value.forEach(item2 => {
                if (item.warnOption === item2.value) {
                    item.warnOption = item2.description
                }
            })
            item.status === "on" ? item.status = "启用" : item.status = "禁用"
        })
        page.value = warnParampageData.page
        ElMessage({
            type: 'success',
            message: "删除成功",
        })
    }).catch(() => { })
}
//修改
const handleEdit = (row) => {
    warnParamFlag.value = true
    addWarnItem.value = row
    dialogTitle.value = "修改"
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