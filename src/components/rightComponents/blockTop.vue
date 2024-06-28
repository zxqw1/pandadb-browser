store.state.topListTransmit<template>
  <div
    style="background-color: #ffffff"
    v-for="(item, index) in store.state.toplist"
    :key="index"
    :style="{
      position: isFullscreen ? 'fixed' : 'static',
      top: isFullscreen ? '0' : '0',
      left: isFullscreen ? '0' : '0',
      width: isFullscreen ? '100vw' : 'auto',
      zIndex: isFullscreen ? '5' : '0',
    }"
  >
    <el-row v-if="item.length">
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
          <PushpinOutlined style="margin-left: 16px;background-color: rgb(215 215 215);color: #6a8322" @click="topClick2(index,item)" />
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
      <el-row style="width: 100%; padding: 8px 16px 0 16px">
        <el-col :span="22">
          <div
            class="searchBlock"
            style="
              background-color: #f6f6f6;
              width: 100%;
              border-radius: 5px;
              border: 1px dashed #d2dabb;
              min-height: 32px;
              display: flex;
              align-items: center;
            "
            :style="{
              position: isFullscreen ? 'relative' : 'static',
            }"
          >
            <!-- logo -->
            <img
              src="../../assets/img/logos.png"
              style="width: 44px; height: 30px"
              :style="{
                position: isFullscreen ? 'absolute' : 'static',
              }"
              alt=""
            />
            <!-- 真实输入 -->
            <input
              v-model="item[0].summary.query.text"
              :placeholder="item[0].summary.query.text"
              type="text"
              autosize
              style="
                width: 93%;
                font-size: 16px;
                color: #666666;
                background-color: rgb(246, 246, 246);
                border: none;
              "
              class="searchText"
              :style="{
                position: isFullscreen ? 'absolute' : 'static',
                left: isFullscreen ? '50px' : 'auto',
              }"
            />
            <!-- 展示 -->
            <CaretRightOutlined
              style="color: #6a8322; font-size: 28px"
              :style="{
                position: isFullscreen ? 'absolute' : 'static',
                right: isFullscreen ? '10px' : 'auto',
              }"
              @click="nodeShow2(item[0].summary.query.text, index)"
            />
          </div>
        </el-col>
        <el-col
          :span="2"
          style="
            display: flex;
            align-items: center;
            justify-content: space-around;
          "
        >
          <StarOutlined :style="{ fontSize: '20px' }" />
          <VerticalAlignBottomOutlined :style="{ fontSize: '20px' }" />
        </el-col>
      </el-row>
      <!-- 展示 -->
      <el-col
        style="height: 348px; margin-top: 12px"
        v-show="item.show"
        :style="{
          height: isFullscreen ? '100vh' : 'auto',
        }"
      >
        <!-- node -->
        <el-col
          v-if="
            item[0].records[0].keys.indexOf('n') !== -1 &&
            item[0].records[0].keys.indexOf('p') === -1 &&
            item[0].records[0]._fields[item[0].records[0].keys.indexOf('n')] &&
            item[0].records[0]._fields[item[0].records[0].keys.indexOf('n')]
              .elementId &&
            item[0].records[0]._fields[item[0].records[0].keys.indexOf('n')]
              .properties
          "
        >
          <el-tabs :tab-position="tabPosition" class="demo-tabs graphMenu" :style="{ height: isFullscreen ? '100vh' : '324px' }">
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
              <RelationGraph
                ref="graphRef"
                :options="options"
                style="height: 336px"
                :style="{ height: isFullscreen ? '100vh' : '324px' }"
              ></RelationGraph>
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
              <div style="overflow: auto">
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
                    v-for="(item2, index2) in item[0].records[0].keys"
                    :key="index2"
                    :span="item[0].records[0].keys.length != 1 ? '6' : '24'"
                  >
                    {{ item2 }}
                  </a-col>
                </a-row>
                <a-row
                  v-for="(item3, index3) in item[0].records"
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
                    :span="item[0].records[0].keys.length != 1 ? '6' : '24'"
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
              <!-- :style="{ height: isFullscreen ? '100vh' : '324px' }" -->

              <div style="padding: 10px; overflow-y: auto">
                <el-row style="flex-wrap: nowrap; display: flex">
                  <el-col
                    style="border-right: none; border: 1px dashed #666666"
                    class="td"
                    v-for="(item5, index5) in item[0].records[0].keys"
                    :key="index5"
                    :span="item[0].records[0].keys.length !== 1 ? 6 : 24"
                  >
                    {{ item5 }}
                  </el-col>
                </el-row>
                <el-row
                  v-for="(item6, index6) in item[0].records"
                  :key="index6"
                >
                  <el-col
                    class="td"
                    :span="item[0].records[0].keys.length !== 1 ? 6 : 24"
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
              <!-- :style="{ height: isFullscreen ? '100vh' : '324px' }" -->

              <div style="padding: 10px; overflow-y: auto">
                <el-row>
                  <el-col class="severTitle" :span="8"> Server version</el-col>
                  <el-col :span="16" class="severContent">
                    {{ item[0].summary.server.agent }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="severTitle" :span="8"> Server address</el-col>
                  <el-col :span="16" class="severContent">
                    {{ item[0].summary.server.address }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="severTitle" :span="8"> Query </el-col>
                  <el-col :span="16" class="severContent">
                    {{ item[0].summary.query.text }}
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
                    {{ item[0].summary }}
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
                    {{ item[0].records }}
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <!-- relation -->
        <el-col
          v-else-if="
            item[0].records[0].keys.indexOf('p') !== -1 &&
            item[0].records[0]._fields[0] &&
            item[0].records[0]._fields[item[0].records[0].keys.indexOf('p')]
              .end &&
            item[0].records[0]._fields[item[0].records[0].keys.indexOf('p')]
              .start
          "
        >
          <el-tabs :tab-position="tabPosition" class="demo-tabs graphMenu":style="{ height: isFullscreen ? '100vh' : '324px' }">
            <el-tab-pane label="graph">
              <!-- table标题 -->
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
              <RelationGraph
                ref="graphRef"
                :options="options"
                style="height: 336px"
                :style="{ height: isFullscreen ? '100vh' : '324px' }"
              ></RelationGraph>
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

              <div style=" overflow: auto" :style="{ height: isFullscreen ? '100vh' : '324px' }">
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
                    v-for="(item2, index2) in item[0].records[0].keys"
                    :key="index2"
                    :span="item[0].records[0].keys.length != 1 ? '6' : '24'"
                  >
                    {{ item2 }}
                  </a-col>
                </a-row>
                <a-row
                  v-for="(item3, index3) in item[0].records"
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
                    :span="item[0].records[0].keys.length != 1 ? '6' : '24'"
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
                    v-for="(item5, index5) in item[0].records[0].keys"
                    :key="index5"
                    :span="item[0].records[0].keys.length != 1 ? 6 : 24"
                  >
                    {{ item5 }}
                  </el-col>
                </el-row>
                <el-row
                  v-for="(item6, index6) in item[0].records"
                  :key="index6"
                >
                  <el-col
                    class="td"
                    :span="item[0].records[0].keys.length != 1 ? 6 : 24"
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
                    {{ item[0].summary.server.agent }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="severTitle" :span="8"> Server address</el-col>
                  <el-col :span="16" class="severContent">
                    {{ item[0].summary.server.address }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="severTitle" :span="8"> Query </el-col>
                  <el-col :span="16" class="severContent">
                    {{ item[0].summary.query.text }}
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
                    {{ item[0].summary }}
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
                    {{ item[0].records }}
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <!-- keys -->
        <el-col v-else>
          <el-tabs :tab-position="tabPosition" class="demo-tabs graphMenu":style="{ height: isFullscreen ? '100vh' : '324px' }">
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
              <div style="overflow-y: auto" :style="{ height: isFullscreen ? '100vh' : '324px' }">
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
                    v-for="(item2, index2) in item[0].records[0].keys"
                    :key="index2"
                    :span="item[0].records[0].keys.length != 1 ? '6' : '24'"
                  >
                    {{ item2 }}
                  </a-col>
                </a-row>
                <a-row
                  v-for="(item3, index3) in item[0].records"
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
                    :span="item[0].records[0].keys.length != 1 ? '6' : '24'"
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
              <div style="padding: 10px; overflow-y: auto" :style="{ height: isFullscreen ? '100vh' : '324px' }">
                <el-row style="flex-wrap: nowrap; display: flex">
                  <el-col
                    style="border-right: none; border: 1px dashed #666666"
                    class="td"
                    v-for="(item5, index5) in item[0].records[0].keys"
                    :key="index5"
                    :span="item[0].records[0].keys.length != 1 ? 6 : 24"
                  >
                    {{ item5 }}
                  </el-col>
                </el-row>
                <el-row
                  v-for="(item6, index6) in item[0].records"
                  :key="index6"
                >
                  <el-col
                    class="td"
                    :span="item[0].records[0].keys.length != 1 ? 6 : 24"
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
              <!-- :style="{ height: isFullscreen ? '100vh' : '324px' }" -->

              <div style="padding: 10px; overflow-y: auto">
                <el-row>
                  <el-col class="severTitle" :span="8"> Server version</el-col>
                  <el-col :span="16" class="severContent">
                    {{ item[0].summary.server.agent }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="severTitle" :span="8"> Server address</el-col>
                  <el-col :span="16" class="severContent">
                    {{ item[0].summary.server.address }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="severTitle" :span="8"> Query </el-col>
                  <el-col :span="16" class="severContent">
                    {{ item[0].summary.query.text }}
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
                    {{ item[0].summary }}
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
                    {{ item[0].records }}
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
        Transmit {{ item[0].records.length }} records within
        {{ item[0].resTime }}.
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
//变量
const tabPosition = ref<TabsInstance["tabPosition"]>("left");
const store = useStore();
const options = {};
const graphRef = ref(null);
const isFullscreen = ref(false);
const isunfold = ref(false);
const isres = ref(false);
const unfoldClick = () => {
  isunfold.value = !isunfold.value;
};
const resClick = () => {
  isres.value = !isres.value;
};
// 置顶
const topClick2 = (index:Number,item:any) => {
  store.commit("top2", { index, item });
};
//放大
const toggleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value;
};
//修改
const nodeShow2 = async (text: any, index: Number) => {
  await nextTick();
  if (text === "") {
  } else {
    let promiseData = request.fetchData("neo4j", "admin", text);
    promiseData
      .then((result: any) => {
        console.log("拿到的数据", result);
        store.commit("revise", { index, result });
      })
      .catch((error: any) => {
        console.log(error, 106);
        ElMessageBox.alert(error, "错误提示", {
          confirmButtonText: "好的",
        });
      });
  }
};
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
  store.commit("remove2", index);
};
watch(store.state.toplist, async (newVal, oldVal) => {
  await nextTick();
  let num = undefined;
  let record = undefined;
  oldVal.forEach((item: any, index: Number) => {
    if (item.length) {
      record = item;
      num = index;
    }
  });
  if (num !== undefined && record !== undefined) {
    let obj = {
      rootId: num,
      nodes: [],
      lines: [],
    };
    record[0].records.forEach((item) => {
      let textName = "";
      let textTitle = "";
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
        obj.nodes.push({
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
        for (const key in item._fields[item.keys.indexOf("p")].start
          .properties) {
          textName = item._fields[item.keys.indexOf("p")].start.properties[key];
        }
        for (const key in item._fields[item.keys.indexOf("p")].end.properties) {
          textTitle = item._fields[item.keys.indexOf("p")].end.properties[key];
        }
        obj.nodes.push({
          id: item._fields[item.keys.indexOf("p")].start.elementId,
          text: textName,
          color: "#21a1ff",
        });
        obj.nodes.push({
          id: item._fields[item.keys.indexOf("p")].end.elementId,
          text: textTitle,
          color: "#21a1ff",
        });
        obj.lines.push({
          from: item._fields[item.keys.indexOf("p")].start.elementId,
          to: item._fields[item.keys.indexOf("p")].end.elementId,
          text: item._fields[item.keys.indexOf("p")].segments[0].relationship
            .type,
          color: "#666666",
        });
      } else {
      }
    });
    if (obj.nodes.length !== 0 || obj.lines.length !== 0) {
      graphRef.value[num].setJsonData(obj);
    }
  }
});
onMounted(() => {});
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