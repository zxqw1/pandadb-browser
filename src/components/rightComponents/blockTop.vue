<template>
  <div
    style="background-color: #ffffff"
    v-for="(item, index) in toplist"
    :key="item.id"
    :style="{
      position: isFullscreen ? 'fixed' : 'static',
      top: isFullscreen ? '0' : '0',
      left: isFullscreen ? '0' : '0',
      width: isFullscreen ? '100vw' : 'auto',
      zIndex: isFullscreen ? '5' : '0',
    }"
  >
    <el-row >
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
          <Pushpin-outlined
            style="margin-left: 16px;background-color: #999999"
            @click="topClick(index, item)"
          />
          <Down-outlined
            style="margin-left: 16px"
            v-if="item.show"
            @click="item.show = false"
          />
          <Up-outlined
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
      <el-col v-if="item.flagshowER":style="{ height: isFullscreen ? '100vh' : '324px' }"
      style="padding: 18px;"
      >
      <div style="display: flex">
        <el-tag effect="dark" type="danger"> ERROR </el-tag>
        <h3 style="font-weight: 500;margin-left: 16px;align-items: center;">pandaDB, Error message</h3>
      </div>
      <div style="width: 100%;background-color: rgb(210, 213, 218);padding: 20px;margin-top: 10px">
        {{ item.error }}
      </div>
      </el-col>
        <!-- node -->
        <el-col
          v-if="item.flagshowN">
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
                  <!-- overview展开 -->
                  <el-row>
                    <el-col
                      style="margin: 10px; font-size: 18px; font-weight: 500"
                    >
                      Overview
                    </el-col>
                    <el-col style="margin: 0 0 0 10px">
                      <div style="font-weight: bold">Node labels</div>
                      <el-tag effect="dark" round >*({{ resultNodes.length }})</el-tag>
                      <el-popover
                        placement="bottom"
                        :width="260"
                        trigger="click"
                      >
                        <template #reference>
                          <el-tag
                            @click="tagClick(key)"
                            effect="dark"
                            round
                            :color="getTagColor(key)"
                            style="margin-left: 10px; cursor: pointer;border: none"
                            v-for="(value, key) in item.labelList" :key="key"
                            >{{ key }}({{ value }})</el-tag>
                        </template>
                        <el-row >
                          <el-col>
                            <el-tag
                            v-for="(value, key) in item.labelList" :key="key"
                              effect="dark"
                              round
                              :color="getTagColor(key)"
                              style="width: 100%;border: none;margin-bottom: 10px"
                              >{{ key }}({{ value }})</el-tag
                            >
                          </el-col>
                          <el-col style="display: flex; margin-top: 12px" >
                            <ul
                              class="color"
                              style="
                                display: flex;
                                align-items: center;
                                justify-content: space-around;
                                width: 100%;
                                padding-left: 0;
                              "
                              @click="colorClick($event)"
                            >
                              <div>color:</div>
                              <li
                                style="background-color: rgb(96, 74, 14);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(201, 144, 192);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(247, 151, 103);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(87, 199, 227);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(241, 102, 103);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(217, 200, 174);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(141, 204, 147);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(236, 181, 201);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(76, 142, 218);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(255, 196, 84);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(218, 113, 148);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(86, 148, 128);cursor: pointer;"
                                class="li"
                              ></li>
                            </ul>
                          </el-col>
                          <el-col style="display: flex; margin-top: 12px">
                            <ul
                              class="size"
                              style="
                                display: flex;
                                align-items: center;
                                width: 100%;
                                padding-left: 0;
                              "
                              @click="sizeClick($event)"
                            >
                              <div>size:</div>
                              <li
                                class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 12px;
                                  height: 12px;
                                  border-radius: 50%;
                                  cursor: pointer;
                                "
                                data-size="40"
                              ></li>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 14px;
                                  height: 14px;
                                  border-radius: 50%;
                                  cursor: pointer;
                                "
                                data-size="60"
                              ></li>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 16px;
                                  height: 16px;
                                  border-radius: 50%;
                                  cursor: pointer;
                                "
                                data-size="80"
                              ></li>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 18px;
                                  height: 18px;
                                  border-radius: 50%;
                                  cursor: pointer;
                                "
                                data-size="100"
                              ></li>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 20px;
                                  height: 20px;
                                  border-radius: 50%;
                                  cursor: pointer;
                                "
                                data-size="120"
                              ></li>
                            </ul>
                          </el-col>
                          <el-col
                            style="
                              display: flex;
                              margin-top: 12px;
                              align-items: center;
                              flex-wrap: wrap;
                              cursor: pointer;
                            "
                          >
                            <div>Caption:</div>
                            <el-tag type="info" size="small" style="margin-top: 10px;cursor: pointer " @click="idClick($event)">
                             {{ "<id>" }}
                            </el-tag>
                            <div v-for="(pathTagItem,pathTagIndex) in item.records[0]._fields">
                                <div v-if="pathTagItem.labels">
                                    <el-tag type="info" size="small" style="margin-top: 10px; margin-left: 10px;cursor: pointer" v-for="(value4,key4) in pathTagItem.properties " :key="key4" @click="fileClick($event,value4)">{{ key4 }}</el-tag>
                                </div>
                              </div>
                          </el-col> 
                        </el-row>
                      </el-popover>
                    </el-col>
                    <el-col style="margin: 10px 0 0 10px">
                      Displaying {{ resultNodes.length }} nodes, 0
                      relationships.
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
                  {{ JSON.stringify(item4 === null ? null : item4, null, 1)}}
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
        <!-- path -->
        <el-col
          v-if="item.flagshowP"
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
                <!-- overview展开 -->
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
                      <div style="font-weight: bold;">Node labels</div>
                      <el-tag effect="dark" round style="margin-right: 10px;margin-top: 10px;"
                        >*({{ resultNodes.length }})</el-tag>
                      <el-popover
                        v-for="(value2, key2) in item.labelList" :key="key2"
                        placement="bottom"
                        :width="260"
                        trigger="click"
                      >
                        <template #reference>
                          <el-tag
                          @click="tagClick(key2)"
                            effect="dark"
                            round
                            :color="getTagColor(key2)"
                            style="margin-right: 10px; cursor: pointer;margin-top: 10px;border: none"
                            >{{ key2 }}({{ value2 }})</el-tag>
                        </template>
                        <el-row >
                          <el-col>
                            <el-tag effect="dark" round style="width: 100%;border: none" :color="getTagColor(key2)">{{ key2 }}({{ value2 }})</el-tag>
                          </el-col>
                          <el-col style="display: flex; margin-top: 12px">
                            <ul
                              class="color"
                              style="
                                display: flex;
                                align-items: center;
                                justify-content: space-around;
                                width: 100%;
                                padding-left: 0;
                              "
                              @click="colorClick($event)"
                            >
                              <div>color:</div>
                              <li
                                style="background-color: rgb(96, 74, 14);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(201, 144, 192);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(247, 151, 103);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(87, 199, 227);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(241, 102, 103);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(217, 200, 174);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(141, 204, 147);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(236, 181, 201);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(76, 142, 218);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(255, 196, 84);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(218, 113, 148);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(86, 148, 128);cursor: pointer;"
                                class="li"
                              ></li>
                            </ul>
                          </el-col>
                          <el-col style="display: flex; margin-top: 12px">
                            <ul
                              class="size"
                              style="
                                display: flex;
                                align-items: center;
                                width: 100%;
                                padding-left: 0;
                              "
                              @click="sizeClick($event)"
                            >
                              <div>size:</div>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 12px;
                                  height: 12px;
                                  border-radius: 50%;
                                "
                                data-size="40"
                              ></li>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 14px;
                                  height: 14px;
                                  border-radius: 50%;
                                "
                                data-size="60"
                              ></li>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 16px;
                                  height: 16px;
                                  border-radius: 50%;
                                "
                                data-size="80"
                              ></li>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 18px;
                                  height: 18px;
                                  border-radius: 50%;
                                "
                                data-size="100"
                              ></li>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 20px;
                                  height: 20px;
                                  border-radius: 50%;
                                "
                                data-size="120"
                              ></li>
                            </ul>
                          </el-col>
                          <el-col
                            style="
                              display: flex;
                              margin-top: 12px;
                              align-items: center;
                              flex-wrap: wrap;
                            "
                          >
                            <div>Caption:</div>
                            <el-tag type="info" size="small" style="margin-top: 10px; margin-left: 10px;cursor: pointer" @click="idClick($event)">{{ "<id>" }}</el-tag>
                              <div v-for="(pathTagItem,pathTagIndex) in item.records[0]._fields">
                                <div v-if="pathTagItem.segments">
                                  <div v-if="pathTagItem.end.labels.indexOf(key2) !== -1">
                                    <el-tag type="info" size="small" style="margin-top: 10px; margin-left: 10px;cursor: pointer" v-for="(value4,key4) in pathTagItem.end.properties " :key="key4" @click="fileClick($event)">{{ key4 }}</el-tag>
                                  </div>
                                  <div v-if="pathTagItem.start.labels.indexOf(key2) !== -1">
                                    <el-tag type="info" size="small" style="margin-top: 10px; margin-left: 10px;cursor: pointer" v-for="(value4,key4) in pathTagItem.start.properties " :key="key4"  @click="fileClick($event)">{{ key4 }}</el-tag>
                                  </div>
                                </div>
                              </div>
                          </el-col> 
                        </el-row>
                      </el-popover>
                    </el-col>
                    <el-col style="margin: 0 0 0 10px">
                      <div style="font-weight: bold;margin-top: 10px">Relationship types</div>
                      <el-tag effect="dark" round style="margin-top: 10px">*({{ relationList.length }})</el-tag
                      >
                      <el-popover
                        placement="bottom"
                        :width="260"
                        trigger="click"
                         v-for="(key, value) in item.relationList" :key="key"
                      >
                        <template #reference>
                          <el-tag
                            @click="tagClick(value)"
                            effect="dark"
                            style="margin-left: 10px; cursor: pointer;margin-top: 10px;border: none" 
                            :color="getLineColor(value)" 
                            >{{ value }}({{ key }})</el-tag>
                        </template>
                        <el-row>
                          <el-col>
                            <el-tag
                              effect="dark"
                              :color="getLineColor(value)"
                              style="width: 100%;border: none"
                              >{{ value }}</el-tag>
                          </el-col>
                          <el-col style="display: flex; margin-top: 12px">
                            <ul
                              class="color"
                              style="
                                display: flex;
                                align-items: center;
                                justify-content: space-around;
                                width: 100%;
                                padding-left: 0;
                              "
                              @click="colorRelaClick($event)"
                            >
                              <div>color:</div>
                              <li
                                style="background-color: rgb(96, 74, 14);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(201, 144, 192);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(247, 151, 103);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(87, 199, 227);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(241, 102, 103);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(217, 200, 174);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(141, 204, 147);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(236, 181, 201);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(76, 142, 218);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(255, 196, 84);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(218, 113, 148);cursor: pointer;"
                                class="li"
                              ></li>
                              <li
                                style="background-color: rgb(86, 148, 128);cursor: pointer;"
                                class="li"
                              ></li>
                            </ul>
                          </el-col>
                          <el-col style="display: flex; margin-top: 12px">
                            <ul
                              class="size"
                              style="
                                display: flex;
                                align-items: center;
                                width: 100%;
                                padding-left: 0;
                              "
                              @click="sizeRelaClick($event)"
                            >
                              <div>Line width:</div>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 5px;
                                  height: 12px;
                                  cursor: pointer
                                "
                                data-size= '1'
                              ></li>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 8px;
                                  height: 12px;
                                  cursor: pointer
                                "
                                data-size= '3'
                              ></li>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 11px;
                                  height: 12px;
                                  cursor: pointer
                                "
                                data-size= '5'
                              ></li>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 14px;
                                  height: 12px;
                                  cursor: pointer
                                "
                                data-size= '7'
                              ></li>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 17px;
                                  height: 12px;
                                  cursor: pointer
                                "
                                data-size= '8'
                              ></li>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 20px;
                                  height: 12px;
                                  cursor: pointer
                                "
                                data-size= '10'
                              ></li>
                              <li
                              class="sizeLi"
                                style="
                                  background-color: rgb(170, 170, 170);
                                  width: 23px;
                                  height: 12px;
                                  cursor: pointer
                                "
                                data-size= '12'
                              ></li>
                            </ul>
                          </el-col>
                          <el-col
                            style="
                              display: flex;
                              margin-top: 12px;
                              align-items: center;
                              flex-wrap: wrap;
                            "
                          >
                            <div>Caption:</div>
                            <div v-for="(pathTagItem,pathTagIndex) in item.records[0]._fields">
                                <div v-if="pathTagItem.segments">
                                  <el-tag type="info" size="small" style="margin-top: 10px;margin-left: 10px;cursor:pointer" @click="lineIdClick($event)"> {{ "<id>" }}</el-tag>
                                  <el-tag type="info" size="small" style="margin-top: 10px;margin-left: 10px;cursor:pointer" @click="lineTypeClick($event)"> {{ "<type>" }}</el-tag>
                                 <div v-for="items3 in pathTagItem.segments">
                                  <div v-if="items3.relationship">
                                    <el-tag v-for="(key5,value5) in items3.relationship.properties" :key="key5" type="info" size="small" style="margin-top: 10px;margin-left: 10px;cursor:pointer" @click="lineFileClick($event)">{{ value5 }}</el-tag>
                                  </div>
                                 </div>
                                </div>
                              </div>
                          </el-col> 
                        </el-row>
                        
                      </el-popover>
                    </el-col>
                    <el-col style="margin: 10px 0 0 10px">
                      Displaying {{ resultNodes.length }} nodes, {{relationList.length}}
                      relationships.
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
                      item7 === null ? "null" : item7.start && item7.start.properties ? [item7.start.properties,item7.end.properties] : item7.properties ? item7.properties : item7
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
         <!-- relaion -->
         <el-col v-if="item.flagshowR">
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
                    {{ item7 === null ? "null" : item7.properties }}
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
        <el-col v-if="item.flagshowE">
          <div v-if="item.records.length === 0"
          :style="{ height: isFullscreen ? '100vh' : '324px' }"
          style="padding: 18px;"
          >
            (no changes, no records)
          </div>
          <RelationGraph
            v-show="true"
            ref="graphRef"
            :options="options"
            style="height: 0; width: 0;"
          ></RelationGraph>
          <el-tabs
            :tab-position="tabPosition"
            class="demo-tabs graphMenu"
            :style="{ height: isFullscreen ? '100vh' : '324px' }"
            v-if="item.records.length !== 0"
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
                style="overflow-x: scroll; position: absolute; width: 100%;"
                :style="{ height: isFullscreen ? '100vh' : '324px' }"
              >
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
                  >
                    {{item3.keys[index4]}}
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
                    {{JSON.stringify(item4 === null ? "null" : item4 , null, 2)}}
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
        v-if="!item.flagshowER"
      >
        Transmit {{ item.records.length }} records within {{ item.resTime }}.
      </div>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
