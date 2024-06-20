<template>
  <!-- <h1>block2</h1> -->
  <div
    style="background-color: #ffffff"
    v-for="(item, index) in store.state.list"
    :key="index"
    :style="{
      position: isFullscreen ? 'fixed' : 'static',
      top: isFullscreen ? '0' : '0',
      left: isFullscreen ? '0' : '0',
      width: isFullscreen ? '100vw' : 'auto',
      zIndex: isFullscreen ? '5' : '0',
      height: isFullscreen ? '100vh' : 'auto',
      marginTop: isFullscreen ? '0' : '24px',
    }"
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
          <PushpinOutlined style="margin-left: 16px" @click="topClick(item)" />
          <UpOutlined
            :key="index"
            style="margin-left: 16px"
            @click="retract"
            v-if="!islaunch"
          />
          <DownOutlined style="margin-left: 16px" @click="retract" v-else />
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
            @click="removeModule(index)"
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
                  @blur="handleBlur(index)"
                >
                  {{ item.summary.query.text }}
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
      <el-col v-show="!islaunch">
        <!-- 展示 node -->
        <el-col
          style="background-color: #ffffff"
          v-if="
            item.records[0].keys.indexOf('n') !== -1 &&
            item.records[0].keys.indexOf('p') === -1 &&
            item.records[0]._fields[item.records[0].keys.indexOf('n')] &&
            item.records[0]._fields[item.records[0].keys.indexOf('n')].elementId &&
            item.records[0]._fields[item.records[0].keys.indexOf('n')].properties
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
              <div
                style="
                  border: #efefef solid 1px;
                  width: 100%;
                  display: flex;
                  flex-direction: row-reverse;
                  position: relative;
                "
                :style="{ height: isFullscreen ? '100vh' : '324px' }"
              >
              <!-- overview按钮 -->
                <div
                  style="
                    background-color: #dcdcdc30;
                    width: 45px;
                    height: 28px;
                    position: absolute;
                    z-index: 1;
                    right: 15px;
                    top: 8px;
                    box-shadow: 0 0 2px #ccc;
                    line-height: 33px;
                    text-align: center;
                    cursor: pointer;
                  "
                  @click="OverviewClick"
                  v-if="!overview"
                >
                  <ArrowLeftBold color="#999999" style="width: 16px" />
                </div>
                <!-- overview展开 -->
                <div  
                  style="
                    width: 328px;
                    min-height: 452px;
                    background-color: #ffffff;
                    box-shadow: 0 0 2px #ccc;
                    z-index: 1;
                    position: relative;
                  "
                  v-else
                >
                  <ArrowLeftBold
                    color="#999999"
                    style="
                      width: 16px;
                      position: absolute;
                      right: 0px;
                      top: 0px;
                      margin: 18px;
                      cursor: pointer;
                      z-index: 1;
                    "
                    @click="OverviewClick"
                  />
                  <el-row>
                    <el-col
                      style="margin: 10px; font-size: 18px; font-weight: 500"
                    >
                      Overview
                    </el-col>
                    <el-col style="margin: 0 0 0 10px">
                      <div style="font-weight: bold">Node labels</div>
                      <el-tag effect="dark" round>*({{ overNodeList.length }})</el-tag>
                      <el-tag effect="dark" round v-for="(item,index) in labels" :key="index" style="margin-left: 10px;">{{ item }}</el-tag>
                    </el-col>
                    <el-col style="margin: 10px 0 0 10px;">
                      Displaying {{ overNodeList.length }} nodes, 0 relationships.
                    </el-col>
                  </el-row>
                </div>
                <relation-graph ref="graphRef" :options="options" />
              </div>
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
              <div
                style="overflow: auto"
                :style="{ height: isFullscreen ? '100vh' : '324px' }"
              >
                <a-row
                  style="
                    font-size: 16px;
                    color: #666666;
                    height: 32px;
                    background-color: #ffffff;
                    border-bottom: 1px #999999 dashed;
                    padding-left: 16px;
                    z-index: 1;
                    position: sticky;
                    top: 0;
                    flex-wrap: nowrap;
                  "
                >
                  <!-- 这块是 node的table的标题 -->
                  <a-col
                    v-for="(item2, index2) in item.records[0].keys"
                    :key="index2"
                    :span="item.records[0].keys.length != 1 ? '6' : '24'"
                  >
                    {{ item2 }}
                  </a-col>
                </a-row>
                <!-- 这块是node的table的内容 -->
                <a-row
                  v-for="(item3, index3) in item.records"
                  :key="index3"
                  style="
                    flex-wrap: nowrap;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;
                  "
                >
                  <a-col
                    v-for="(item4, index4) in item3._fields"
                    :key="index4"
                    :span="item.records[0].keys.length != 1 ? '6' : '24'"
                  >
                    <pre
                      style="
                        margin-bottom: 10px;
                        padding: 10px;
                        margin-top: 10px;
                        margin-right: 30px;
                        background-color: rgb(239, 239, 239);
                        border-bottom: 1px solid #000000;
                        position: relative;
                      "
                    >
                  <CopyDocument style="width: 14px;height: 14px; position: absolute;right: 16px; cursor: pointer;" @click="tableCopy(item4)"/>
                  {{ JSON.stringify(item4 === null ? "null" : item4, null, 2)}}
                </pre>
                  </a-col>
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
              <div
                style="padding: 10px; overflow-y: auto"
                :style="{ height: isFullscreen ? '100vh' : '324px' }"
              >
                <el-row style="flex-wrap: nowrap; display: flex">
                  <el-col
                    style="border-right: none; border: 1px dashed #666666"
                    class="td"
                    v-for="(item5, index5) in item.records[0].keys"
                    :key="index5"
                    :span="6"
                  >
                    {{ item5 }}
                  </el-col>
                </el-row>
                <el-row v-for="(item6, index6) in item.records" :key="index6">
                  <el-col
                    class="td"
                    :span="6"
                    style="border-right: none; border: 1px dashed #666666"
                    v-for="(item7, index7) in item6._fields"
                    :key="index7"
                  >
                    {{
                      item7 === null
                        ? "null"
                        : item7.properties
                        ? item7.properties
                        : item7
                    }}
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
              <div
                style="padding: 10px; overflow-y: auto"
                :style="{ height: isFullscreen ? '100vh' : '324px' }"
              >
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
              <div
                style="  border: #efefef solid 1px;
                  width: 100%;
                  display: flex;
                  flex-direction: row-reverse;
                  position: relative;"
                :style="{ height: isFullscreen ? '100vh' : '324px' }"
              >
               <!-- overview按钮 -->
               <div
                  style="
                    background-color: #dcdcdc30;
                    width: 45px;
                    height: 28px;
                    position: absolute;
                    z-index: 1;
                    right: 15px;
                    top: 8px;
                    box-shadow: 0 0 2px #ccc;
                    line-height: 33px;
                    text-align: center;
                    cursor: pointer;
                  "
                  @click="OverviewClick2"
                  v-if="!overview2"
                >
                  <ArrowLeftBold color="#999999" style="width: 16px" />
                </div>
                <!-- overview展开 -->
                <div  
                  style="
                    width: 328px;
                    min-height: 452px;
                    background-color: #ffffff;
                    box-shadow: 0 0 2px #ccc;
                    z-index: 1;
                    position: relative;
                  "
                  v-else
                >
                  <ArrowLeftBold
                    color="#999999"
                    style="
                      width: 16px;
                      position: absolute;
                      right: 0px;
                      top: 0px;
                      margin: 18px;
                      cursor: pointer;
                      z-index: 1;
                    "
                    @click="OverviewClick2"
                  />
                  <el-row>
                    <el-col
                      style="margin: 10px; font-size: 18px; font-weight: 500"
                    >
                      Overview
                    </el-col>
                    <el-col style="margin: 0 0 0 10px">
                      <div style="font-weight: bold">Node labels</div>
                      <el-tag effect="dark" round>*({{ overNodeList2.length }})</el-tag>
                      <el-tag effect="dark" round v-for="(item,index) in labels2" :key="index" style="margin-left: 10px;">{{ item }}</el-tag>
                    </el-col>
                    <el-col style="margin: 10px 0 0 10px">
                      <div style="font-weight: bold">Relationship types</div>
                      <el-tag effect="dark" round>*({{ overNodeList2.length }})</el-tag>
                      <el-tag effect="dark" round v-for="(item,index) in labels2" :key="index" style="margin-left: 10px;">{{ item }}</el-tag>
                    </el-col> 
                    <el-col style="margin: 10px 0 0 10px;">
                      Displaying {{ overNodeList2.length }} nodes, 0 relationships.
                    </el-col>
                  </el-row>
                </div>
                <relation-graph ref="graphRef" :options="options" />
              </div>
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
              <div
                style="height: 324px; overflow: auto"
                :style="{ height: isFullscreen ? '100vh' : '324px' }"
              >
                <a-row
                  style="
                    font-size: 16px;
                    color: #666666;
                    height: 32px;
                    background-color: #ffffff;
                    border-bottom: 1px #999999 dashed;
                    padding-left: 16px;
                    z-index: 1;
                    position: sticky;
                    top: 0;
                    flex-wrap: nowrap;
                  "
                >
                  <a-col
                    v-for="(item2, index2) in item.records[0].keys"
                    :key="index2"
                    :span="item.records[0].keys.length != 1 ? '6' : '24'"
                  >
                    {{ item2 }}
                  </a-col>
                </a-row>
                <a-row
                  v-for="(item3, index3) in item.records"
                  :key="index3"
                  style="
                    flex-wrap: nowrap;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;
                  "
                >
                  <a-col
                    v-for="(item4, index4) in item3._fields"
                    :key="index4"
                    :span="item.records[0].keys.length != 1 ? '6' : '24'"
                  >
                    <pre
                      style="
                        margin-bottom: 10px;
                        padding: 10px;
                        margin-top: 10px;
                        margin-right: 30px;
                        background-color: rgb(239, 239, 239);
                        border-bottom: 1px solid #000000;
                        position: relative;
                      "
                    >
                    <CopyDocument style="width: 14px;height: 14px; position: absolute;right: 16px; cursor: pointer;" @click="tableCopy(item4)"/>
                  {{ JSON.stringify(item4 === null ? "null" : item4, null, 2)  }} </pre>
                  </a-col>
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
              <div
                style="padding: 10px; overflow-y: auto"
                :style="{ height: isFullscreen ? '100vh' : '324px' }"
              >
                <el-row style="flex-wrap: nowrap; display: flex">
                  <el-col
                    style="border-right: none; border: 1px dashed #666666"
                    class="td"
                    v-for="(item5, index5) in item.records[0].keys"
                    :key="index5"
                    :span="6"
                  >
                    {{ item5 }}
                  </el-col>
                </el-row>
                <el-row v-for="(item6, index6) in item.records" :key="index6">
                  <el-col
                    class="td"
                    :span="6"
                    style="border-right: none; border: 1px dashed #666666"
                    v-for="(item7, index7) in item6._fields"
                    :key="index7"
                  >
                    {{
                      item7 === null
                        ? "null"
                        : item7.start
                        ? item7.start.properties
                        : item7
                    }}
                    {{
                      item7 === null
                        ? "null"
                        : item7.start
                        ? item7.end.properties
                        : item7
                    }}
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
              <!-- <h1>code详情</h1> -->
              <div
                style="padding: 10px; overflow-y: auto"
                :style="{ height: isFullscreen ? '100vh' : '324px' }"
              >
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
              <div
                style="overflow-y: auto"
                :style="{ height: isFullscreen ? '100vh' : '324px' }"
              >
                <a-row
                  style="
                    font-size: 16px;
                    color: #666666;
                    height: 32px;
                    background-color: #ffffff;
                    border-bottom: 1px #999999 dashed;
                    padding-left: 16px;
                    z-index: 1;
                    position: sticky;
                    top: 0;
                    flex-wrap: nowrap;
                  "
                >
                  <a-col
                    v-for="(item2, index2) in item.records[0].keys"
                    :key="index2"
                    :span="item.records[0].keys.length != 1 ? '6' : '24'"
                  >
                    {{ item2 }}
                  </a-col>
                </a-row>
                <a-row
                  v-for="(item3, index3) in item.records"
                  :key="index3"
                  style="
                    flex-wrap: nowrap;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;
                  "
                >
                  <a-col
                    v-for="(item4, index4) in item3._fields"
                    :key="index4"
                    :span="item.records[0].keys.length != 1 ? '6' : '24'"
                  >
                    <pre
                      style="
                        margin-bottom: 10px;
                        padding: 10px;
                        margin-top: 10px;
                        margin-right: 30px;
                        background-color: rgb(239, 239, 239);
                        border-bottom: 1px solid #000000;
                        position: relative;
                      "
                    >
                    <CopyDocument style="width: 14px;height: 14px; position: absolute;right: 16px; cursor: pointer;" @click="tableCopy(item4)"/>
                  {{
                        JSON.stringify(item4 === null ? "null" : item4, null, 2)
                      }}</pre>
                  </a-col>
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
              <div
                style="padding: 10px; overflow-y: auto"
                :style="{ height: isFullscreen ? '100vh' : '324px' }"
              >
                <el-row style="flex-wrap: nowrap; display: flex">
                  <el-col
                    style="border-right: none; border: 1px dashed #666666"
                    class="td"
                    v-for="(item5, index5) in item.records[0].keys"
                    :key="index5"
                    :span="6"
                  >
                    {{ item5 }}
                  </el-col>
                </el-row>
                <el-row v-for="(item6, index6) in item.records" :key="index6">
                  <el-col
                    class="td"
                    :span="6"
                    style="border-right: none; border: 1px dashed #666666"
                    v-for="(item7, index7) in item6._fields"
                    :key="index7"
                  >
                    {{ item7 === null ? "null" : item7 }}
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
              <div
                style="padding: 10px; overflow-y: auto"
                :style="{ height: isFullscreen ? '100vh' : '324px' }"
              >
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
        <!-- 时间戳 -->
        <div
          style="
            width: 100%;
            height: 24px;
            border-top: 1px #666666 solid;
            background-color: #ffffff;
            line-height: 24px;
            padding-left: 16px;
          "
        >
          Started streaming 25 records in less than 1 ms and completed after 3ms.
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import RelationGraph from "relation-graph/vue3";
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
import { ArrowLeftBold, CopyDocument } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "../../utils/request.js";
const tabPosition = ref<TabsInstance["tabPosition"]>("left");
const store = useStore();
//graph
const graphRef = ref<RelationGraph>();
const options = {
  defaultExpandHolderPosition: "right",
};
const graphList = ref([]); // 定义个数组
const overview = ref(false);
const overview2 = ref(false);
const islaunch = ref(false);
const isFullscreen = ref(false);
const overNodeList = ref([])
const overNodeList2 = ref([])
const labels = ref([])
const labels2 = ref([])
//复制
const tableCopy = (item4: any) => {
  navigator.clipboard.writeText(
    JSON.stringify(item4 === null ? null : item4, null, 2)
  );
  ElMessage({
    message: "内容已复制到剪贴板",
    type: "success",
    plain: true,
  });
};
//置顶
const topClick = (item) => {
  console.log("置顶");
};
//放大
const toggleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value;
  console.log("放大");
};
//收起
const retract = () => {
  islaunch.value = !islaunch.value;
};
//overview
const OverviewClick = () => {
  overview.value = !overview.value;
};
//overview2
const OverviewClick2 = () => {
  overview2.value = !overview2.value;
};
//删除
const removeModule = (index:any) => {
  // store.commit("remove", index);
};
//输入
const handleBlur = (index) => {
  console.log(index, 788);
};
watch(store.state.list, async (newVal, oldVal) => {
  console.log(oldVal, 648);
  await nextTick(); // 因为要获取dom，放在nextTick之后，要等dom加载完成
  if (
    oldVal[oldVal.length - 1].records[0].keys.indexOf("n") !== -1 &&
    oldVal[oldVal.length - 1].records[0].keys.indexOf("p") === -1 &&
    oldVal[oldVal.length - 1].records[0]._fields[oldVal[oldVal.length - 1].records[0].keys.indexOf("n")] &&
    oldVal[oldVal.length - 1].records[0]._fields[oldVal[oldVal.length - 1].records[0].keys.indexOf("n")].elementId &&
    oldVal[oldVal.length - 1].records[0]._fields[oldVal[oldVal.length - 1].records[0].keys.indexOf("n")].properties
  ) {
    console.log("我是节点");
    let textName = ref("");
    //节点图数据处理
    let list = [
      {
        rootId: graphList.value.length === 0 ? 1 : graphList.value.length + 1,
        nodes: [],
        lines: [],
      },
    ];
    oldVal[oldVal.length - 1].records.map((item: any) => {
      if (item.keys.indexOf("n") !== -1) {
        for (const key in item._fields[item.keys.indexOf("n")].properties) {
          textName.value = item._fields[item.keys.indexOf("n")].properties[key];
        }
        list[0].nodes.push({
          id: item._fields[item.keys.indexOf("n")].elementId,
          text: textName.value,
          color: "#21a1ff",
        });
      }
    });
    // console.log(list,"927")
    graphList.value.push(list);
    console.log(graphList.value,"929")
    oldVal.map((item, index) => {
      console.log(item,"931")
      if (index === oldVal.length - 1) {
        graphRef.value[index].setJsonData(graphList.value[index][0]);
      }
      //取节点数组
      const set = new Set(item.records.map(JSON.stringify));
       overNodeList.value =  Array.from(set).map(JSON.parse)
       console.log(overNodeList.value,' ')
       overNodeList.value.map(item2=>{
        labels.value.push(...item2._fields[item2.keys.indexOf("n")].labels)
       })
       labels.value = new Set(labels.value)
      labels.value = Array.from(labels.value)
      //  console.log(labels.value,'labels')
    });

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
    //关系图数据处理
    let textName = ref("");
    let textTitle = ref("");
    let list = [
      {
        rootId: graphList.value.length === 0 ? 1 : graphList.value.length + 1,
        nodes: [],
        lines: [],
      },
    ];
    oldVal[oldVal.length - 1].records.map((item: any) => {
      if (item.keys.indexOf("p") !== -1) {
        for (const key in item._fields[item.keys.indexOf("p")].start
          .properties) {
          textName.value =
            item._fields[item.keys.indexOf("p")].start.properties[key];
        }
        for (const key in item._fields[item.keys.indexOf("p")].end.properties) {
          textTitle.value =
            item._fields[item.keys.indexOf("p")].end.properties[key];
        }
        list[0].nodes.push({
          id: item._fields[item.keys.indexOf("p")].start.elementId,
          text: textName.value,
          color: "#21a1ff",
        });
        list[0].nodes.push({
          id: item._fields[item.keys.indexOf("p")].end.elementId,
          text: textTitle.value,
          color: "#21a1ff",
        });
        list[0].lines.push({
          from: item._fields[item.keys.indexOf("p")].start.elementId,
          to: item._fields[item.keys.indexOf("p")].end.elementId,
          text: item._fields[item.keys.indexOf("p")].segments[0].relationship
            .type,
          color: "#666666",
        });
      }
    });
    console.log(list, 839);
    graphList.value.push(list);
    oldVal.map((item, index) => {
      // console.log(item,1078)
      if (index === oldVal.length - 1) {
        graphRef.value[index].setJsonData(graphList.value[index][0]);
      }
      //取节点数组
      item.records.map(item2=>{
        // console.log(item2,1085)
         overNodeList2.value.push(item2._fields[item2.keys.indexOf("p")].start,item2._fields[item2.keys.indexOf("p")].end)
      })
      // const set = new Set(item.records.map(JSON.stringify));
      //  overNodeList2.value =  Array.from(set).map(JSON.parse)
       console.log(overNodeList2.value,'1085 ')
       const set = new Set(overNodeList2.value.map(JSON.stringify));
       overNodeList2.value =  Array.from(set).map(JSON.parse)
       overNodeList2.value.map(item3=>{
        labels2.value.push(...item3.labels)
       })
       labels2.value = new Set(labels2.value)
      labels2.value = Array.from(labels2.value)
       console.log(labels2.value,'labels2')
    });
  } else {
    console.log("我是keys");
  }
});
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
::v-deep.relation-graph .rel-toolbar-v-center {
  top: calc((100% - 240px) / 2) !important;
}
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