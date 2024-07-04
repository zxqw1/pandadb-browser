<template>
  <div
    style="background-color: #ffffff"
    v-for="(item, index) in list"
    :key="item.id"
    :style="{
      position: isFullscreen ? 'fixed' : 'static',
      top: isFullscreen ? '0' : '0',
      left: isFullscreen ? '0' : '0',
      width: isFullscreen ? '100vw' : 'auto',
      zIndex: isFullscreen ? '5' : '0',
    }"
  >
    <el-row>
      <div
        style="background-color: #f6f6f6; width: 100%; height: 24px"
        v-if="!isFullscreen"
      ></div>
      <!-- 右上 -->
      <el-col
        style="
          background-color: #ffffff;
          display: flex;
          flex-direction: row-reverse;
          height: 24px;
          padding-right: 14px;
          padding-top: 4px;
        "
      >
        <div class="topIcon">
          <PushpinOutlined
            style="margin-left: 16px"
            @click="topClick(index, item)"
          />
          <DownOutlined
            style="margin-left: 16px"
            v-if="item.show"
            @click="item.show = false"
          />
          <UpOutlined
            v-else
            style="margin-left: 16px"
            @click="item.show = true"
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
            @click="removeModule(index)"
          />
        </div>
      </el-col>
      <!-- 搜索 -->
      <search3 :command="item.summary.query.text" :index="index" />
      <!-- 展示 -->
      <el-col
        style="height: 348px; margin-top: 12px"
        v-show="!item.show"
        :style="{
          height: isFullscreen ? '100vh' : 'auto',
        }"
      >
        <!-- node -->
        <el-col
          v-if="
            item.records[0].keys.indexOf('n') !== -1 &&
            item.records[0].keys.indexOf('p') === -1 &&
            item.records[0]._fields[item.records[0].keys.indexOf('n')] &&
            item.records[0]._fields[item.records[0].keys.indexOf('n')]
              .elementId &&
            item.records[0]._fields[item.records[0].keys.indexOf('n')]
              .properties
          "
        >
          <el-tabs
            :tab-position="tabPosition"
            class="demo-tabs graphMenu"
            :style="{ height: isFullscreen ? '100vh' : '324px' }"
          >
            <el-tab-pane label="graph">
              <!-- label标题 -->
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
              <!-- 图 -->
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
                      <el-tag effect="dark" round>*(0)</el-tag>
                      <el-tag effect="dark" round style="margin-left: 10px"
                        >123</el-tag
                      >
                    </el-col>
                    <el-col style="margin: 10px 0 0 10px">
                      Displaying nodes, 0 relationships.
                    </el-col>
                  </el-row>
                </div>
                <RelationGraph
                  ref="graphRef"
                  :options="options"
                  style="height: 336px"
                  :style="{ height: isFullscreen ? '100vh' : '324px' }"
                ></RelationGraph>
              </div>
            </el-tab-pane>
            <el-tab-pane label="table">
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
              <!-- 详情 -->
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
                  {{ JSON.stringify(item4 === null ? null : item4, null, 2)}}
                </pre>
                  </a-col>
                </a-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="text">
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
              <!-- 详情 -->
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
                    :span="item.records[0].keys.length !== 1 ? 6 : 24"
                  >
                    {{ item5 }}
                  </el-col>
                </el-row>
                <el-row v-for="(item6, index6) in item.records" :key="index6">
                  <el-col
                    class="td"
                    :span="item.records[0].keys.length !== 1 ? 6 : 24"
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
              <!-- 详情 -->
              <div style="padding: 10px; overflow-y: auto">
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
        <!-- relation -->
        <el-col
          v-else-if="
            item.records[0].keys.indexOf('p') !== -1 &&
            item.records[0]._fields[0] &&
            item.records[0]._fields[item.records[0].keys.indexOf('p')].end &&
            item.records[0]._fields[item.records[0].keys.indexOf('p')].start
          "
        >
          <el-tabs
            :tab-position="tabPosition"
            class="demo-tabs graphMenu"
            :style="{ height: isFullscreen ? '100vh' : '324px' }"
          >
            <el-tab-pane label="graph">
              <!-- graph标题 -->
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
                      <el-tag effect="dark" round>*(0)</el-tag>
                      <el-tag effect="dark" round style="margin-left: 10px"
                        >123</el-tag
                      >
                    </el-col>
                    <el-col style="margin: 10px 0 0 10px">
                      Displaying nodes, 0 relationships.
                    </el-col>
                  </el-row>
                </div>
                <RelationGraph
                  ref="graphRef"
                  :options="options"
                  style="height: 336px"
                  :style="{ height: isFullscreen ? '100vh' : '324px' }"
                ></RelationGraph>
              </div>
            </el-tab-pane>
            <el-tab-pane label="table">
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
              <!-- 详情 -->

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
              <!-- 详情 -->

              <div style="padding: 10px; overflow-y: auto">
                <el-row style="flex-wrap: nowrap; display: flex">
                  <el-col
                    style="border-right: none; border: 1px dashed #666666"
                    class="td"
                    v-for="(item5, index5) in item.records[0].keys"
                    :key="index5"
                    :span="item.records[0].keys.length != 1 ? 6 : 24"
                  >
                    {{ item5 }}
                  </el-col>
                </el-row>
                <el-row v-for="(item6, index6) in item.records" :key="index6">
                  <el-col
                    class="td"
                    :span="item.records[0].keys.length != 1 ? 6 : 24"
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
              <!-- 详情 -->

              <div style="padding: 10px; overflow-y: auto">
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
        <!-- keys -->
        <el-col v-else>
          <el-tabs
            :tab-position="tabPosition"
            class="demo-tabs graphMenu"
            :style="{ height: isFullscreen ? '100vh' : '324px' }"
          >
            <el-tab-pane label="table">
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
              <!-- 详情 -->
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
              <!-- 详情 -->
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
                    :span="item.records[0].keys.length != 1 ? 6 : 24"
                  >
                    {{ item5 }}
                  </el-col>
                </el-row>
                <el-row v-for="(item6, index6) in item.records" :key="index6">
                  <el-col
                    class="td"
                    :span="item.records[0].keys.length != 1 ? 6 : 24"
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
              <!-- 详情 -->
              <div style="padding: 10px; overflow-y: auto">
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
      </el-col>
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
        Transmit {{ item.records.length }} records within {{ item.resTime }}.
      </div>
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
  CaretRightOutlined,
  CaretDownOutlined,
  VerticalAlignBottomOutlined,
  ShrinkOutlined,
  UpOutlined,
} from "@ant-design/icons-vue";
import { ArrowLeftBold, CopyDocument } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "../../utils/request.js";
import mitts from "../../utils/bus.js";
//组件
import search3 from "../rightComponents/blockcomponents/search3.vue";
//变量
const tabPosition = ref<TabsInstance["tabPosition"]>("left");
const store = useStore();
const options = {};
const graphRef = ref<RelationGraph>();
const isFullscreen = ref(false);
const isunfold = ref(false);
const isres = ref(false);
const text = ref("");
const inputValue = ref("");
const overview = ref(false);
const list = ref([]);
const OverviewClick = () => {
  overview.value = !overview.value;
};
const unfoldClick = () => {
  isunfold.value = !isunfold.value;
};
const resClick = () => {
  isres.value = !isres.value;
};
// 置顶
const topClick = (index: Number, item: any) => {
  list.value.splice(index, 1);
  mitts.emit("topData", item);
};
//放大
const toggleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value;
};
//修改
mitts.on("revise", (revieseResult: any) => {
  revieseResult.id = generateRandomId();
  revieseResult.show = false;
  list.value[revieseResult.number] = revieseResult;
  let textName = "";
  let textTitle = "";
  revieseResult.graphData = {
    rootId: list.value.length,
    nodes: [],
    lines: [],
  };
  revieseResult.records.forEach((item: any, index: Number) => {
    if (
      item.keys.indexOf("n") !== -1 &&
      item.keys.indexOf("p") === -1 &&
      item._fields[item.keys.indexOf("n")] &&
      item._fields[item.keys.indexOf("n")].elementId &&
      item._fields[item.keys.indexOf("n")].properties
    ) {
      for (const key in item._fields[item.keys.indexOf("n")].properties) {
        textName = item._fields[item.keys.indexOf("n")].properties[key];
      }
      revieseResult.graphData.nodes.push({
        id: item._fields[item.keys.indexOf("n")].elementId,
        text: textName,
        color: "#21a1ff",
      });
    } else if (
      item.keys.indexOf("p") !== -1 &&
      item._fields[0] &&
      item._fields[item.keys.indexOf("p")].end &&
      item._fields[item.keys.indexOf("p")].start
    ) {
      for (const key in item._fields[item.keys.indexOf("p")].start.properties) {
        textName = item._fields[item.keys.indexOf("p")].start.properties[key];
      }
      for (const key in item._fields[item.keys.indexOf("p")].end.properties) {
        textTitle = item._fields[item.keys.indexOf("p")].end.properties[key];
      }
      revieseResult.graphData.nodes.push({
        id: item._fields[item.keys.indexOf("p")].start.elementId,
        text: textName,
        color: "#21a1ff",
      });
      revieseResult.graphData.nodes.push({
        id: item._fields[item.keys.indexOf("p")].end.elementId,
        text: textTitle,
        color: "#21a1ff",
      });
      revieseResult.graphData.lines.push({
        from: item._fields[item.keys.indexOf("p")].start.elementId,
        to: item._fields[item.keys.indexOf("p")].end.elementId,
        text: item._fields[item.keys.indexOf("p")].segments[0].relationship
          .type,
        color: "#666666",
      });
    } else {
      console.log("我是keys");
    }
  });
  console.log(list.value, "979");
  nextTick(() => {
    graphRef.value[revieseResult.number].setJsonData(revieseResult.graphData);
  });
});

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
//删除
const removeModule = (index: Number) => {
  list.value.splice(index, 1);
};
// mitts.on("Data", (item: any) => {
//   list.value.push(item);
//   nextTick(() => {
//     graphRef.value[list.value.length - 1].setJsonData(item.graphData);
//   });
// });
//生成数据唯一id
const generateRandomId = () => {
  const timestamp = new Date().getTime(); // 获取当前时间戳
  const randomNum = Math.floor(Math.random() * 1000); // 生成一个0-999之间的随机数
  return `id_${timestamp}_${randomNum}`; // 返回拼接后的ID字符串
};
//数据
mitts.on("params", (result: any) => {
  result.id = generateRandomId();
  list.value.push(result);
  let textName = "";
  let textTitle = "";
  result.graphData = {
    rootId: list.value.length,
    nodes: [],
    lines: [],
  };
  result.records.forEach((item: any, index: Number) => {
    if (
      item.keys.indexOf("n") !== -1 &&
      item.keys.indexOf("p") === -1 &&
      item._fields[item.keys.indexOf("n")] &&
      item._fields[item.keys.indexOf("n")].elementId &&
      item._fields[item.keys.indexOf("n")].properties
    ) {
      for (const key in item._fields[item.keys.indexOf("n")].properties) {
        textName = item._fields[item.keys.indexOf("n")].properties[key];
      }
      result.graphData.nodes.push({
        id: item._fields[item.keys.indexOf("n")].elementId,
        text: textName,
        color: "#21a1ff",
      });
    } else if (
      item.keys.indexOf("p") !== -1 &&
      item._fields[0] &&
      item._fields[item.keys.indexOf("p")].end &&
      item._fields[item.keys.indexOf("p")].start
    ) {
      for (const key in item._fields[item.keys.indexOf("p")].start.properties) {
        textName = item._fields[item.keys.indexOf("p")].start.properties[key];
      }
      for (const key in item._fields[item.keys.indexOf("p")].end.properties) {
        textTitle = item._fields[item.keys.indexOf("p")].end.properties[key];
      }
      result.graphData.nodes.push({
        id: item._fields[item.keys.indexOf("p")].start.elementId,
        text: textName,
        color: "#21a1ff",
      });
      result.graphData.nodes.push({
        id: item._fields[item.keys.indexOf("p")].end.elementId,
        text: textTitle,
        color: "#21a1ff",
      });
      result.graphData.lines.push({
        from: item._fields[item.keys.indexOf("p")].start.elementId,
        to: item._fields[item.keys.indexOf("p")].end.elementId,
        text: item._fields[item.keys.indexOf("p")].segments[0].relationship
          .type,
        color: "#666666",
      });
    } else {
      console.log("我是keys");
    }
  });
  nextTick(() => {
    graphRef.value[list.value.length - 1].setJsonData(result.graphData);
  });
});
onMounted(() => {});
const inputChange = (e: any) => {
  inputValue.value = e.target.value;
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