// import { useStore } from "vuex";
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
import mitts from "../../utils/bus.js";
//组件
import search3 from "./blockcomponents/search3.vue";
import mitt from "mitt";
import { useStore } from "vuex";
const store = useStore();
//变量
const tabPosition = ref<TabsInstance["tabPosition"]>("left");
const options = {};
const graphRef = ref<RelationGraph>();
const isFullscreen = ref(false);
const isunfold = ref(false);
const isres = ref(false);
const overview = ref(false);
const toplist = ref([]);
const resultNodes = ref([]);
const labelList = ref([]);
const resultRelation = ref([]);
const relationList = ref([]);
const tagName = ref("");
//控制list条数
if (toplist.value.length > 30) {
  toplist.value.splice(list.value.length - 1, 1);
}
//标签颜色
const getTagColor = (key) => {
  const color = window.localStorage.getItem(key + "color")
    ? window.localStorage.getItem(key + "color")
    : "#21a1ff";
  return color;
};
const getLineColor = (key) => {
  const color = window.localStorage.getItem(key + "linecolor")
    ? window.localStorage.getItem(key + "linecolor")
    : "#999999";
  return color;
};
//拿到标签名
const tagClick = (name) => {
  tagName.value = name;
};
const OverviewClick = () => {
  overview.value = !overview.value;
};
//折叠
const unfoldClick = () => {
  isunfold.value = !isunfold.value;
};
const resClick = () => {
  isres.value = !isres.value;
};
//取消置顶
const topClick = (index: Number, item: any) => {
  toplist.value.splice(index, 1);
  mitts.emit("untopData", item);
  store.commit("ScrollChange", item);
};
//置顶
mitts.on("topData", (item: any) => {
  toplist.value.push(item);
  nextTick(() => {
    graphRef.value[toplist.value.length - 1].setJsonData(item.graphData);
  });
});
//放大
const toggleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value;
};
mitts.on('revamp2',(data) => {
// console.log(data,'1665')
const result = data.result
const index = data.index
result.id = generateRandomId();
  result.labelList = {};
  result.relationList = [];
  result.flagshowN = undefined;
  result.flagshowP = undefined;
  result.flagshowR = undefined;
  result.flagshowE = undefined;
  // list.value.push(result);
  toplist.value[index] = result
  let textName = "";
  let textTitle = "";
  let lineText = "";
  result.graphData = {
    rootId: toplist.value.length,
    nodes: [],
    lines: [],
  };
  if(result.error){
    result.flagshowER = true;
  } else if(result.records.length === 0){
    result.flagshowE = true;
  }
  else{
  result.records.forEach((item: any, index: Number) => {
    for (let i = 0; i < item._fields.length; i++) {
      if (
        item._fields[i] !== null &&
        !item._fields[i].start &&
        !item._fields[i].end &&
        item._fields[i].labels
      ) {
        result.flagshowN = true;
      } else if (item._fields[i] !== null && item._fields[i].segments) {
        result.flagshowP = true;
      } else if (
        item._fields[i] !== null &&
        item._fields[i].endNodeElementId &&
        item._fields[i].startNodeElementId &&
        !item._fields[i].labels &&
        !item._fields[i].segments
      ) {
        result.flagshowR = true;
      } else {
        result.flagshowE = true;
      }
    }
  });
}
  //path
  if (result.flagshowP) {
    result.records.forEach((item: any, index: Number) => {
      for (let i = 0; i < item._fields.length; i++) {
        if (item._fields[i] !== null && item._fields[i].segments) {
          for (let k = 0; k < item._fields[i].segments.length; k++) {
            for (
              let t = 0;
              t < item._fields[i].segments[k].start.labels.length;
              t++
            ) {
              for (
                let l = 0;
                l < item._fields[i].segments[k].end.labels.length;
                l++
              ) {
                if (
                  window.localStorage.getItem(
                    item._fields[i].segments[k].start.labels[t]
                  )
                ) {
                  if (
                    window.localStorage.getItem(
                      item._fields[i].start.labels[t]
                    ) === "id"
                  ) {
                    textName = item._fields[i].segments[k].start.elementId;
                  } else {
                    textName =
                      item._fields[i].segments[k].start.properties[
                        window.localStorage.getItem(
                          item._fields[i].segments[k].start.labels[t]
                        )
                      ];
                  }
                } else {
                  for (const key in item._fields[i].segments[k].start
                    .properties) {
                    textName =
                      item._fields[i].segments[k].start.properties[key];
                  }
                }
                if (
                  window.localStorage.getItem(
                    item._fields[i].segments[k].end.labels[l]
                  )
                ) {
                  if (
                    window.localStorage.getItem(
                      item._fields[i].segments[k].end.labels[l]
                    ) === "id"
                  ) {
                    textTitle = item._fields[i].segments[k].end.elementId;
                  } else {
                    textTitle =
                      item._fields[i].segments[k].end.properties[
                        window.localStorage.getItem(
                          item._fields[i].segments[k].end.labels[l]
                        )
                      ];
                  }
                } else {
                  for (const key in item._fields[i].segments[k].end
                    .properties) {
                    textTitle = item._fields[i].segments[k].end.properties[key];
                  }
                }
                if (
                  window.localStorage.getItem(
                    item._fields[i].segments[k].relation.types
                  )
                ) {
                  if (
                    window.localStorage.getItem(
                      item._fields[i].segments[k].relation.types
                    ) === "id"
                  ) {
                    lineText = item._fields[i].segments[k].relation.elementId;
                  } else if (
                    window.localStorage.getItem(
                      item._fields[i].segments[k].relation.types
                    ) === "type"
                  ) {
                    lineText = item._fields[i].segments[k].relation.types;
                  } else {
                    lineText =
                      item._fields[i].segments[k].relation.properties[
                        window.localStorage.getItem(
                          item._fields[i].segments[k].relation.types
                        )
                      ];
                  }
                } else {
                  lineText = item._fields[i].segments[k].relation.types;
                }
                result.graphData.nodes.push({
                  id: item._fields[i].segments[k].start.elementId,
                  text: textName,
                  color: window.localStorage.getItem(
                    item._fields[i].segments[k].start.labels[t] + "color"
                  )
                    ? window.localStorage.getItem(
                        item._fields[i].segments[k].start.labels[t] + "color"
                      )
                    : "#21a1ff",
                  label: item._fields[i].segments[k].start.labels,
                  properties: item._fields[i].segments[k].start.properties,
                  width: window.localStorage.getItem(
                    item._fields[i].segments[k].start.labels[t] + "size"
                  )
                    ? window.localStorage.getItem(
                        item._fields[i].segments[k].start.labels[t] + "size"
                      )
                    : 80,
                  height: window.localStorage.getItem(
                    item._fields[i].segments[k].start.labels[t] + "size"
                  )
                    ? window.localStorage.getItem(
                        item._fields[i].segments[k].start.labels[t] + "size"
                      )
                    : 80,
                });
                result.graphData.nodes.push({
                  id: item._fields[i].segments[k].end.elementId,
                  text: textTitle,
                  color: window.localStorage.getItem(
                    item._fields[i].segments[k].end.labels[l] + "color"
                  )
                    ? window.localStorage.getItem(
                        item._fields[i].segments[k].end.labels[l] + "color"
                      )
                    : "#21a1ff",
                  label: item._fields[i].segments[k].end.labels,
                  properties: item._fields[i].segments[k].end.properties,
                  width: window.localStorage.getItem(
                    item._fields[i].segments[k].end.labels[l] + "size"
                  )
                    ? window.localStorage.getItem(
                        item._fields[i].segments[k].end.labels[l] + "size"
                      )
                    : 80,
                  height: window.localStorage.getItem(
                    item._fields[i].segments[k].end.labels[l] + "size"
                  )
                    ? window.localStorage.getItem(
                        item._fields[i].segments[k].end.labels[l] + "size"
                      )
                    : 80,
                });
                result.graphData.lines.push({
                  id: item._fields[i].segments[k].relation.elementId,
                  type: item._fields[i].segments[k].relation.types,
                  properties: item._fields[i].segments[k].relation.properties,
                  from: String(item._fields[i].segments[k].start.elementId),
                  to: String(item._fields[i].segments[k].end.elementId),
                  text: lineText,
                  lineWidth: window.localStorage.getItem(
                    item._fields[i].segments[k].relation.types + "linesize"
                  )
                    ? window.localStorage.getItem(
                        item._fields[i].segments[k].relation.types + "linesize"
                      )
                    : 1,
                  color: window.localStorage.getItem(
                    item._fields[i].segments[k].relation.types + "linecolor"
                  )
                    ? window.localStorage.getItem(
                        item._fields[i].segments[k].relation.types + "linecolor"
                      )
                    : "#666666",
                });
              }
            }
          }
          break;
        }
      }
    });
    result.graphData.nodes = result.graphData.nodes.reduce(
      (acc: any, current: any) => {
        // 检查累加器（acc）中是否已存在具有相同id的对象
        const existing = acc.find((item) => item.id === current.id);
        // 如果不存在，则将其添加到累加器中
        if (!existing) {
          acc.push(current);
        }
        // 否则，不执行任何操作（即不添加重复项）
        return acc;
      },
      []
    ); // 初始累加器是一个空数组
    result.graphData.lines = result.graphData.lines.reduce(
      (acc: any, current: any) => {
        // 检查累加器（acc）中是否已存在具有相同id的对象
        const existing = acc.find((item) => item.id === current.id);
        // 如果不存在，则将其添加到累加器中
        if (!existing) {
          acc.push(current);
        }
        // 否则，不执行任何操作（即不添加重复项）
        return acc;
      },
      []
    ); // 初始累加器是一个空数组
    console.log(result.graphData);
    result.flagshowN = false;
    result.flagshowR = false;
    result.flagshowE = false;
  } else if (result.flagshowN) {
    //nodes
    result.records.forEach((item: any, index: Number) => {
      for (let i = 0; i < item._fields.length; i++) {
        if (
          item._fields[i] !== null &&
          !item._fields[i].start &&
          !item._fields[i].end &&
          item._fields[i].labels
        ) {
          if (window.localStorage.getItem(item._fields[i].labels[0])) {
            if (
              window.localStorage.getItem(item._fields[i].labels[0]) === "id"
            ) {
              textName = item._fields[i].elementId;
            } else {
              textName =
                item._fields[i].properties[
                  window.localStorage.getItem(item._fields[i].labels[0])
                ];
            }
          } else {
            for (const key in item._fields[i].properties) {
              textName = item._fields[i].properties[key];
            }
          }

          result.graphData.nodes.push({
            id: item._fields[i].elementId,
            text: textName,
            label: item._fields[i].labels,
            properties: item._fields[i].properties,
            color: window.localStorage.getItem(
              item._fields[i].labels[0] + "color"
            )
              ? window.localStorage.getItem(item._fields[i].labels[0] + "color")
              : "#21a1ff",
            width: window.localStorage.getItem(
              item._fields[i].labels[0] + "size"
            )
              ? window.localStorage.getItem(item._fields[i].labels[0] + "size")
              : "80",
            height: window.localStorage.getItem(
              item._fields[i].labels[0] + "size"
            )
              ? window.localStorage.getItem(item._fields[i].labels[0] + "size")
              : "80",
          });
          break;
        }
      }
    });
    result.flagshowP = false;
    result.flagshowR = false;
    result.flagshowE = false;
  } else if (result.flagshowR) {
    result.flagshowP = false;
    result.flagshowN = false;
    result.flagshowE = false;
  } else {
    result.flagshowP = false;
    result.flagshowN = false;
    result.flagshowR = false;
  }
  //overview nodes
  resultNodes.value = [];
  resultNodes.value = result.graphData.nodes.reduce(
    (acc: any, current: any) => {
      // 检查累加器（acc）中是否已存在具有相同id的对象
      const existing = acc.find((item) => item.id === current.id);
      // 如果不存在，则将其添加到累加器中
      if (!existing) {
        acc.push(current);
      }
      // 否则，不执行任何操作（即不添加重复项）
      return acc;
    },
    []
  ); // 初始累加器是一个空数组
  labelList.value = [];
  resultNodes.value.forEach((item) => {
    labelList.value.push(...item.label);
  });
  result.labelList = labelList.value.reduce((acc2, curr2) => {
    // 如果当前元素已经在累加器中，则增加其计数
    if (acc2[curr2]) {
      acc2[curr2]++;
    }
    // 否则，将其添加到累加器中，并设置计数为1
    else {
      acc2[curr2] = 1;
    }
    return acc2;
  }, {});

  //overview Relationship
  resultRelation.value = [];
  resultRelation.value = result.graphData.lines.reduce(
    (acc: any, current: any) => {
      const existing = acc.find((item) => item.id === current.id);
      if (!existing) {
        acc.push(current);
      }
      return acc;
    },
    []
  );
  relationList.value = []; //关系
  resultRelation.value.forEach((item) => {
    relationList.value.push(item.type);
  });
  result.relationList = relationList.value.reduce((acc2, curr2) => {
    // 如果当前元素已经在累加器中，则增加其计数
    if (acc2[curr2]) {
      acc2[curr2]++;
    }
    // 否则，将其添加到累加器中，并设置计数为1
    else {
      acc2[curr2] = 1;
    }
    return acc2;
  }, {});
  //渲染图形
  if (result.graphData.nodes.length !== 0) {
    nextTick(() => {
      graphRef.value[index].setJsonData(result.graphData);
    });
  }
})

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
  toplist.value.splice(index, 1);
};

