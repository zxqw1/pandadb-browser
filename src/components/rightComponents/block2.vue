<template>
  <!-- <h1>block2</h1> -->
  <div
    style="margin-top: 24px"
    v-for="(item, index) in store.state.list"
    :key="index"
  >
    <el-row>
      <!-- 右上 -->
      <el-col
        style="
          background-color: #ffffff;
          display: flex;
          flex-direction: row-reverse;
          height: 24px;
        "
      >
        <div class="topIcon">
          <PushpinOutlined style="margin-left: 16px" />
          <UpOutlined
            :key="index"
            style="margin-left: 16px"
            @click="retract(item)"
            v-if="!islaunch"
          />
          <DownOutlined
            style="margin-left: 16px"
            @click="retract(item)"
            v-else
          />
          <ExpandAltOutlined
            style="margin-left: 16px"
            @click="toggleFullScreen"
            v-if="!isFullscreen"
          />
          <ShrinkOutlined
            style="margin-left: 16px"
            @click="toggleFullScreen"
            v-else
          />
          <CloseOutlined
            style="margin-left: 16px"
            @click="removeModule(item)"
          />
        </div>
      </el-col>
      <!-- 输入 -->
      <el-col>
        <div class="search">
          <el-row>
            <el-col :span="23" style="display: flex; align-items: center">
              <!-- 输入框 -->
              <div
                class="searchBlock"
                style="
                  background-color: #f6f6f6;
                  width: 100%;
                  border-radius: 5px;
                  border: 1px dashed #d2dabb;
                  min-height: 32px;
                "
                @keydown.enter.prevent="handleEnter"
              >
                <!-- logo -->
                <img
                  src="../../assets/img/logos.png"
                  style="width: 44px; height: 30px"
                  alt=""
                />
                <!-- 真实输入 -->
                <div
                  contenteditable="true"
                  style="width: 96%"
                  class="searchText"
                  @blur="handleBlur"
                >
                  {{ context }}
                </div>
                <!-- 展示 -->
                <CaretRightOutlined
                  style="color: #6a8322; font-size: 28px"
                  @click="nodeShow"
                />
              </div>
            </el-col>
            <el-col
              :span="1"
              style="
                padding-left: 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
              "
            >
              <StarOutlined style="font-size: 20px; color: #666666" />
              <VerticalAlignBottomOutlined style="font-size: 24px" />
            </el-col>
          </el-row>
        </div>
      </el-col>
      <!-- 展示 node -->
      <el-col
        style="background-color: #ffffff"
        v-if="
          item.records[0].keys.indexOf('n') !== -1 &&
          item.records[0].keys.indexOf('p') === -1 &&
          item.records[0]._fields[0] &&
          item.records[0]._fields[0].elementId &&
          item.records[0]._fields[0].properties
        "
      >
        <el-tabs :tab-position="tabPosition" class="demo-tabs graphMenu">
          <el-tab-pane label="graph">
            <!-- graph-标题 -->
            <template #label>
              <span
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                "
              >
                <img
                  src="../../assets/img/图谱.png"
                  alt=""
                  style="width: 24px; height: 24px"
                />
                <span style="font-weight: 600; color: #666666" class="graph"
                  >graph</span
                >
              </span>
            </template>
            <!-- graph-详情 -->
            <h1>graph详情-node</h1>
            <!-- <div style="border: #efefef solid 1px; height: 324px; width: 100%">
              <relation-graph ref="graphRef" :options="options" />
            </div> -->
          </el-tab-pane>
          <el-tab-pane label="table">
            <!-- table-标题 -->
            <template #label>
              <div>
                <img
                  src="../../assets/img/表格.png"
                  alt=""
                  style="width: 24px; height: 24px"
                />
                <div style="font-weight: 600; color: #666666">table</div>
              </div>
            </template>
            <!-- table-详情 -->
            <!-- <h1>table详情</h1> -->
            <div style="height: 324px; overflow-y: scroll">
              <div
                style="
                  font-size: 16px;
                  color: #666666;
                  height: 32px;
                  background-color: #ffffff;
                  border-bottom: 1px #999999 dashed;
                  padding-left: 16px;
                  position: sticky;
                  top: 0;
                "
                v-for="(item2, index2) in item.records[0].keys"
                :key="index2"
              >
                {{ item2 }}
              </div>
              <pre
                v-for="(item3, index3) in item.records"
                :key="index3"
                style="
                  margin-bottom: 10px;
                  padding: 10px;
                  margin-top: 10px;
                  background-color: rgb(239, 239, 239);
                  border-bottom: 1px solid #000000;
                "
                >{{ JSON.stringify(item3._fields, null, 2) }}</pre
              >
            </div>
          </el-tab-pane>
          <el-tab-pane label="text">
            <!-- text-标题 -->
            <template #label>
              <div>
                <img
                  src="../../assets/img/文字.png"
                  alt=""
                  style="width: 24px; height: 24px"
                />
                <div style="font-weight: 600; color: #666666">text</div>
              </div>
            </template>
            <!-- text-详情 -->
            <h1>text详情</h1>
            <div style="padding: 10px; height: 324px; overflow-y: scroll">
              <el-row style="border: 1px dashed #666666">
                <el-col class="td">
                  {{ item.records[0].keys[0] }}
                </el-col>
                <el-col
                  class="td"
                  v-for="(item4, index4) in item.records"
                  :key="index4"
                >
                  {{ item4._fields[0].properties }}
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="code">
            <!-- code-标题 -->
            <template #label>
              <div>
                <img
                  src="../../assets/img/代码.png"
                  alt=""
                  style="width: 24px; height: 24px"
                />
                <div style="font-weight: 600; color: #666666">code</div>
              </div>
            </template>
            <!-- code-详情 -->
            <div style="padding: 10px; height: 324px; overflow-y: scroll">
              <el-row>
                <el-col class="severTitle" :span="8"> Server version</el-col>
                <el-col :span="16" class="severContent">
                  {{ item.summary.server.agent }}
                </el-col>
              </el-row>
              <el-row>
                <el-col class="severTitle" :span="8"> Server address</el-col>
                <el-col :span="16" class="severContent">
                  {{ item.summary.server.address }}
                </el-col>
              </el-row>
              <el-row>
                <el-col class="severTitle" :span="8"> Query </el-col>
                <el-col :span="16" class="severContent">
                  {{ item.summary.query.text }}
                </el-col>
              </el-row>
              <el-row>
                <el-col class="severTitle" :span="8">
                  Summary
                  <CaretRightOutlined v-if="!isunfold" @click="unfoldClick" />
                  <CaretDownOutlined v-else @click="unfoldClick" />
                </el-col>
                <el-col
                  :span="16"
                  :style="{ height: isunfold ? '100%' : '30px' }"
                  style="font-size: 16px; color: #666666; overflow: hidden"
                >
                  {{ item.summary }}
                </el-col>
              </el-row>
              <el-row>
                <el-col class="severTitle" :span="8">
                  Response
                  <CaretRightOutlined v-if="!isres" @click="resClick" />
                  <CaretDownOutlined v-else @click="resClick"
                /></el-col>
                <el-col
                  :span="16"
                  :style="{ height: isres ? '100%' : '30px' }"
                  style="font-size: 16px; color: #666666; overflow: hidden"
                >
                  {{ item.records }}
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <!-- 展示 relation -->
      <el-col
        style="background-color: #ffffff"
        v-else-if="
          item.records[0].keys.indexOf('p') !== -1 &&
          item.records[0]._fields[0] &&
          item.records[0]._fields[item.records[0].keys.indexOf('p')].end &&
          item.records[0]._fields[item.records[0].keys.indexOf('p')].start
        "
      >
        <el-tabs :tab-position="tabPosition" class="demo-tabs graphMenu">
          <el-tab-pane label="graph">
            <!-- graph-标题 -->
            <template #label>
              <span
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                "
              >
                <img
                  src="../../assets/img/图谱.png"
                  style="width: 24px; height: 24px"
                />
                <span style="font-weight: 600; color: #666666" class="graph"
                  >graph</span
                >
              </span>
            </template>
            <!-- graph-详情 -->
            <h1>graph详情-relation</h1>
            <!-- <div style="border: #efefef solid 1px; height: 324px; width: 100%">
              <relation-graph ref="graphRef$" :options="options" />
            </div> -->
          </el-tab-pane>
          <el-tab-pane label="table">
            <!-- table-标题 -->
            <template #label>
              <div>
                <img
                  src="../../assets/img/表格.png"
                  alt=""
                  style="width: 24px; height: 24px"
                />
                <div style="font-weight: 600; color: #666666">table</div>
              </div>
            </template>
            <!-- table-详情 -->
            <div style="height: 324px; overflow: scroll;max-width: 100%; ">
              <a-row
                style="
                  display: flex;
                  font-size: 16px;
                  color: #666666;
                  height: 32px;
                  background-color: #ffffff;
                  border-bottom: 1px #999999 dashed;
                  padding-left: 16px;
                  z-index: 1;
                  position: sticky;
                  top: 0;
                "
              >
                <a-col
                  v-for="(item5, index5) in item.records[0].keys"
                  :key="index5"
                  :style="{ width: moduleWidth + '%' }" 
                >
                  {{ item5 }}
                </a-col>
              </a-row>
              <a-row
                v-for="(item6, index6) in item.records"
                :key="index6"
                style="display: flex;"
                :style="{ width: moduleWidth + '%' }" 
              >
                <pre
                  style="
                    margin-bottom: 10px;
                    padding: 10px;
                    margin-top: 10px;
                    margin-right: 30px;
                    background-color: rgb(239, 239, 239);
                    border-bottom: 1px solid #000000;
                  "
                  v-for="(item7, index7) in item6._fields"
                  :key="index7"
                  >{{ JSON.stringify(item7 === null ? "null" : item7 , null, 2) }}</pre>
              </a-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="text">
            <!-- text-标题 -->
            <template #label>
              <div>
                <img
                  src="../../assets/img/文字.png"
                  alt=""
                  style="width: 24px; height: 24px"
                />
                <div style="font-weight: 600; color: #666666">text</div>
              </div>
            </template>
            <!-- text-详情 -->
            <h1>text详情</h1>
            <!-- <div style="padding: 10px; height: 324px; overflow-y: scroll">
              <el-row style="border: 1px dashed #666666">
                <el-col class="td">
                  {{ item.result.records[0].keys[0] }}
                </el-col>
                <el-col
                  class="td"
                  v-for="(item3, index3) in item.result.records"
                  :key="index3"
                >
                  {{ item3._fields[0].segments[0].start }} - [ :
                  {{ item3._fields[0].segments[0].relationship.type }}] (:{{
                    item3._fields[0].segments[0].end.labels[0]
                  }}
                  {{ item3._fields[0].segments[0].end.properties }})
                </el-col>
              </el-row>
            </div> -->
          </el-tab-pane>
          <el-tab-pane label="code">
            <!-- code-标题 -->
            <template #label>
              <div>
                <img
                  src="../../assets/img/代码.png"
                  alt=""
                  style="width: 24px; height: 24px"
                />
                <div style="font-weight: 600; color: #666666">code</div>
              </div>
            </template>
            <!-- code-详情 -->
            <!-- <h1>code详情</h1> -->
            <!-- <div style="padding: 10px; height: 324px; overflow-y: scroll">
              <el-row>
                <el-col class="severTitle" :span="8"> Server version</el-col>
                <el-col :span="16" class="severContent">
                  {{ item.result.summary.server.agent }}
                </el-col>
              </el-row>
              <el-row>
                <el-col class="severTitle" :span="8"> Server address</el-col>
                <el-col :span="16" class="severContent">
                  {{ item.result.summary.server.address }}
                </el-col>
              </el-row>
              <el-row>
                <el-col class="severTitle" :span="8"> Query </el-col>
                <el-col :span="16" class="severContent">
                  {{ item.result.summary.query.text }}
                </el-col>
              </el-row>
              <el-row>
                <el-col class="severTitle" :span="8">
                  Summary
                  <CaretRightOutlined v-if="!isunfold" @click="unfoldClick" />
                  <CaretDownOutlined v-else @click="unfoldClick" />
                </el-col>
                <el-col
                  :span="16"
                  :style="{ height: isunfold ? '100%' : '30px' }"
                  style="font-size: 16px; color: #666666; overflow: hidden"
                >
                  {{ item.result.summary }}
                </el-col>
              </el-row>
              <el-row>
                <el-col class="severTitle" :span="8">
                  Response
                  <CaretRightOutlined v-if="!isres" @click="resClick" />
                  <CaretDownOutlined v-else @click="resClick"
                /></el-col>
                <el-col
                  :span="16"
                  :style="{ height: isres ? '100%' : '30px' }"
                  style="font-size: 16px; color: #666666; overflow: hidden"
                >
                  {{ item.result.records }}
                </el-col>
              </el-row>
            </div> -->
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <!-- 展示keys -->
      <el-col style="background-color: #ffffff" v-else>
        <el-tabs :tab-position="tabPosition" class="demo-tabs graphMenu">
          <el-tab-pane label="table">
            <!-- table-标题 -->
            <template #label>
              <div>
                <img
                  src="../../assets/img/表格.png"
                  alt=""
                  style="width: 24px; height: 24px"
                />
                <div style="font-weight: 600; color: #666666">table</div>
              </div>
            </template>
            <!-- table-详情 -->
            <h1>table详情keys</h1>
            <!-- <el-row
              style="
                font-size: 16px;
                font-weight: 500;
                color: #666666;
                height: 32px;
                background-color: #ffffff;
                border-bottom: 1px #999999 dashed;
                padding-left: 16px;
                position: sticky;
                top: 0;
              "
            >
              <el-col
                :span="12"
                style="font-size: 16px; font-weight: 500; color: #666666"
                v-for="(item4, index4) in item.result.records[0].keys"
                :key="index4"
              >
                {{ item4 }}
              </el-col>
            </el-row> -->
            <!-- <div style="height: 292px; overflow-y: scroll">
              <el-row
                style="
                  font-size: 16px;
                  font-weight: 500;
                  color: #666666;
                  height: 32px;
                  background-color: #ffffff;
                  border-bottom: 1px #999999 dashed;
                  padding-left: 16px;
                "
                v-for="(item5, index5) in item.result.records"
                :key="index5"
              >
                <el-col :span="12">
                  {{ item5._fields[0] }}
                </el-col>
                <el-col :span="12">
                  {{ item5._fields[1] }}
                </el-col>
              </el-row>
            </div> -->
          </el-tab-pane>
          <el-tab-pane label="text">
            <!-- text-标题 -->
            <template #label>
              <div>
                <img
                  src="../../assets/img/文字.png"
                  alt=""
                  style="width: 24px; height: 24px"
                />
                <div style="font-weight: 600; color: #666666">text</div>
              </div>
            </template>
            <!-- text-详情 -->
            <h1>text详情</h1>
            <!-- <el-row>
              <el-col
                :span="4"
                class="text"
                style="border-bottom: none; font-weight: 500"
                v-for="(item5, index5) in item.result.records[0].keys"
                :key="index5"
              >
                {{ item5 }}
              </el-col>
            </el-row>
            <div style="height: 292px; overflow-y: scroll">
              <el-row
                style=""
                v-for="(item5, index5) in item.result.records"
                :key="index5"
              >
                <el-col :span="4" class="text">
                  {{ item5._fields[0] }}
                </el-col>
                <el-col :span="4" class="text">
                  {{ item5._fields[1] }}
                </el-col>
              </el-row>
            </div> -->
          </el-tab-pane>
          <el-tab-pane label="code">
            <!-- code-标题 -->
            <template #label>
              <div>
                <img
                  src="../../assets/img/代码.png"
                  alt=""
                  style="width: 24px; height: 24px"
                />
                <div style="font-weight: 600; color: #666666">code</div>
              </div>
            </template>
            <!-- code-详情 -->
            <h1>code详情</h1>
            <!-- <div style="padding: 10px; height: 324px; overflow-y: scroll">
              <el-row>
                <el-col class="severTitle" :span="8"> Server version</el-col>
                <el-col :span="16" class="severContent">
                  {{ item.result.summary.server.agent }}
                </el-col>
              </el-row>
              <el-row>
                <el-col class="severTitle" :span="8"> Server address</el-col>
                <el-col :span="16" class="severContent">
                  {{ item.result.summary.server.address }}
                </el-col>
              </el-row>
              <el-row>
                <el-col class="severTitle" :span="8"> Query </el-col>
                <el-col :span="16" class="severContent">
                  {{ item.result.summary.query.text }}
                </el-col>
              </el-row>
              <el-row>
                <el-col class="severTitle" :span="8">
                  Summary
                  <CaretRightOutlined v-if="!isunfold" @click="unfoldClick" />
                  <CaretDownOutlined v-else @click="unfoldClick" />
                </el-col>
                <el-col
                  :span="16"
                  :style="{ height: isunfold ? '100%' : '30px' }"
                  style="font-size: 16px; color: #666666; overflow: hidden"
                >
                  {{ item.result.summary }}
                </el-col>
              </el-row>
              <el-row>
                <el-col class="severTitle" :span="8">
                  Response
                  <CaretRightOutlined v-if="!isres" @click="resClick" />
                  <CaretDownOutlined v-else @click="resClick"
                /></el-col>
                <el-col
                  :span="16"
                  :style="{ height: isres ? '100%' : '30px' }"
                  style="font-size: 16px; color: #666666; overflow: hidden"
                >
                  {{ item.result.records }}
                </el-col>
              </el-row>
            </div> -->
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, nextTick,computed } from "vue";
import { useStore } from "vuex";
import RelationGraph from "relation-graph/vue3";
// 导入icon
import {
  PushpinOutlined,
  DownOutlined,
  ExpandAltOutlined,
  CloseOutlined,
  StarOutlined,
  CaretRightOutlined,
  CaretDownOutlined,
  VerticalAlignBottomOutlined,
  ShrinkOutlined,
  UpOutlined,
} from "@ant-design/icons-vue";
import { keysOf } from "element-plus/es/utils/objects.mjs";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "../../utils/request.js";
const tabPosition = ref<TabsInstance["tabPosition"]>("left");
const store = useStore();
const context = ref("");
//graph
const graphRef = ref<RelationGraph>();
const options = {
  defaultExpandHolderPosition: "right",
};
// let num = ref(0); // 定义一个从0开始的num
const graphList = ref([]); // 定义个数组
watch(store.state.list, async (newVal, oldVal) => {
  console.log(oldVal, 648);
  // await nextTick(); // 因为要获取dom，放在nextTick之后，要等dom加载完成
  //判断数据为节点的数据
  // if (oldVal[oldVal.length - 1].records[0].keys.length === 1) {
  //   if (
  //     oldVal[oldVal.length - 1].records[0]._fields[0] &&
  //     oldVal[oldVal.length - 1].records[0]._fields[0].elementId &&
  //     oldVal[oldVal.length - 1].records[0]._fields[0].properties
  //   ) {
  //     // console.log("n");
  //     console.log("我是节点");
  //     // let list = [
  //     //   {
  //     //     rootId: graphList.value.length === 0 ? 1 : graphList.value.length + 1,
  //     //     nodes: [],
  //     //     lines: [],
  //     //   }
  //     // ]
  //     // oldVal[oldVal.length-1].result.records.map((item)=>{
  //     //   list[0].nodes.push({
  //     //     id: item._fields[0].elementId,
  //     //     text: item._fields[0].properties.browserUsed,
  //     //     color: oldVal[oldVal.length-1].color
  //     //   })
  //     // })
  //     // graphList.value.push(list)
  //     // console.log(graphList.value,"668")
  //     // oldVal.map((item, index)=>{
  //     //   if(index === oldVal.length - 1){
  //     //     graphRef.value[index].setJsonData(graphList.value[index][0])
  //     //   }
  //     // })
  //     // console.log(list,"667")
  //     // console.log(graphRef,"669")
  //     // console.log(graphList.value,"669")

  //     // graphList.value[num.value] = {
  //     //   // 第一遍，num肯定是0，正好对应数组的下标0，给数组的下标0赋值，给个对象
  //     //   rootId: num.value, // 唯一id，就拿num就行
  //     //   nodes: [], // 必有的
  //     //   lines: [], // 必有的
  //     // };
  //     // console.log(list.value, "305")
  //     // if (list.value[0].result.records[0]._fields[0].properties.browserUsed) {
  //     //   list.value[0].result.records.map((item, index) => {
  //     //     // 循环取到的vuex的数据
  //     //     graphList.value[num.value].nodes.unshift({
  //     //       id: item._fields[0].elementId,
  //     //       text: item._fields[0].properties.browserUsed,
  //     //       color: list.value[0].color,
  //     //     });
  //     //   });
  //     // } else {
  //     //   list.value[0].result.records.map((item, index) => {
  //     //     // 循环取到的vuex的数据
  //     //     graphList.value[num.value].nodes.unshift({
  //     //       id: item._fields[0].elementId,
  //     //       text: item._fields[0].properties.name,
  //     //       color: list.value[0].color,
  //     //     });
  //     //   });
  //     // }
  //     // graphRef.value[num.value].setJsonData(graphList.value[num.value]);
  //     // num.value = ++num.value;
  //     // console.log("n");
  //   } else if (
  //     oldVal[oldVal.length - 1].records[0]._fields[0] &&
  //     oldVal[oldVal.length - 1].records[0]._fields[0].end &&
  //     oldVal[oldVal.length - 1].records[0]._fields[0].start
  //   ) {
  //     console.log("我是关系");
  //   } else {
  //     console.log("我是字符串");
  //   }
  // } else {
  //   if (
  //     oldVal[oldVal.length - 1].records[0].keys.indexOf("n") !== -1 &&
  //     oldVal[oldVal.length - 1].records[0].keys.indexOf("p") !== -1
  //   ) {
  //     oldVal[oldVal.length - 1].records[0]._fields.map((item) => {
  //       if (item && item.end && item.start) {
  //         console.log("我是关系2");
  //       }
  //     });
  //   } else {
  //     oldVal[oldVal.length - 1].records[0]._fields.map((item) => {
  //       if (item && item.elementId && item.properties) {
  //         // console.log("n");
  //         console.log("我是节点2");
  //         // let list = [
  //         //   {
  //         //     rootId: graphList.value.length === 0 ? 1 : graphList.value.length + 1,
  //         //     nodes: [],
  //         //     lines: [],
  //         //   }
  //         // ]
  //         // oldVal[oldVal.length-1].result.records.map((item)=>{
  //         //   list[0].nodes.push({
  //         //     id: item._fields[0].elementId,
  //         //     text: item._fields[0].properties.browserUsed,
  //         //     color: oldVal[oldVal.length-1].color
  //         //   })
  //         // })
  //         // graphList.value.push(list)
  //         // console.log(graphList.value,"668")
  //         // oldVal.map((item, index)=>{
  //         //   if(index === oldVal.length - 1){
  //         //     graphRef.value[index].setJsonData(graphList.value[index][0])
  //         //   }
  //         // })
  //         // console.log(list,"667")
  //         // console.log(graphRef,"669")
  //         // console.log(graphList.value,"669")

  //         // graphList.value[num.value] = {
  //         //   // 第一遍，num肯定是0，正好对应数组的下标0，给数组的下标0赋值，给个对象
  //         //   rootId: num.value, // 唯一id，就拿num就行
  //         //   nodes: [], // 必有的
  //         //   lines: [], // 必有的
  //         // };
  //         // console.log(list.value, "305")
  //         // if (list.value[0].result.records[0]._fields[0].properties.browserUsed) {
  //         //   list.value[0].result.records.map((item, index) => {
  //         //     // 循环取到的vuex的数据
  //         //     graphList.value[num.value].nodes.unshift({
  //         //       id: item._fields[0].elementId,
  //         //       text: item._fields[0].properties.browserUsed,
  //         //       color: list.value[0].color,
  //         //     });
  //         //   });
  //         // } else {
  //         //   list.value[0].result.records.map((item, index) => {
  //         //     // 循环取到的vuex的数据
  //         //     graphList.value[num.value].nodes.unshift({
  //         //       id: item._fields[0].elementId,
  //         //       text: item._fields[0].properties.name,
  //         //       color: list.value[0].color,
  //         //     });
  //         //   });
  //         // }
  //         // graphRef.value[num.value].setJsonData(graphList.value[num.value]);
  //         // num.value = ++num.value;
  //         // console.log("n");
  //       } else if (item && item.end && item.start) {
  //         console.log("我是关系2");
  //       } else {
  //         console.log("我是字符串2");
  //       }
  //     });
  //   }
  // }
  // });
  if (
    oldVal[oldVal.length - 1].records[0].keys.indexOf("n") !== -1 &&
    oldVal[oldVal.length - 1].records[0].keys.indexOf("p") === -1 &&
    oldVal[oldVal.length - 1].records[0]._fields[0] &&
    oldVal[oldVal.length - 1].records[0]._fields[0].elementId &&
    oldVal[oldVal.length - 1].records[0]._fields[0].properties
  ) {
    console.log("我是节点");
    context.value = oldVal[oldVal.length - 1].summary.query.text;
  } else if (
    oldVal[oldVal.length - 1].records[0].keys.indexOf("p") !== -1 &&
    oldVal[oldVal.length - 1].records[0]._fields[0] &&
    oldVal[oldVal.length - 1].records[0]._fields[
      oldVal[oldVal.length - 1].records[0].keys.indexOf("p")
    ].end &&
    oldVal[oldVal.length - 1].records[0]._fields[
      oldVal[oldVal.length - 1].records[0].keys.indexOf("p")
    ].start
  ) {
    console.log("我是关系");
    context.value = oldVal[oldVal.length - 1].summary.query.text;
  } else {
    console.log("我是keys");
  }
});
onMounted(async () => {});
//code
const isunfold = ref(false);
const isres = ref(false);
const unfoldClick = () => {
  isunfold.value = !isunfold.value;
};
const resClick = () => {
  isres.value = !isres.value;
};
</script>

<style scoped>
.text {
  font-size: 16px;
  color: #666666;
  border: 1px dashed #999999;
  display: flex;
  justify-content: center;
}
.topIcon {
  padding: 0 16px;
}
.search {
  width: 100%;
  background-color: #ffffff;
  padding: 4px 16px 10px;
}
.searchBlock {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-wrap: break-word;
}
.searchText:focus {
  outline: none;
}
</style>
<style>
.graphMenu .el-tabs__item {
  height: 72px;
}
.graphMenu .el-tabs__item.is-active {
  color: #6a8322 !important;
}
.graphMenu .el-tabs__active-bar {
  --el-tabs-header-height: 72px;
  background-color: #6a8322;
}
.graphMenu .el-tabs__content {
  height: 100%;
}
.graphMenu .el-tab-pane {
  height: 100%;
}
.td {
  border-bottom: 1px dashed black;
  font-size: 14px;
  color: #666666;
  padding: 10px;
}
.severTitle {
  font-size: 16px;
  color: #666666;
  font-weight: 600;
}
</style>