<template>
    <div class="content" style="width: 100%; min-width: 50%; position: relative; z-index: 2;padding: 24px;">
        <el-row>
            <el-col style="margin-bottom: 20px;">
                <el-row>
                    <el-col :span="6">
                        <div style="margin-top: 10px;">
                            <div>
                                <span class="demonstration">节点：</span>
                                <el-select v-model="systemnodeValue" placeholder="请选择" style="width: 240px"
                                @change="nodeChange"
                                >
                                    <el-option v-for="item in systemoption">{{ item.description }}</el-option>
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;">
                <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
                <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">总览</div>
                <el-tag style="margin-left: 10px;" effect="dark" :type="'danger'">6条告警</el-tag>
            </el-col>
            <el-col style="margin-top: 24px; width: 100%;">
                <el-descriptions :column="2">
                    <el-descriptions-item label="系统状态：">
                        <el-tag size="small">{{ systemState }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="系统已启动：">{{ runTime }}</el-descriptions-item>
                </el-descriptions>
            </el-col>
            <el-col
                style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;margin-top: 24px;">
                <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
                <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">图表</div>
            </el-col>
            <el-col style="margin-top: 20px; position: relative;">
                <el-select v-model="timeValue" placeholder="最近一小时" size="large" style="width: 240px"
                @change="timeChange">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-row style="margin-top: 10px;">
                    <el-col :span="8">
                        <div>
                            <span
                                style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
                            <span style="font-size: 15px; font-weight: bold;">硬盘利用率</span>
                        </div>
                        <div id="diskUsage" style="width: 100%;height: 400px;"></div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <span
                                style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
                            <span style="font-size: 15px; font-weight: bold;">内存利用率</span>
                        </div>
                        <div id="memoryUsageData" style="width: 100%;height: 400px;"></div>
                    </el-col>
                    <el-col :span="8">
                        <div>
                            <span
                                style="width: 13px;height: 13px;display: inline-block; background-color: rgb(108, 125, 46); border-radius: 50%;margin-right: 10px;"></span>
                            <span style="font-size: 15px; font-weight: bold;">CPU利用率</span>
                        </div>
                        <div id="cupUsageData" style="width: 100%;height: 400px;"></div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import * as echarts from 'echarts';
import mitts from '../utils/bus';
import getManageInfo from "../utils/manageRequest"
const systemnodeValue = ref('')
const timeValue = ref('')
const systemoption = ref([])
const systemState = ref("")
const runTime = ref("")
const options = [
    {
        value: 'One',
        label: '最近一小时',
    },
    {
        value: 'Three',
        label: '最近三天',
    },
    {
        value: 'OneWeek',
        label: '最近一周',
    }
]
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
    //获取系统节点列表
    const systemnodequeryUrl = replaceOrAddUrlPath(url, '/system/nodeList')
    const queryId = generateRandomId()
    const systemnodequeryText = systemnodequeryUrl + "?" + queryId  
    const systemNodeData = await getManageInfo(systemnodequeryText, "GET")
    systemoption.value = systemNodeData.response
    //获取系统节点运行情况
    const systemRunquery = {
        "nodeIp": systemoption.value[0],
        "period": 'OneHour'
    }
    const systemRunUrl = replaceOrAddUrlPath(url, '/database/detail')
    const systemRunqueryText = systemRunUrl +"?" + JSON.stringify(systemRunquery)
    const systemRunData = await getManageInfo(systemRunqueryText, "GET")
    systemState.value = systemRunData.response.nodeStatus
    runTime.value = systemRunData.response.runTime
    const diskUsage = echarts.init(window.document.getElementById("diskUsage"));
    let diskUsageoption = {
        tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
            {
                name: 'Pressure',
                type: 'gauge',
                progress: {
                    show: true
                },
                detail: {
                    valueAnimation: true,
                    formatter: '{value}'
                },
                data: [
                    {
                        value: systemRunData.response.diskUsage,
                        name: 'diskUsage'
                    }
                ]
            }
        ]
    }
    diskUsage.setOption(diskUsageoption);
    const memoryUsageData = echarts.init(window.document.getElementById("memoryUsageData"));
    const memoryUsageoption = {
        xAxis: {
            type: 'category',
            data: systemRunData.response.memoryUsageData.x
        },
        yAxis: {
            type: 'value',
            data: systemRunData.response.memoryUsageData.y
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }
        ]
    }
    memoryUsageData.setOption(memoryUsageoption);
    const cupUsageData = echarts.init(window.document.getElementById("cupUsageData"));
    const cupUsageoption = {
        xAxis: {
            type: 'category',
            data: systemRunData.response.cupUsageData.x
        },
        yAxis: {
            type: 'value',
            data: systemRunData.response.cupUsageData.y
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }
        ]
    }
    cupUsageData.setOption(cupUsageoption);
})
//节点
const nodeChange = async ()=>{
    const systemRunquery = {
        "nodeIp": systemnodeValue.value,
        "period": timeValue.value === "" ? 'OneHour' :timeValue.value
    }
    const systemRunUrl = replaceOrAddUrlPath(url, '/database/detail')
    const systemRunqueryText = systemRunUrl +"?" + JSON.stringify(systemRunquery)
    const systemRunData = await getManageInfo(systemRunqueryText, "GET")
    systemState.value = systemRunData.response.nodeStatus
    runTime.value = systemRunData.response.runTime
    const diskUsage = echarts.init(window.document.getElementById("diskUsage"));
    let diskUsageoption = {
        tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
            {
                name: 'Pressure',
                type: 'gauge',
                progress: {
                    show: true
                },
                detail: {
                    valueAnimation: true,
                    formatter: '{value}'
                },
                data: [
                    {
                        value: systemRunData.response.diskUsage,
                        name: 'diskUsage'
                    }
                ]
            }
        ]
    }
    diskUsage.setOption(diskUsageoption);
    const memoryUsageData = echarts.init(window.document.getElementById("memoryUsageData"));
    const memoryUsageoption = {
        xAxis: {
            type: 'category',
            data: systemRunData.response.memoryUsageData.x
        },
        yAxis: {
            type: 'value',
            data: systemRunData.response.memoryUsageData.y
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }
        ]
    }
    memoryUsageData.setOption(memoryUsageoption);
    const cupUsageData = echarts.init(window.document.getElementById("cupUsageData"));
    const cupUsageoption = {
        xAxis: {
            type: 'category',
            data: systemRunData.response.cupUsageData.x
        },
        yAxis: {
            type: 'value',
            data: systemRunData.response.cupUsageData.y
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }
        ]
    }
    cupUsageData.setOption(cupUsageoption);
}
//时间
const timeChange = async()=>{
    const systemRunquery = {
        "nodeIp": systemnodeValue.value === "" ? systemoption.value[0] : systemnodeValue.value,
        "period": timeValue.value
    }
    const systemRunUrl = replaceOrAddUrlPath(url, '/database/detail')
    const systemRunqueryText = systemRunUrl +"?" + JSON.stringify(systemRunquery)
    const systemRunData = await getManageInfo(systemRunqueryText, "GET")
    systemState.value = systemRunData.response.nodeStatus
    runTime.value = systemRunData.response.runTime
    const diskUsage = echarts.init(window.document.getElementById("diskUsage"));
    let diskUsageoption = {
        tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
            {
                name: 'Pressure',
                type: 'gauge',
                progress: {
                    show: true
                },
                detail: {
                    valueAnimation: true,
                    formatter: '{value}'
                },
                data: [
                    {
                        value: systemRunData.response.diskUsage,
                        name: 'diskUsage'
                    }
                ]
            }
        ]
    }
    diskUsage.setOption(diskUsageoption);
    const memoryUsageData = echarts.init(window.document.getElementById("memoryUsageData"));
    const memoryUsageoption = {
        xAxis: {
            type: 'category',
            data: systemRunData.response.memoryUsageData.x
        },
        yAxis: {
            type: 'value',
            data: systemRunData.response.memoryUsageData.y
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }
        ]
    }
    memoryUsageData.setOption(memoryUsageoption);
    const cupUsageData = echarts.init(window.document.getElementById("cupUsageData"));
    const cupUsageoption = {
        xAxis: {
            type: 'category',
            data: systemRunData.response.cupUsageData.x
        },
        yAxis: {
            type: 'value',
            data: systemRunData.response.cupUsageData.y
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }
        ]
    }
    cupUsageData.setOption(cupUsageoption);
}
mitts.on("resize", () => { // 这个是 点击了 数据库运行情况 执行的，也是为啥刷新图表
    nextTick(() => {
        const diskUsage = echarts.init(window.document.getElementById("diskUsage"));
        const memoryUsageData = echarts.init(window.document.getElementById("memoryUsageData"));
        const cupUsageData = echarts.init(window.document.getElementById("cupUsageData"));
        diskUsage.resize();
        memoryUsageData.resize();
        cupUsageData.resize();
    })
})
window.addEventListener('resize', function () { // 这个是浏览器改变宽度，监听的，会刷新 图表
    const diskUsage = echarts.init(window.document.getElementById("diskUsage"));
    const memoryUsageData = echarts.init(window.document.getElementById("memoryUsageData"));
    const cupUsageData = echarts.init(window.document.getElementById("cupUsageData"));
    diskUsage.resize();
    memoryUsageData.resize();
    cupUsageData.resize();
});
</script>

<style scoped>
.content {
    margin: 24px;
    background-color: #ffffff;
    width: 100%;
}
</style>