//overview修改颜色
const colorClick = (e) => {
  if (e.target.className === "li") {
    window.localStorage.setItem(
      tagName.value + "color",
      e.target.style.backgroundColor
    );
    toplist.value.forEach((item, index) => {
      item.graphData.nodes.forEach((item2) => {
        item2.label.forEach((item3) => {
          if (item3 === tagName.value) {
            item2.color = window.localStorage.getItem(tagName.value + "color");
          }
        });
      });
      nextTick(() => {
        graphRef.value[index].setJsonData(item.graphData);
      });
    });
  }
};
//lines修改颜色
const colorRelaClick = (e) => {
  if (e.target.className === "li") {
    window.localStorage.setItem(
      tagName.value + "linecolor",
      e.target.style.backgroundColor
    );
    toplist.value.forEach((item, index) => {
      item.graphData.lines.forEach((item2) => {
        if (item2.text === tagName.value) {
          item2.color = window.localStorage.getItem(
            tagName.value + "linecolor"
          );
        }
      });
      nextTick(() => {
        graphRef.value[index].setJsonData(item.graphData);
      });
    });
  }
};
//修改大小
const sizeClick = (e) => {
  if (e.target.className === "sizeLi") {
    window.localStorage.setItem(tagName.value + "size", e.target.dataset.size);
    toplist.value.forEach((item, index) => {
      item.graphData.nodes.forEach((item2) => {
        item2.label.forEach((item3) => {
          if (item3 === tagName.value) {
            item2.width = window.localStorage.getItem(tagName.value + "size");
            item2.height = window.localStorage.getItem(tagName.value + "size");
          }
        });
      });
      nextTick(() => {
        graphRef.value[index].setJsonData(item.graphData);
      });
    });
  }
};
//lines修改大小
const sizeRelaClick = (e) => {
  if (e.target.className === "sizeLi") {
    window.localStorage.setItem(
      tagName.value + "linesize",
      e.target.dataset.size
    );
    toplist.value.forEach((item, index) => {
      item.graphData.lines.forEach((item2) => {
        if (item2.text === tagName.value) {
          item2.lineWidth = window.localStorage.getItem(
            tagName.value + "linesize"
          );
        }
      });
      nextTick(() => {
        graphRef.value[index].setJsonData(item.graphData);
      });
    });
  }
};
//修改字段 id
const idClick = (e) => {
  window.localStorage.setItem(tagName.value, "id");
  toplist.value.forEach((item) => {
    item.graphData.nodes.forEach((item2) => {
      item2.label.forEach((item3) => {
        if (item3 === tagName.value) {
          item.records.forEach((item4) => {
            item4._fields.forEach((item5) => {
              if (
                item5 !== null &&
                !item5.start &&
                !item5.end &&
                item5.labels
              ) {
                item2.text = item2.id;
              } else if (item5 !== null && item5.segments) {
                console.log(111);
                item2.text = item2.id;
              }
            });
          });
        }
      });
    });
    nextTick(() => {
      graphRef.value[toplist.value.length - 1].setJsonData(item.graphData);
    });
  });
};
//修改字段properties
const fileClick = (e) => {
  window.localStorage.setItem(tagName.value, e.target.innerText);
  toplist.value.forEach((item) => {
    item.graphData.nodes.forEach((item2) => {
      item2.label.forEach((item3) => {
        if (item3 === tagName.value) {
          item.records.forEach((item4) => {
            item4._fields.forEach((item5) => {
              if (
                item5 !== null &&
                !item5.start &&
                !item5.end &&
                item5.labels
              ) {
                item2.text = item2.properties[e.target.innerText];
              } else if (item5 !== null && item5.segments) {
                item2.text = item2.properties[e.target.innerText];
              }
            });
          });
        }
      });
    });
    nextTick(() => {
      graphRef.value[toplist.value.length - 1].setJsonData(item.graphData);
    });
  });
};
//修改line字段 id
const lineIdClick = (e) => {
  window.localStorage.setItem(tagName.value, "id");
  toplist.value.forEach((item, index) => {
    item.graphData.lines.forEach((item2) => {
      if (item2.type === tagName.value) {
        item2.text = item2.id;
      }
    });
    nextTick(() => {
      graphRef.value[index].setJsonData(item.graphData);
    });
  });
};
//修改字段line type
const lineTypeClick = (e) => {
  window.localStorage.setItem(tagName.value, "type");
  toplist.value.forEach((item, index) => {
    item.graphData.lines.forEach((item2) => {
      if (item2.type === tagName.value) {
        item2.text = item2.type;
      }
    });
    nextTick(() => {
      graphRef.value[index].setJsonData(item.graphData);
    });
  });
};
//修改字段 line properties
const lineFileClick = (e) => {
  window.localStorage.setItem(tagName.value, e.target.innerText);
  toplist.value.forEach((item, index) => {
    item.graphData.lines.forEach((item2) => {
      if (item2.type === tagName.value) {
        item2.text = item2.properties[e.target.innerText];
      }
    });
    nextTick(() => {
      graphRef.value[index].setJsonData(item.graphData);
    });
  });
};
//生成数据唯一id
const generateRandomId = () => {
  const timestamp = new Date().getTime(); // 获取当前时间戳
  const randomNum = Math.floor(Math.random() * 1000); // 生成一个0-999之间的随机数
  return `id_${timestamp}_${randomNum}`; // 返回拼接后的ID字符串
};
//下载图片
mitts.on('download',(index) => {
  graphRef.value[index].getInstance().downloadAsImage('png',index)
})
</script>

<style scoped>
.size li {
  background-color: rgb(170, 170, 170);
  list-style-type: none;
  margin-left: 8px;
}
.color li {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  list-style-type: none;
}
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