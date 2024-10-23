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
                                    @change="nodeChange">
                                    <el-option v-for="item in systemoption" :key="item.value"
                                        :value="item.description">{{ item.description }}</el-option>
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;">
                <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
                <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">总览</div>
            </el-col>
            <el-col style="margin-top: 24px; width: 100%;">
                <el-descriptions :column="2">
                    <el-descriptions-item label="系统状态：">
                        <el-tag size="small">{{ systemState }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="系统已启动：">{{ runTime }} ms</el-descriptions-item>
                </el-descriptions>
            </el-col>
            <el-col
                style="display:flex;align-items: center;border-bottom: 1px dashed #999;padding-bottom: 10px;margin-top: 24px;">
                <div style="width: 6px; height: 18px; background-color: rgb(108, 125, 46);"></div>
                <div style="font-size: 16px;color: #333;font-weight:bold;margin-left: 12px;">图表</div>
            </el-col>
            <el-col style="margin-top: 20px; position: relative;">
                <el-select v-model="timeValue" v-if="options[0]" :placeholder="options[0].description" size="large" style="width: 240px"
                    @change="timeChange">
                    <el-option v-for="item in options" :key="item.value" :label="item.description"
                        :value="item.value" />
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
const systemnodeva = ref("")
const timeValue = ref('')
const systemoption = ref([])
const systemState = ref("")
const runTime = ref("")
const options = ref([])
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
onMounted(async () => {
    //获取系统节点列表
    const systemnodequeryUrl = replaceOrAddUrlPath(url, '/system/nodeList')
    const systemNodeData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/system/nodeList", "GET")
    systemoption.value = systemNodeData.response
    systemnodeValue.value = systemoption.value[0].description
    // 图表时间段枚举
    const systemperiodUrl = replaceOrAddUrlPath(url, '/system/period')
    const systemperiodData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/system/period", "GET")
    options.value = systemperiodData.response
    // 获取系统节点运行情况
    const systemRunquery = {
        "nodeIp": systemoption.value[0].value,
        "period": options.value[0].value
    }
    const systemRunUrl = replaceOrAddUrlPath(url, '/system/detail')
    const systemRunData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/system/detail", "POST", JSON.stringify(systemRunquery))
    runTime.value = systemRunData.response.runTime
    const diskUsage = echarts.init(window.document.getElementById("diskUsage"));
    let diskUsageoption = {
        tooltip: {
            formatter: `利用率  : ${(Number(systemRunData.response.diskUsage.used) / (Number(systemRunData.response.diskUsage.total) / 100)).toFixed(2)}%`
        },
        series: [
            {
                name: 'diskUsage',
                type: 'gauge',
                progress: {
                    show: true
                },
                detail: {
                    valueAnimation: true,
                    formatter: systemRunData.response.diskUsage.total + "G"
                },
                data: [
                    {
                        value: Number(systemRunData.response.diskUsage.used) / (Number(systemRunData.response.diskUsage.total) / 100),
                        name: systemRunData.response.diskUsage.used + "G"
                    }
                ]
            }
        ]
    }
    diskUsage.setOption(diskUsageoption);
    const memoryUsageData = echarts.init(window.document.getElementById("memoryUsageData"));
    let dataX = []
    let dataY = []
    let tooltip = []
    systemRunData.response.memoryUsageData.forEach((item: any) => {
        let date = new Date(Number(item.x)).toLocaleString().split(" ")[1] // 这块呢，我把时间 年-月-日 空格 时：分：秒 我用空格截取的，取的是 时分秒 用来显示 X轴的时分秒
        let tooltipS = new Date(Number(item.x)).toLocaleString() // 这块呢，我没截取，就是 年月日时分秒 用来显示完整的时间
        tooltip.push(tooltipS)
        dataX.push(date)
        dataY.push(item.y)
    })

    const memoryUsageoption = {
        tooltip: { // 鼠标移入的 title 相关的对象
            trigger: 'axis',
            formatter: function (params) { // 鼠标移入当前的事件，会默认带出一个参数，相关的数据
                let tooltipContent = ` 利用率: ${Number(params[0].value).toFixed(2)} %<br/>${tooltip[params[0].dataIndex]} ` // 拼接数据
                return tooltipContent // return 数据回去显示
            }
        },
        xAxis: {
            type: 'category',
            data: dataX,
            axisLabel: {
                fontSize: 8,
                interval: 0,
                rotate: 30// 旋转角度
            },
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: dataY,
                type: 'line',
                showSymbol: false, //是否显示 线上面的 节点
                smooth: true //线是否圆润，就是圆角线
            }
        ]
    }
    memoryUsageData.setOption(memoryUsageoption);
    const cupUsageData = echarts.init(window.document.getElementById("cupUsageData"));
    let cupUsagedataX = []
    let cupUsagedataY = []
    let cputooltip = []
    systemRunData.response.cupUsageData.forEach((item: any) => {
        let date = new Date(Number(item.x)).toLocaleString().split(" ")[1]
        let cputooltipS = new Date(Number(item.x)).toLocaleString()
        cputooltip.push(cputooltipS)
        cupUsagedataX.push(date)
        cupUsagedataY.push(item.y)
    })
    const cupUsageoption = {
        tooltip: { // 鼠标移入的 title 相关的对象
            trigger: 'axis',
            formatter: function (params) { // 鼠标移入当前的事件，会默认带出一个参数，相关的数据
                let tooltipContent = ` 利用率: ${Number(params[0].value).toFixed(2)} %<br/>${tooltip[params[0].dataIndex]}` // 拼接数据
                return tooltipContent // return 数据回去显示
            }
        },
        xAxis: {
            type: 'category',
            data: cupUsagedataX,
            axisLabel: {
                fontSize: 8,
                interval: 0,
                rotate: 40// 旋转角度
            },
        },
        yAxis: {
            type: 'value'
            // interval: 10
        },
        series: [
            {
                data: cupUsagedataY,
                type: 'line',
                showSymbol: false, //是否显示 线上面的 节点
                smooth: true
            }
        ]
    }
    cupUsageData.setOption(cupUsageoption);
    //获取系统节点状态枚举
    const systemStatusTypeListUrl = replaceOrAddUrlPath(url, '/systemStatusTypeList')
    const systemStatusTypeListData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/systemStatusTypeList", "GET")
    systemStatusTypeListData.response.forEach(item => {
        if (systemRunData.response.nodeStatus === item.value) {
            systemState.value = item.description
        }
    })
})
//节点
const nodeChange = async () => {
    systemoption.value.forEach(item => {
        if (systemnodeValue.value === item.description) {
            systemnodeva.value = item.value
        }
    })
    const systemRunquery = {
        "nodeIp": systemnodeva.value,
        "period": timeValue.value === "" ? options.value[0].value : timeValue.value
    }
    const systemRunUrl = replaceOrAddUrlPath(url, '/system/detail')
    const systemRunData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/system/detail", "POST", JSON.stringify(systemRunquery))
    // systemState.value = systemRunData.response.nodeStatus
    runTime.value = systemRunData.response.runTime
    const diskUsage = echarts.init(window.document.getElementById("diskUsage"));
    let diskUsageoption = {
        tooltip: {
            formatter: `利用率  : ${(Number(systemRunData.response.diskUsage.used) / (Number(systemRunData.response.diskUsage.total) / 100)).toFixed(2)}%`
        },
        series: [
            {
                name: 'diskUsage',
                type: 'gauge',
                progress: {
                    show: true
                },
                detail: {
                    valueAnimation: true,
                    formatter: systemRunData.response.diskUsage.total + "G"
                },
                data: [
                    {
                        value: Number(systemRunData.response.diskUsage.used) / (Number(systemRunData.response.diskUsage.total) / 100),
                        name: systemRunData.response.diskUsage.used + "G"
                    }
                ]
            }
        ]
    }
    diskUsage.setOption(diskUsageoption);
    const memoryUsageData = echarts.init(window.document.getElementById("memoryUsageData"));
    let dataX = []
    let dataY = []
    let tooltip = []
    systemRunData.response.memoryUsageData.forEach((item: any) => {
        let date = new Date(Number(item.x)).toLocaleString().split(" ")[1] // 这块呢，我把时间 年-月-日 空格 时：分：秒 我用空格截取的，取的是 时分秒 用来显示 X轴的时分秒
        let tooltipS = new Date(Number(item.x)).toLocaleString() // 这块呢，我没截取，就是 年月日时分秒 用来显示完整的时间
        tooltip.push(tooltipS)
        dataX.push(date)
        dataY.push(item.y)
    })

    const memoryUsageoption = {
        tooltip: { // 鼠标移入的 title 相关的对象
            trigger: 'axis',
            formatter: function (params) { // 鼠标移入当前的事件，会默认带出一个参数，相关的数据
                let tooltipContent = ` 利用率: ${Number(params[0].value).toFixed(2)} %<br/>${tooltip[params[0].dataIndex]}` // 拼接数据
                return tooltipContent // return 数据回去显示
            }
        },
        xAxis: {
            type: 'category',
            data: dataX,
            axisLabel: {
                fontSize: 8,
                interval: 0,
                rotate: 30// 旋转角度
            },
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: dataY,
                type: 'line',
                showSymbol: false, //是否显示 线上面的 节点
                smooth: true //线是否圆润，就是圆角线
            }
        ]
    }
    memoryUsageData.setOption(memoryUsageoption);
    const cupUsageData = echarts.init(window.document.getElementById("cupUsageData"));
    let cupUsagedataX = []
    let cupUsagedataY = []
    let cputooltip = []
    systemRunData.response.cupUsageData.forEach((item: any) => {
        let date = new Date(Number(item.x)).toLocaleString().split(" ")[1]
        let cputooltipS = new Date(Number(item.x)).toLocaleString()
        cputooltip.push(cputooltipS)
        cupUsagedataX.push(date)
        cupUsagedataY.push(item.y)
    })
    const cupUsageoption = {
        tooltip: { // 鼠标移入的 title 相关的对象
            trigger: 'axis',
            formatter: function (params) { // 鼠标移入当前的事件，会默认带出一个参数，相关的数据
                let tooltipContent = ` 利用率: ${Number(params[0].value).toFixed(2)} %<br/>${tooltip[params[0].dataIndex]}` // 拼接数据
                return tooltipContent // return 数据回去显示
            }
        },
        xAxis: {
            type: 'category',
            data: cupUsagedataX,
            axisLabel: {
                fontSize: 8,
                interval: 0,
                rotate: 40// 旋转角度
            },
        },
        yAxis: {
            type: 'value'
            // interval: 10
        },
        series: [
            {
                data: cupUsagedataY,
                type: 'line',
                showSymbol: false, //是否显示 线上面的 节点
                smooth: true
            }
        ]
    }
    cupUsageData.setOption(cupUsageoption);
    //获取系统节点状态枚举
    const systemStatusTypeListUrl = replaceOrAddUrlPath(url, '/systemStatusTypeList')
    const systemStatusTypeListData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/systemStatusTypeList", "GET")
    systemStatusTypeListData.response.forEach(item => {
        if (systemRunData.response.nodeStatus === item.value) {
            systemState.value = item.description
        }
    })
}
//时间
const timeChange = async () => {
    const systemRunquery = {
        "nodeIp": systemnodeValue.value === "" ? systemoption.value[0].value : systemnodeva.value,
        "period": timeValue.value
    }
    const systemRunUrl = replaceOrAddUrlPath(url, '/system/detail')
    const systemRunData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/system/detail", "POST", JSON.stringify(systemRunquery))
    // systemState.value = systemRunData.response.nodeStatus
    runTime.value = systemRunData.response.runTime
    const diskUsage = echarts.init(window.document.getElementById("diskUsage"));
    let diskUsageoption = {
        tooltip: {
            formatter: `利用率  : ${(Number(systemRunData.response.diskUsage.used) / (Number(systemRunData.response.diskUsage.total) / 100)).toFixed(2)}%`
        },
        series: [
            {
                name: 'diskUsage',
                type: 'gauge',
                progress: {
                    show: true
                },
                detail: {
                    valueAnimation: true,
                    formatter: systemRunData.response.diskUsage.total + "G"
                },
                data: [
                    {
                        value: Number(systemRunData.response.diskUsage.used) / (Number(systemRunData.response.diskUsage.total) / 100),
                        name: systemRunData.response.diskUsage.used + "G"
                    }
                ]
            }
        ]
    }
    diskUsage.setOption(diskUsageoption);
    const memoryUsageData = echarts.init(window.document.getElementById("memoryUsageData"));
    let dataX = []
    let dataY = []
    let tooltip = []
    systemRunData.response.memoryUsageData.forEach((item: any) => {
        let date = new Date(Number(item.x)).toLocaleString().split(" ")[1] // 这块呢，我把时间 年-月-日 空格 时：分：秒 我用空格截取的，取的是 时分秒 用来显示 X轴的时分秒
        let tooltipS = new Date(Number(item.x)).toLocaleString() // 这块呢，我没截取，就是 年月日时分秒 用来显示完整的时间
        tooltip.push(tooltipS)
        dataX.push(date)
        dataY.push(item.y)
    })

    const memoryUsageoption = {
        tooltip: { // 鼠标移入的 title 相关的对象
            trigger: 'axis',
            formatter: function (params) { // 鼠标移入当前的事件，会默认带出一个参数，相关的数据
                let tooltipContent = ` 利用率: ${Number(params[0].value).toFixed(2)} %<br/>${tooltip[params[0].dataIndex]}` // 拼接数据
                return tooltipContent // return 数据回去显示
            }
        },
        xAxis: {
            type: 'category',
            data: dataX,
            axisLabel: {
                fontSize: 8,
                interval: 0,
                rotate: 30// 旋转角度
            },
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: dataY,
                type: 'line',
                showSymbol: false, //是否显示 线上面的 节点
                smooth: true //线是否圆润，就是圆角线
            }
        ]
    }
    memoryUsageData.setOption(memoryUsageoption);
    const cupUsageData = echarts.init(window.document.getElementById("cupUsageData"));
    let cupUsagedataX = []
    let cupUsagedataY = []
    let cputooltip = []
    systemRunData.response.cupUsageData.forEach((item: any) => {
        let date = new Date(Number(item.x)).toLocaleString().split(" ")[1]
        let cputooltipS = new Date(Number(item.x)).toLocaleString()
        cputooltip.push(cputooltipS)
        cupUsagedataX.push(date)
        cupUsagedataY.push(item.y)
    })
    const cupUsageoption = {
        tooltip: { // 鼠标移入的 title 相关的对象
            trigger: 'axis',
            formatter: function (params) { // 鼠标移入当前的事件，会默认带出一个参数，相关的数据
                let tooltipContent = ` 利用率: ${Number(params[0].value).toFixed(2)} %<br/>${tooltip[params[0].dataIndex]}` // 拼接数据
                return tooltipContent // return 数据回去显示
            }
        },
        xAxis: {
            type: 'category',
            data: cupUsagedataX,
            axisLabel: {
                fontSize: 8,
                interval: 0,
                rotate: 40// 旋转角度
            },
        },
        yAxis: {
            type: 'value'
            // interval: 10
        },
        series: [
            {
                data: cupUsagedataY,
                type: 'line',
                showSymbol: false, //是否显示 线上面的 节点
                smooth: true
            }
        ]
    }
    cupUsageData.setOption(cupUsageoption);
    //获取系统节点状态枚举
    const systemStatusTypeListUrl = replaceOrAddUrlPath(url, '/systemStatusTypeList')
    const systemStatusTypeListData = await getManageInfo("https://apifoxmock.com/m1/5219875-4886398-default/test", "GET")
    systemStatusTypeListData.response.forEach(item => {
        if (systemRunData.response.nodeStatus === item.value) {
            systemState.value = item.description
        }
    })
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