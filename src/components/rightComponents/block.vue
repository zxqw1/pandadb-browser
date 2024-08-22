<template>
  <div style="background-color: #ffffff" v-for="(item, index) in list" :key="item.id" :style="{
    position: isFullscreen ? 'fixed' : 'relative',
    top: isFullscreen ? '0' : '0',
    left: isFullscreen ? '0' : '0',
    width: isFullscreen ? '100vw' : 'auto',
  }">
    <el-row>
      <div style="background-color: #f6f6f6; width: 100%; height: 24px" v-if="!isFullscreen"></div>
      <!-- 右上 -->
      <el-col style="
          background-color: #ffffff;
          display: flex;
          flex-direction: row-reverse;
          height: 24px;
          padding-right: 14px;
          padding-top: 4px;
        ">
        <div class="topIcon">
          <Pushpin-outlined style="margin-left: 16px" @click="topClick(index, item)" />
          <Down-outlined style="margin-left: 16px" v-if="item.show" @click="item.show = false" />
          <Up-outlined v-else style="margin-left: 16px" @click="item.show = true" />
          <ExpandAltOutlined style="margin-left: 16px" @click="toggleFullScreen" v-if="!isFullscreen" />
          <ShrinkOutlined style="margin-left: 16px" @click="toggleFullScreen" v-else />
          <CloseOutlined style="margin-left: 16px" @click="removeModule(index)" />
        </div>
      </el-col>
      <!-- 搜索 -->
      <search2 :command="item.summary.query.text" :index="index" :item="item" />
      <!-- 展示 -->
      <el-col style="height: 348px; margin-top: 12px" v-show="!item.show" :style="{
        height: isFullscreen ? '100vh' : 'auto',
      }">
        <!-- 报错 -->
        <el-col v-if="item.flagshowER" :style="{ height: isFullscreen ? '100vh' : '324px' }" style="padding: 18px;">
          <div style="display: flex">
            <el-tag effect="dark" type="danger"> ERROR </el-tag>
            <h3 style="font-weight: 500;margin-left: 16px;align-items: center;">pandaDB, Error message</h3>
          </div>
          <div style="width: 100%;background-color: rgb(210, 213, 218);padding: 20px;margin-top: 10px">
            {{ item.error }}
          </div>
        </el-col>
        <!-- loading -->
        <el-col v-if="item.flagshowL" v-loading="true" element-loading-background="rgba(221, 221, 221, 0.5)"
          :style="{ height: isFullscreen ? '100vh' : '324px' }" style="padding: 18px;"></el-col>
        <!-- node -->
        <el-col v-if="item.flagshowN">
          <el-tabs :tab-position="tabPosition" class="demo-tabs graphMenu"
            :style="{ height: isFullscreen ? '100vh' : '324px' }">
            <el-tab-pane label="graph">
              <!-- label标题 -->
              <template #label>
                <div style=" display: flex;align-items: center;flex-direction: column;">
                  <img src="../../../public/graph.png" alt="" style="width: 24px; height: 24px" />
                  <div style="font-weight: 600; color: #666666">graph</div>
                </div>
              </template>
              <!-- 图 -->
              <div style="
                  border: #efefef solid 1px;
                  width: 100%;
                  display: flex;
                  flex-direction: row-reverse;
                  position: relative;
                " :style="{ height: isFullscreen ? '100vh' : '324px' }">
                <!-- overview按钮 -->
                <div style="
                    background-color: #dcdcdc30;
                    width: 45px;
                    height: 28px;
                    position: absolute;
                    z-index: 10;
                    right: 15px;
                    top: 8px;
                    box-shadow: 0 0 2px #ccc;
                    line-height: 33px;
                    text-align: center;
                    cursor: pointer;
                  " @click="OverviewClick(item)" v-if="!item.overview">
                  <ArrowLeftBold color="#999999" style="width: 16px" />
                </div>
                <div style="
                    width: 328px;
                    min-height: 452px;
                    background-color: #ffffff;
                    box-shadow: 0 0 2px #ccc;
                    /* z-index: 1; */
                    position: relative;
                  " v-else>
                  <ArrowLeftBold color="#999999" style="
                      width: 16px;
                      position: absolute;
                      right: 0px;
                      top: 0px;
                      margin: 18px;
                      cursor: pointer;
                      z-index: 10;
                    " @click="OverviewClick(item)" />
                  <!-- overview展开 -->
                  <!-- 节点详情 -->
                  <el-row v-if="item.propertiesFlag" style="padding: 10px 0 0 10px; ">
                    <el-col style="font-weight: 500">
                      <el-row>
                        <div style="font-size: 16px; font-weight: 500;">{{ item.Properties.name }}</div>
                        <CopyDocument style="width: 14px; margin-left: 10px;"
                          @click="copyClick2(item.Properties.id, item.Properties.properties)" />
                      </el-row>
                    </el-col>
                    <el-col
                      style="display: flex;flex-direction: column; padding-left: 10px;padding-right: 10px;padding-top: 10px">
                      <el-tag v-for="(item, index) in item.Properties.label" :key="index" round effect="dark"
                        :color="getTagColor(item)" style="margin-top: 10px;border: none;">{{ item }}</el-tag>
                    </el-col>
                    <el-col>
                      <el-row style="border-bottom: 1px #efefef solid;margin-top:10px;display: flex">
                        <el-col :span="10" style="padding-left: 10px ;font-weight: 500 ">{{ "<id>" }}</el-col>
                        <el-col :span="11"
                          style="height: 30px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden; "
                          :title="item.Properties.id">{{ item.Properties.id }}</el-col>
                        <el-col :span="3" style="padding-left: 10px">
                          <CopyDocument style="width: 14px;" @click="copyClick('id', item.Properties.id)" />
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col>
                      <el-row v-for="(value, key) in item.Properties.properties"
                        style="border-bottom: 1px #efefef solid;margin-top:10px;display: flex">
                        <el-col :span="10" style="padding-left: 10px ;font-weight: 500">{{ key }}
                          <el-image v-if="item.unstructured && value.info"
                            style="width: 24px;height: 24px;position: relative; top: 8px;" src="./look.png"
                            :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="imgList"
                            :initial-index="0" fit="cover" :z-index="500" />
                          <ArrowDownOutlined v-if="item.downloadFlag && value.info"
                            @click="downLoadClick(item.fileInfo, item)" />
                        </el-col>
                        <el-col :span="11"
                          style="height: 30px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden; "
                          :title="value">{{ item.unstructured && value.info ? value.info : value }}</el-col>
                        <el-col :span="3" style="padding-left: 10px">
                          <CopyDocument style="width: 14px;" @click="copyClick(key, value)" />
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <!-- overview信息 -->
                  <el-row v-else style="padding-left: 10px;">
                    <el-col style=" font-size: 18px; font-weight: 500 ;">
                      Overview
                    </el-col>
                    <el-col>
                      <div style="font-weight: bold">Node labels</div>
                      <el-tag effect="dark" round style="margin-top: 10px; margin-right: 10px;">*({{ resultNodes.length
                        }})</el-tag>
                      <el-popover placement="bottom" :width="260" trigger="click" v-for="(value, key) in item.labelList"
                        :key="key">
                        <template #reference>
                          <el-tag @click="tagClick(key)" effect="dark" round :color="getTagColor(key)"
                            style="margin-right: 10px; margin-top: 10px; cursor: pointer;border: none">{{ key }}({{
                              value }})</el-tag>
                        </template>
                        <el-row>
                          <el-col>
                            <el-tag effect="dark" round :color="getTagColor(key)"
                              style="width: 100%;border: none;margin-bottom: 10px">{{ key }}({{ value }})</el-tag>
                          </el-col>
                          <el-col style="display: flex; margin-top: 12px">
                            <ul class="color" style="
                                display: flex;
                                align-items: center;
                                justify-content: space-around;
                                width: 100%;
                                padding-left: 0;
                                list-style-type:none
                              " @click="colorClick($event)">
                              <div>color:</div>
                              <li style="background-color: rgb(96, 74, 14);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(201, 144, 192);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(247, 151, 103);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(87, 199, 227);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(241, 102, 103);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(217, 200, 174);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(141, 204, 147);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(236, 181, 201);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(76, 142, 218);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(255, 196, 84);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(218, 113, 148);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(86, 148, 128);cursor: pointer;" class="li"></li>
                            </ul>
                          </el-col>
                          <el-col style="display: flex; margin-top: 12px">
                            <ul class="size" style="
                                display: flex;
                                align-items: center;
                                width: 100%;
                                padding-left: 0;
                                list-style-type:none
                              " @click="sizeClick($event)">
                              <div>size:</div>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 12px;
                                  height: 12px;
                                  border-radius: 50%;
                                  cursor: pointer;
                                " data-size="40"></li>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 14px;
                                  height: 14px;
                                  border-radius: 50%;
                                  cursor: pointer;
                                " data-size="60"></li>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 16px;
                                  height: 16px;
                                  border-radius: 50%;
                                  cursor: pointer;
                                " data-size="80"></li>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 18px;
                                  height: 18px;
                                  border-radius: 50%;
                                  cursor: pointer;
                                " data-size="100"></li>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 20px;
                                  height: 20px;
                                  border-radius: 50%;
                                  cursor: pointer;
                                " data-size="120"></li>
                            </ul>
                          </el-col>
                          <el-col style="
                              display: flex;
                              margin-top: 12px;
                              align-items: center;
                              flex-wrap: wrap;
                              cursor: pointer;
                            ">
                            <div>Caption:</div>
                            <el-tag type="info" size="small" style="margin-top: 10px;cursor: pointer "
                              @click="idClick($event)">
                              {{ "<id>" }}
                            </el-tag>
                            <div v-for="(pathTagItem, pathTagIndex) in item.records[0]._fields">
                              <div v-if="pathTagItem.labels">
                                <el-tag type="info" size="small"
                                  style="margin-top: 10px; margin-left: 10px;cursor: pointer"
                                  v-for="(value4, key4) in pathTagItem.properties " :key="key4"
                                  @click="fileClick($event, value4)">{{
                                    key4 }}</el-tag>
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
                <RelationGraph @node-click="NodeClick($event, item)" @canvas-click="itemClick(item)"
                  :ref="dom => { getRefDom(dom, item) }" :options="options" style="height: 336px"
                  :style="{ height: isFullscreen ? '100vh' : '324px' }">
                  <template #node="{ node }">
                    <div
                      style="overflow: hidden;white-space:nowrap;text-overflow: ellipsis;text-align: center;vertical-align:middle">
                      {{ node.text }}</div>
                  </template>
                  <!-- nodemenu -->
                  <!-- <template #graph-plug>
                    <div v-show="item.showNodeMenu" class="c-surround-menu-panel"
                      style="display: flex;align-items: center;justify-content: center;place-items: center;" :style="{
                        width: nodeMenuPanel.width + 'px',
                        height: nodeMenuPanel.height + 'px',
                        left: nodeMenuPanel.x + 'px',
                        top: nodeMenuPanel.y + 'px'
                      }">
                      <svg width="100%" height="100%" viewBox="0 0 400 400">
                        <g>
                          <g fill="#000000">
                            <path class="c-svg-button"
                              d="m9.99469,187.08997c0,-40.82082 27.52652,-97.86001 62.20722,-128.85359c32.50037,-29.06937 66.90853,-43.9133 114.603,-49.41106l7.15417,-0.82466l0,61.84972l0,61.91844l-4.49691,0c-23.5747,0 -58.05098,34.01735 -58.18725,57.3828l0,4.46692l-60.64011,0l-60.64011,0l0,-6.52858z"
                              @click="clickNodeMenu('lock', $event)" />
                            <path class="c-svg-button"
                              d="m269.58887,188.4644c-4.36064,-26.73282 -34.27188,-56.69558 -56.68828,-56.69558l-3.95183,0l0,-61.781l0,-61.71228l7.83552,0.68722c91.98219,8.52152 166.11303,82.60374 174.22109,174.00389l0.95389,10.6519l-60.77638,0l-60.77638,0l-0.81762,-5.15414z"
                              @click="clickNodeMenu('nodehide', $event, item)" />
                            <path class="c-svg-button"
                              d="m176.92533,393.32443c-89.32493,-11.68273 -166.93065,-94.35519 -166.93065,-177.92103l0,-6.66603l60.43571,0l60.50384,0l0.68135,5.97881c2.52099,23.09056 29.02549,50.99166 52.12324,55.04625c11.3104,1.99294 10.22024,-4.87926 10.22024,63.43033l0,61.09378l-6.47282,-0.20617c-3.54302,-0.13744 -8.31246,-0.41233 -10.56092,-0.75594z"
                              @click="clickNodeMenu('graph', $event)" />
                            <path class="c-svg-button"
                              d="m209.28944,332.98659l0.34067,-61.57483l7.49485,-1.64933c7.08604,-1.51188 11.51481,-3.22993 21.12184,-8.4528c6.06401,-3.22993 20.03168,-18.28003 23.43843,-25.22094c4.97385,-10.17084 7.22231,-15.94348 7.22231,-18.62364c0,-1.37444 0.40881,-3.91715 0.88575,-5.6352l0.81762,-3.09249l60.43571,0l60.50384,0l0,5.15414c-0.06813,86.31472 -81.62568,171.87351 -171.35942,179.77653l-11.24227,0.96211l0.34067,-61.64356z"
                              @click="clickNodeMenu('card', $event, item)" />
                          </g>
                        </g>
                      </svg>
                      <div
                        style="height:100%;width:100%;position: absolute;left: 0px;top:0px;user-select: none;pointer-events: none;color: #ffffff;font-size: 22px;">

                        <div style="position: absolute;left:20px;top:20px;">
                          <el-icon>
                            <Unlock />
                          </el-icon>
                        </div>
                        <div style="position: absolute;right:20px;top:20px;">
                          <el-icon>
                            <Hide />
                          </el-icon>
                        </div>
                        <div style="position: absolute;left:20px;top:75px;transform: rotate(180deg);">
                          <img src="../../assets//img/atlas.png" alt="" style="width: 20px;height: 20px">
                        </div>
                        <div style="position: absolute;right:20px;top:75px;">
                          <el-icon>
                            <Warning />
                          </el-icon>
                        </div>
                      </div>
                    </div>
                    <div class="c-operate-panels">
                      - Node info card
                      <div v-if="item.showNodeInfoCard" class="c-node-info-card"
                        style="background-color: #ffffff;height: 200px;border: 1px #ccc solid;">
                        <h3> Node info card</h3>
                      </div>
                    </div>
                  </template> -->
                </RelationGraph>
              </div>
            </el-tab-pane>
            <el-tab-pane label="table">
              <template #label>
                <div style=" display: flex;align-items: center;flex-direction: column;">
                  <img src="../../../public/table.png" alt="" style="width: 24px; height: 24px" />
                  <div style="font-weight: 600; color: #666666">table</div>
                </div>
              </template>
              <!-- 详情 -->
              <div style="overflow: auto" :style="{ height: isFullscreen ? '100vh' : '324px' }">
                <a-row style="
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
                  ">
                  <a-col v-for="(item2, index2) in item.records[0].keys" :key="index2"
                    :span="item.records[0].keys.length != 1 ? '6' : '24'">
                    {{ item2 }}
                  </a-col>
                </a-row>
                <a-row v-for="(item3, index3) in item.records" :key="index3" style="
                    flex-wrap: nowrap;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;
                  ">
                  <a-col v-for="(item4, index4) in item3._fields" :key="index4"
                    :span="item.records[0].keys.length != 1 ? '6' : '24'">
                    <pre style="
                        margin-bottom: 10px;
                        padding: 10px;
                        margin-top: 10px;
                        margin-right: 30px;
                        background-color: rgb(239, 239, 239);
                        border-bottom: 1px solid #000000;
                        position: relative;
                      ">
          <CopyDocument style="width: 14px;height: 14px; position: absolute;right: 16px; cursor: pointer;"
            @click="tableCopy(item4)" />
          {{ JSON.stringify(item4 === null ? null : item4, null, 1) }}
        </pre>
                  </a-col>
                </a-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="text">
              <template #label>
                <div style=" display: flex;align-items: center;flex-direction: column;">
                  <img src="../../../public/text.png" alt="" style="width: 24px; height: 24px" />
                  <div style="font-weight: 600; color: #666666">text</div>
                </div>
              </template>
              <!-- 详情 -->
              <div style="padding: 10px; overflow-y: auto" :style="{ height: isFullscreen ? '100vh' : '324px' }">
                <el-row style="flex-wrap: nowrap; display: flex">
                  <el-col style="border-right: none; border: 1px dashed #666666" class="td"
                    v-for="(item5, index5) in item.records[0].keys" :key="index5"
                    :span="item.records[0].keys.length !== 1 ? 6 : 24">
                    {{ item5 }}
                  </el-col>
                </el-row>
                <el-row v-for="(item6, index6) in item.records" :key="index6">
                  <el-col class="td" :span="item.records[0].keys.length !== 1 ? 6 : 24"
                    style="border-right: none; border: 1px dashed #666666" v-for="(item7, index7) in item6._fields"
                    :key="index7">
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
                <div style=" display: flex;align-items: center;flex-direction: column;">
                  <img src="../../../public/code.png" alt="" style="width: 24px; height: 24px" />
                  <div style="font-weight: 600; color: #666666">code</div>
                </div>
              </template>
              <!-- 详情 -->
              <div style="padding: 10px; overflow-y: auto;height: 324px">
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
                  <el-col :span="16" :style="{ height: isunfold ? '100%' : '30px' }"
                    style="font-size: 16px; color: #666666; overflow: hidden">
                    {{ item.summary }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="severTitle" :span="8">
                    Response
                    <CaretRightOutlined v-if="!isres" @click="resClick" />
                    <CaretDownOutlined v-else @click="resClick" />
                  </el-col>
                  <el-col :span="16" :style="{ height: isres ? '100%' : '30px' }"
                    style="font-size: 16px; color: #666666; overflow: hidden">
                    {{ item.records }}
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <!-- path -->
        <el-col v-if="item.flagshowP">
          <el-tabs :tab-position="tabPosition" class="demo-tabs graphMenu"
            :style="{ height: isFullscreen ? '100vh' : '324px' }">
            <el-tab-pane label="graph">
              <!-- graph标题 -->
              <template #label>
                <div style=" display: flex;align-items: center;flex-direction: column;">
                  <img src="../../../public/graph.png" alt="" style="width: 24px; height: 24px" />
                  <div style="font-weight: 600; color: #666666">graph</div>
                </div>
              </template>
              <div style="
                  border: #efefef solid 1px;
                  width: 100%;
                  display: flex;
                  flex-direction: row-reverse;
                  position: relative;
                " :style="{ height: isFullscreen ? '100vh' : '324px' }">
                <!-- overview按钮 -->
                <div style="
                    background-color: #dcdcdc30;
                    width: 45px;
                    height: 28px;
                    position: absolute;
                    z-index: 10;
                    right: 15px;
                    top: 8px;
                    box-shadow: 0 0 2px #ccc;
                    line-height: 33px;
                    text-align: center;
                    cursor: pointer;
                  " @click="OverviewClick(item)" v-if="!item.overview">
                  <ArrowLeftBold color="#999999" style="width: 16px" />
                </div>
                <div style="
                    width: 328px;
                    /* min-height: 452px; */
                    overflow: auto;
                    background-color: #ffffff;
                    box-shadow: 0 0 2px #ccc;
                    /* z-index: 10; */
                    position: relative;
                  " v-else>
                  <!-- overview展开 -->
                  <ArrowLeftBold color="#999999" style="
                      width: 16px;
                      position: absolute;
                      right: 0px;
                      top: 0px;
                      margin: 18px;
                      cursor: pointer;
                      z-index: 10;
                    " @click="OverviewClick(item)" />
                  <!-- 节点详情 -->
                  <el-row v-if="item.propertiesFlag" style="padding: 10px 0 0 10px; ">
                    <el-col style="font-weight: 500">
                      <el-row>
                        <div style="font-size: 16px; font-weight: 500;">{{ item.Properties.name }}</div>
                        <CopyDocument style="width: 14px; margin-left: 10px;"
                          @click="copyClick2(item.Properties.id, item.Properties.properties)" />
                      </el-row>
                    </el-col>
                    <el-col
                      style="display: flex;flex-direction: column; padding-left: 10px;padding-right: 10px;padding-top: 10px">
                      <el-tag v-for="(item, index) in item.Properties.label" :key="index" round effect="dark"
                        :color="getTagColor(item)" style="margin-top: 10px;border: none;">{{ item }}</el-tag>
                    </el-col>
                    <el-col>
                      <el-row style="border-bottom: 1px #efefef solid;margin-top:10px;display: flex">
                        <el-col :span="10" style="padding-left: 10px ;font-weight: 500 ">{{ "<id>" }}</el-col>
                        <el-col :span="11"
                          style="height: 30px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden; "
                          :title="item.Properties.id">{{ item.Properties.id }}</el-col>
                        <el-col :span="3" style="padding-left: 10px">
                          <CopyDocument style="width: 14px;" @click="copyClick('id', item.Properties.id)" />
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col>
                      <el-row v-for="(value, key) in item.Properties.properties"
                        style="border-bottom: 1px #efefef solid;margin-top:10px;display: flex">
                        <el-col :span="10" style="padding-left: 10px ;font-weight: 500 ">{{ key }}</el-col>
                        <el-col :span="11"
                          style="height: 30px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden; "
                          :title="value">{{ value }}</el-col>
                        <el-col :span="3" style="padding-left: 10px">
                          <CopyDocument style="width: 14px;" @click="copyClick(key, value)" />
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                  <!-- overview信息 -->
                  <el-row v-else>
                    <el-col style="margin: 10px; font-size: 18px; font-weight: 500">
                      Overview
                    </el-col>
                    <el-col style="margin: 0 0 0 10px">
                      <div style="font-weight: bold;">Node labels</div>
                      <el-tag effect="dark" round style="margin-right: 10px;margin-top: 10px;">*({{ resultNodes.length
                        }})</el-tag>
                      <el-popover placement="bottom" :width="260" trigger="click"
                        v-for="(value2, key2) in item.labelList" :key="key2">
                        <template #reference>
                          <el-tag @click="tagClick(key2)" effect="dark" round :color="getTagColor(key2)"
                            style="margin-right: 10px; cursor: pointer;margin-top: 10px;border: none">{{ key2 }}({{
                              value2 }})</el-tag>
                        </template>
                        <el-row>
                          <el-col>
                            <!-- v-for="(value2, key2) in item.labelList" :key="key2" -->
                            <el-tag effect="dark" round style="width: 100%;margin-top: 10px; border: none"
                              :color="getTagColor(key2)">{{ key2 }}({{ value2 }})</el-tag>
                          </el-col>
                          <el-col style="display: flex; margin-top: 12px">
                            <ul class="color" style="
                                display: flex;
                                align-items: center;
                                justify-content: space-around;
                                width: 100%;
                                padding-left: 0;
                                list-style-type:none
                              " @click="colorClick($event)">
                              <div>color:</div>
                              <li style="background-color: rgb(96, 74, 14);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(201, 144, 192);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(247, 151, 103);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(87, 199, 227);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(241, 102, 103);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(217, 200, 174);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(141, 204, 147);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(236, 181, 201);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(76, 142, 218);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(255, 196, 84);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(218, 113, 148);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(86, 148, 128);cursor: pointer;" class="li"></li>
                            </ul>
                          </el-col>
                          <el-col style="display: flex; margin-top: 12px">
                            <ul class="size" style="
                                display: flex;
                                align-items: center;
                                width: 100%;
                                padding-left: 0;
                                list-style-type:none
                              " @click="sizeClick($event)">
                              <div>size:</div>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 12px;
                                  height: 12px;
                                  border-radius: 50%;
                                " data-size="40"></li>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 14px;
                                  height: 14px;
                                  border-radius: 50%;
                                " data-size="60"></li>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 16px;
                                  height: 16px;
                                  border-radius: 50%;
                                " data-size="80"></li>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 18px;
                                  height: 18px;
                                  border-radius: 50%;
                                " data-size="100"></li>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 20px;
                                  height: 20px;
                                  border-radius: 50%;
                                " data-size="120"></li>
                            </ul>
                          </el-col>
                          <el-col style="
                              display: flex;
                              margin-top: 12px;
                              align-items: center;
                              flex-wrap: wrap;
                            ">
                            <div>Caption:</div>
                            <el-tag type="info" size="small" style="margin-top: 10px; margin-left: 10px;cursor: pointer"
                              @click="idClick($event)">{{ "<id>" }}</el-tag>
                            <div v-for="(pathTagItem, pathTagIndex) in item.records[0]._fields">
                              <div v-if="pathTagItem.segments">
                                <div v-if="pathTagItem.end.labels.indexOf(key2) !== -1">
                                  <el-tag type="info" size="small"
                                    style="margin-top: 10px; margin-left: 10px;cursor: pointer"
                                    v-for="(value4, key4) in pathTagItem.end.properties " :key="key4"
                                    @click="fileClick($event)">{{ key4 }}</el-tag>
                                </div>
                                <!-- <div v-if="pathTagItem.start.labels.indexOf(key2) !== -1">
                                  <el-tag type="info" size="small"
                                    style="margin-top: 10px; margin-left: 10px;cursor: pointer"
                                    v-for="(value4, key4) in pathTagItem.start.properties " :key="key4"
                                    @click="fileClick($event)">{{ key4 }}</el-tag>
                                </div> -->
                              </div>
                            </div>
                          </el-col>
                        </el-row>
                      </el-popover>
                    </el-col>
                    <el-col style="margin: 0 0 0 10px">
                      <div style="font-weight: bold;margin-top: 10px">Relationship types</div>
                      <el-tag effect="dark" round style="margin-top: 10px">*({{ relationList.length }})</el-tag>
                      <el-popover placement="bottom" :width="260" trigger="click"
                        v-for="(key, value) in item.relationList" :key="key">
                        <template #reference>
                          <el-tag @click="tagClick(value)" effect="dark"
                            style="margin-left: 10px; cursor: pointer;margin-top: 10px;border: none"
                            :color="getLineColor(value)">{{ value }}({{ key }})</el-tag>
                        </template>
                        <el-row>
                          <el-col>
                            <el-tag effect="dark" :color="getLineColor(value)" style="width: 100%;border: none">{{ value
                              }}</el-tag>
                          </el-col>
                          <el-col style="display: flex; margin-top: 12px">
                            <ul class="color" style="
                                display: flex;
                                align-items: center;
                                justify-content: space-around;
                                width: 100%;
                                padding-left: 0;
                                list-style-type:none
                              " @click="colorRelaClick($event)">
                              <div>color:</div>
                              <li style="background-color: rgb(96, 74, 14);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(201, 144, 192);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(247, 151, 103);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(87, 199, 227);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(241, 102, 103);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(217, 200, 174);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(141, 204, 147);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(236, 181, 201);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(76, 142, 218);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(255, 196, 84);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(218, 113, 148);cursor: pointer;" class="li"></li>
                              <li style="background-color: rgb(86, 148, 128);cursor: pointer;" class="li"></li>
                            </ul>
                          </el-col>
                          <el-col style="display: flex; margin-top: 12px">
                            <ul class="size" style="
                                display: flex;
                                align-items: center;
                                width: 100%;
                                padding-left: 0;
                                list-style-type:none
                              " @click="sizeRelaClick($event)">
                              <div>Line width:</div>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 5px;
                                  height: 12px;
                                  cursor: pointer
                                " data-size='1'></li>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 8px;
                                  height: 12px;
                                  cursor: pointer
                                " data-size='3'></li>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 11px;
                                  height: 12px;
                                  cursor: pointer
                                " data-size='5'></li>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 14px;
                                  height: 12px;
                                  cursor: pointer
                                " data-size='7'></li>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 17px;
                                  height: 12px;
                                  cursor: pointer
                                " data-size='8'></li>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 20px;
                                  height: 12px;
                                  cursor: pointer
                                " data-size='10'></li>
                              <li class="sizeLi" style="
                                  background-color: rgb(170, 170, 170);
                                  width: 23px;
                                  height: 12px;
                                  cursor: pointer
                                " data-size='12'></li>
                            </ul>
                          </el-col>
                          <el-col style="
                              display: flex;
                              margin-top: 12px;
                              align-items: center;
                              flex-wrap: wrap;
                            ">
                            <div>Caption:</div>
                            <div v-for="(pathTagItem, pathTagIndex) in item.records[0]._fields">
                              <div v-if="pathTagItem.segments">
                                <el-tag type="info" size="small"
                                  style="margin-top: 10px;margin-left: 10px;cursor:pointer"
                                  @click="lineIdClick($event)"> {{ "<id>" }}</el-tag>
                                <el-tag type="info" size="small"
                                  style="margin-top: 10px;margin-left: 10px;cursor:pointer"
                                  @click="lineTypeClick($event)"> {{ "<type>" }}</el-tag>
                                <div v-for="items3 in pathTagItem.segments">
                                  <div v-if="items3.relationship">
                                    <el-tag v-for="(key5, value5) in items3.relationship.properties" :key="key5"
                                      type="info" size="small" style="margin-top: 10px;margin-left: 10px;cursor:pointer"
                                      @click="lineFileClick($event)">{{ value5 }}</el-tag>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </el-col>
                        </el-row>
                      </el-popover>
                    </el-col>
                    <el-col style="margin: 10px 0 0 10px">
                      Displaying {{ resultNodes.length }} nodes, {{ relationList.length }}
                      relationships.
                    </el-col>
                  </el-row>
                </div>
                <RelationGraph @node-click="NodeClick($event, item)" @canvas-click="itemClick(item)"
                  @line-click="lineClick($event, item)" :ref="dom => { getRefDom(dom, item) }" :options="options"
                  style="height: 336px" :style="{ height: isFullscreen ? '100vh' : '324px' }">
                  <template #node="{ node }">
                    <div
                      style="overflow: hidden; text-overflow: ellipsis; white-space:nowrap ; text-align: center;vertical-align:middle">
                      {{ node.text }}</div>
                  </template>
                </RelationGraph>
              </div>
            </el-tab-pane>
            <el-tab-pane label="table">
              <template #label>
                <div style=" display: flex;align-items: center;flex-direction: column;">
                  <img src="../../../public/table.png" alt="" style="width: 24px; height: 24px" />
                  <div style="font-weight: 600; color: #666666">table</div>
                </div>
              </template>
              <!-- 详情 -->
              <div style="overflow: auto" :style="{ height: isFullscreen ? '100vh' : '324px' }">
                <a-row style="
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
                  ">
                  <a-col v-for="(item2, index2) in item.records[0].keys" :key="index2"
                    :span="item.records[0].keys.length != 1 ? '6' : '24'">
                    {{ item2 }}
                  </a-col>
                </a-row>
                <a-row v-for="(item3, index3) in item.records" :key="index3" style="
                    flex-wrap: nowrap;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;
                  ">
                  <a-col v-for="(item4, index4) in item3._fields" :key="index4"
                    :span="item.records[0].keys.length != 1 ? '6' : '24'">
                    <pre style="
                        margin-bottom: 10px;
                        padding: 10px;
                        margin-top: 10px;
                        margin-right: 30px;
                        background-color: rgb(239, 239, 239);
                        border-bottom: 1px solid #000000;
                        position: relative;
                      ">
              <CopyDocument style="width: 14px;height: 14px; position: absolute;right: 16px; cursor: pointer;"
                @click="tableCopy(item4)" />
              {{ JSON.stringify(item4 === null ? "null" : item4, null, 2) }}
            </pre>
                  </a-col>
                </a-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="text">
              <template #label>
                <div style=" display: flex;align-items: center;flex-direction: column;">
                  <img src="../../../public/text.png" alt="" style="width: 24px; height: 24px" />
                  <div style="font-weight: 600; color: #666666">text</div>
                </div>
              </template>
              <!-- 详情 -->

              <div style="padding: 10px; overflow-y: auto">
                <el-row style="flex-wrap: nowrap; display: flex">
                  <el-col style="border-right: none; border: 1px dashed #666666" class="td"
                    v-for="(item5, index5) in item.records[0].keys" :key="index5"
                    :span="item.records[0].keys.length != 1 ? 6 : 24">
                    {{ item5 }}
                  </el-col>
                </el-row>
                <el-row v-for="(item6, index6) in item.records" :key="index6">
                  <el-col class="td" :span="item.records[0].keys.length != 1 ? 6 : 24"
                    style="border-right: none; border: 1px dashed #666666" v-for="(item7, index7) in item6._fields"
                    :key="index7">

                    {{
                      item7 === null ? "null" : item7.start && item7.start.properties ?
                        [item7.start.properties, item7.end.properties] : item7.properties ? item7.properties : item7
                    }}
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="code">
              <template #label>
                <div style=" display: flex;align-items: center;flex-direction: column;">
                  <img src="../../../public/code.png" alt="" style="width: 24px; height: 24px" />
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
                  <el-col :span="16" :style="{ height: isunfold ? '100%' : '30px' }"
                    style="font-size: 16px; color: #666666; overflow: hidden">
                    {{ item.summary }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="severTitle" :span="8">
                    Response
                    <CaretRightOutlined v-if="!isres" @click="resClick" />
                    <CaretDownOutlined v-else @click="resClick" />
                  </el-col>
                  <el-col :span="16" :style="{ height: isres ? '100%' : '30px' }"
                    style="font-size: 16px; color: #666666; overflow: hidden">
                    {{ item.records }}
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <!-- relaion -->
        <el-col v-if="item.flagshowR">
          <RelationGraph :ref="dom => { getRefDom(dom, item) }" :options="options" style="display: none"
            :style="{ height: isFullscreen ? '100vh' : '324px' }"></RelationGraph>
          <el-tabs :tab-position="tabPosition" class="demo-tabs graphMenu"
            :style="{ height: isFullscreen ? '100vh' : '324px' }">
            <el-tab-pane label="table">
              <template #label>
                <div style=" display: flex;align-items: center;flex-direction: column;">
                  <img src="../../../public/table.png" alt="" style="width: 24px; height: 24px" />
                  <div style="font-weight: 600; color: #666666">table</div>
                </div>
              </template>
              <!-- 详情 -->
              <div style="overflow-y: auto" :style="{ height: isFullscreen ? '100vh' : '324px' }">
                <a-row style="
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
                  ">
                  <a-col v-for="(item2, index2) in item.records[0].keys" :key="index2"
                    :span="item.records[0].keys.length != 1 ? '6' : '24'">
                    {{ item2 }}
                  </a-col>
                </a-row>
                <a-row v-for="(item3, index3) in item.records" :key="index3" style="
                    flex-wrap: nowrap;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;
                  ">
                  <a-col v-for="(item4, index4) in item3._fields" :key="index4"
                    :span="item.records[0].keys.length != 1 ? '6' : '24'">
                    <pre style="
                        margin-bottom: 10px;
                        padding: 10px;
                        margin-top: 10px;
                        margin-right: 30px;
                        background-color: rgb(239, 239, 239);
                        border-bottom: 1px solid #000000;
                        position: relative;
                      ">
              <CopyDocument style="width: 14px;height: 14px; position: absolute;right: 16px; cursor: pointer;"
                @click="tableCopy(item4)" />
              {{
                JSON.stringify(item4 === null ? "null" : item4, null, 2)
              }}
            </pre>
                  </a-col>
                </a-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="text">
              <template #label>
                <div style=" display: flex;align-items: center;flex-direction: column;">
                  <img src="../../../public/text.png" alt="" style="width: 24px; height: 24px" />
                  <div style="font-weight: 600; color: #666666">text</div>
                </div>
              </template>
              <!-- 详情 -->
              <div style="padding: 10px; overflow-y: auto" :style="{ height: isFullscreen ? '100vh' : '324px' }">
                <el-row style="flex-wrap: nowrap; display: flex">
                  <el-col style="border-right: none; border: 1px dashed #666666" class="td"
                    v-for="(item5, index5) in item.records[0].keys" :key="index5"
                    :span="item.records[0].keys.length != 1 ? 6 : 24">
                    {{ item5 }}
                  </el-col>
                </el-row>
                <el-row v-for="(item6, index6) in item.records" :key="index6">
                  <el-col class="td" :span="item.records[0].keys.length != 1 ? 6 : 24"
                    style="border-right: none; border: 1px dashed #666666" v-for="(item7, index7) in item6._fields"
                    :key="index7">
                    {{ item7 === null ? "null" : item7.properties }}
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="code">
              <template #label>
                <div style=" display: flex;align-items: center;flex-direction: column;">
                  <img src="../../../public/code.png" alt="" style="width: 24px; height: 24px" />
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
                  <el-col :span="16" :style="{ height: isunfold ? '100%' : '30px' }"
                    style="font-size: 16px; color: #666666; overflow: hidden">
                    {{ item.summary }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="severTitle" :span="8">
                    Response
                    <CaretRightOutlined v-if="!isres" @click="resClick" />
                    <CaretDownOutlined v-else @click="resClick" />
                  </el-col>
                  <el-col :span="16" :style="{ height: isres ? '100%' : '30px' }"
                    style="font-size: 16px; color: #666666; overflow: hidden">
                    {{ item.records }}
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
          <!-- <RelationGraph
            ref="graphRef"
            :options="options"
            style="height: 336px"
          ></RelationGraph> -->
        </el-col>
        <!-- keys -->
        <el-col v-if="item.flagshowE">
          <RelationGraph :ref="dom => { getRefDom(dom, item) }" :options="options" style="display: none"
            :style="{ height: isFullscreen ? '100vh' : '324px' }"></RelationGraph>
          <div v-if="item.records.length === 0" :style="{ height: isFullscreen ? '100vh' : '324px' }"
            style="padding: 18px;">
            (no changes, no records)
          </div>
          <el-tabs :tab-position="tabPosition" class="demo-tabs graphMenu"
            :style="{ height: isFullscreen ? '100vh' : '324px' }" v-if="item.records.length !== 0">
            <el-tab-pane label="table">
              <template #label>
                <div style=" display: flex;align-items: center;flex-direction: column;">
                  <img src="../../../public/table.png" alt="" style="width: 24px; height: 24px" />
                  <div style="font-weight: 600; color: #666666">table</div>
                </div>
              </template>
              <!-- 详情 -->
              <div style="overflow-x: scroll; position: absolute; width: 100%;"
                :style="{ height: isFullscreen ? '100vh' : '324px' }">
                <a-row v-for="(item3, index3) in item.records" :key="index3" style="
                    flex-wrap: nowrap;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;
                  ">
                  <a-col v-for="(item4, index4) in item3._fields" :key="index4">
                    {{ item3.keys[index4] }}
                    <pre style="
                        margin-bottom: 10px;
                        padding: 10px;
                        margin-top: 10px;
                        margin-right: 30px;
                        background-color: rgb(239, 239, 239);
                        border-bottom: 1px solid #000000;
                        position: relative;
                      ">
              <CopyDocument style="width: 14px;height: 14px; position: absolute;right: 16px; cursor: pointer;"
                @click="tableCopy(item4)" />
              {{ JSON.stringify(item4 === null ? "null" : item4, null, 2) }}
            </pre>
                  </a-col>
                </a-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="text">
              <template #label>
                <div style=" display: flex;align-items: center;flex-direction: column;">
                  <img src="../../../public/text.png" alt="" style="width: 24px; height: 24px" />
                  <div style="font-weight: 600; color: #666666">text</div>
                </div>
              </template>
              <!-- 详情 -->
              <div style="padding: 10px; overflow-y: auto" :style="{ height: isFullscreen ? '100vh' : '324px' }">
                <el-row style="flex-wrap: nowrap; display: flex">
                  <el-col style="border-right: none; border: 1px dashed #666666" class="td"
                    v-for="(item5, index5) in item.records[0].keys" :key="index5"
                    :span="item.records[0].keys.length != 1 ? 6 : 24">
                    {{ item5 }}
                  </el-col>
                </el-row>
                <el-row v-for="(item6, index6) in item.records" :key="index6">
                  <el-col class="td" :span="item.records[0].keys.length != 1 ? 6 : 24"
                    style="border-right: none; border: 1px dashed #666666" v-for="(item7, index7) in item6._fields"
                    :key="index7">
                    {{ item7 === null ? "null" : item7 }}
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="code">
              <template #label>
                <div style=" display: flex;align-items: center;flex-direction: column;">
                  <img src="../../../public/code.png" alt="" style="width: 24px; height: 24px" />
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
                  <el-col :span="16" :style="{ height: isunfold ? '100%' : '30px' }"
                    style="font-size: 16px; color: #666666; overflow: hidden">
                    {{ item.summary }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col class="severTitle" :span="8">
                    Response
                    <CaretRightOutlined v-if="!isres" @click="resClick" />
                    <CaretDownOutlined v-else @click="resClick" />
                  </el-col>
                  <el-col :span="16" :style="{ height: isres ? '100%' : '30px' }"
                    style="font-size: 16px; color: #666666; overflow: hidden">
                    {{ item.records }}
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
          <!-- <RelationGraph
            ref="graphRef"
            :options="options"
            style="height: 336px"
          ></RelationGraph> -->
        </el-col>
      </el-col>
      <div style="
          width: 100%;
          height: 24px;
          border-top: 1px #666666 solid;
          background-color: #ffffff;
          line-height: 24px;
          padding-left: 16px;
        " v-if="!(item.flagshowER || item.flagshowL)">
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
  ArrowDownOutlined
} from "@ant-design/icons-vue";
import { ArrowLeftBold, CopyDocument, Unlock, Hide, Warning } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import mitts from "../../utils/bus.js";
//组件
import search2 from "../rightComponents/blockcomponents/search2.vue";
import mitt from "mitt";
import type { RGUserEvent } from "relation-graph-vue3";
import { anyType } from "ant-design-vue/es/_util/type.js";
//变量
const tabPosition = ref<TabsInstance["tabPosition"]>("left");
const options = ref({
  disableNodeClickEffect: false,
  disableZoom: false,
});
const isFullscreen = ref(false);
const isunfold = ref(false);
const isres = ref(false);
const list = ref([]);
const resultNodes = ref([]);
const labelList = ref([]);
const resultRelation = ref([]);
const relationList = ref([]);
const tagName = ref("");
const nodeMenuPanel = ref({ x: 0, y: 0, width: 120, height: 120 });
const currentNode = ref<RGNode | null>(null);
const queryIdList = ref([])
const imgList = ref([
  // 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  // 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  // 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  // 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
])
const getRefDom = (val: any, item: any) => {
  item.graphRef = val;
};
// 节点展开
// const clickNodeMenu = (menutip: string, event: RGUserEvent, item: any) => {
//   item.showNodeMenu = true;
//   if (menutip === 'lock') {
//     console.log('lock')
//   } else if (menutip === 'nodehide') {
//     const graphInstance = item.graphRef!.getInstance();//拿到图形实例
//     const _all_nodes = graphInstance.getNodes();//所有dom集合
//     _all_nodes.forEach(item2 => {
//       if (item2.id === item.Properties.id) {
//         item2.opacity = 0;
//       }
//       item.showNodeMenu = false
//     })
//   } else if (menutip === 'card') {
//     item.showNodeInfoCard = !item.showNodeInfoCard;
//   } else if (menutip === 'graph') {
//     console.log('graph')
//   }
// }
const updateNodeMenuPosition = (item) => {
  if (!currentNode.value) return;
  const graphInstance = item.graphRef?.getInstance();
  if (graphInstance) {
    const _base_position = graphInstance.getBoundingClientRect();
    const viewCoordinate = graphInstance.getViewPointByCanvasPoint({
      x: currentNode.value.x + currentNode.value.el.offsetWidth / 2,
      y: currentNode.value.y + currentNode.value.el.offsetHeight / 2
    });
    nodeMenuPanel.value.x = viewCoordinate.x - nodeMenuPanel.value.width / 2;
    nodeMenuPanel.value.y = viewCoordinate.y - nodeMenuPanel.value.height / 2;
  }
};
//单个node信息
const NodeClick = (event, item) => {
  let record = {}
  list.value.forEach((item2) => {
    if (item2.id === item.id) {
      record = item2
    }
  })
  record.overview = true;
  record.propertiesFlag = true;
  record.graphData.nodes.forEach(item2 => {
    if (item2.id === event.id) {
      record.Properties.name = "Node properties";
      record.Properties.label = item2.label;
      record.Properties.id = item2.id;
      record.Properties.properties = item2.properties
    }
  })
  currentNode.value = event;
  addImg(item.fileInfo)
  updateNodeMenuPosition(record);
  record.showNodeMenu = true;
};
//单个line信息
const lineClick = (event, item) => {
  let record = {}
  list.value.forEach((item2) => {
    if (item2.id === item.id) {
      record = item2
    }
  })
  record.overview = true;
  record.propertiesFlag = true
  record.graphData.lines.forEach(item2 => {
    if (item2.id = event.id) {
      record.Properties.name = "Relationship properties";
      record.Properties.label = [];
      record.Properties.label.push(item2.type)
      record.Properties.id = item2.id;
      record.Properties.properties = item2.properties
    }
  })
}
//取消选中节点
const itemClick = (item) => {
  let record = {}
  list.value.forEach((item2) => {
    if (item2.id === item.id) {
      record = item2
    }
  })
  const graphInstance = record.graphRef?.getInstance();
  if (graphInstance) {
    graphInstance.clearChecked();
  }
  record.propertiesFlag = false;
  record.showNodeMenu = false;
  record.showNodeInfoCard = false
};

//详情复制
const copyClick = (key, value) => {
  const obj = {};
  obj[key] = value;
  let result = "";
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result += `${key}:${obj[key]}\n`;
    }
  }
  navigator.clipboard.writeText(result);
  ElMessage({
    message: "内容已复制到剪贴板",
    type: "success",
    plain: true,
  });
};
//详情全局复制
const copyClick2 = (id, propertiesData) => {
  let obj = { ...propertiesData }
  let result = "";
  obj['<id>'] = id
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result += `${key}:${obj[key]}\n`;
    }
  }
  navigator.clipboard.writeText(result);
  ElMessage({
    message: "内容已复制到剪贴板",
    type: "success",
    plain: true,
  });
};
//控制list条数
if (
  list.value.length > window.localStorage.getItem("item")
    ? window.localStorage.getItem("item")
    : 30
) {
  list.value.splice(list.value.length - 1, 1);
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
const OverviewClick = (record) => {
  record.overview = !record.overview;
};
//折叠
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
//取消置顶
mitts.on("untopData", (item: any) => {
  if (item.graphData.nodes.length !== 0) {
    item.graphRef.value = undefined
    list.value.unshift(item);
    nextTick(() => {
      item.graphRef.setJsonData(item.graphData);
    });
  } else {
    list.value.unshift(item);
  }
});
//放大
const toggleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

//生成数据唯一id
const generateRandomId = () => {
  const timestamp = new Date().getTime(); // 获取当前时间戳
  const randomNum = Math.floor(Math.random() * 1000); // 生成一个0-999之间的随机数
  return `id_${timestamp}_${randomNum}`; // 返回拼接后的ID字符串
};
//修改
mitts.on("revamp", (data) => {
  const result = data.result;
  const index = data.index;
  result.id = data.queryId;
  result.labelList = {};
  result.relationList = [];
  result.flagshowN = undefined;
  result.flagshowP = undefined;
  result.flagshowR = undefined;
  result.flagshowE = undefined;
  result.overview = false;
  result.graphRef = ref(null);
  result.graph = false;
  result.propertiesFlag = false;
  result.Properties = {};
  result.showNodeMenu = false;
  result.showNodeInfoCard = false
  result.unstructured = false
  list.value[index] = result;
  let textName = "";
  let textTitle = "";
  let lineText = "";
  result.graphData = {
    rootId: list.value.length,
    nodes: [],
    lines: [],
  };
  if (result.error) {
    result.flagshowER = true;
  } else if (result.records.length === 0) {
    result.flagshowE = true;
  } else {
    result.records.forEach((item: any, index: Number) => {
      for (let i = 0; i < item._fields.length; i++) {
        if (
          item._fields[i] !== null &&
          !item._fields[i].start &&
          !item._fields[i].end &&
          item._fields[i].labels &&
          item._fields[i].properties
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
      result.graphRef.value.setJsonData(result.graphData);
    });
  }
  if (result.records) { // 判断没有不走，第一次没有，不走，就不报错
    result.records.forEach(item => {
      item._fields.forEach(item2 => {
        for (let key in item2.properties) {
          if (item2.properties[key] && item2.properties[key].info && item2.properties[key].bytes) {
            result.unstructured = true
            result.fileInfo = item2.properties[key]
          }
        }
      })
    })
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
  list.value.splice(index, 1);
};
//overview修改颜色
const colorClick = (e) => {
  if (e.target.className === "li") {
    window.localStorage.setItem(
      tagName.value + "color",
      e.target.style.backgroundColor
    );
    list.value.forEach((item, index) => {
      item.graphData.nodes.forEach((item2) => {
        item2.label.forEach((item3) => {
          if (item3 === tagName.value) {
            item2.color = window.localStorage.getItem(tagName.value + "color");
          }
        });
      });
      nextTick(() => {
        item.graphRef.setJsonData(item.graphData);
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
    list.value.forEach((item, index) => {
      item.graphData.lines.forEach((item2) => {
        if (item2.text === tagName.value) {
          item2.color = window.localStorage.getItem(
            tagName.value + "linecolor"
          );
        }
      });
      nextTick(() => {
        item.graphRef.setJsonData(item.graphData);
      });
    });
  }
};
//修改大小
const sizeClick = (e) => {
  if (e.target.className === "sizeLi") {
    window.localStorage.setItem(tagName.value + "size", e.target.dataset.size);
    list.value.forEach((item, index) => {
      item.graphData.nodes.forEach((item2) => {
        item2.label.forEach((item3) => {
          if (item3 === tagName.value) {
            item2.width = window.localStorage.getItem(tagName.value + "size");
            item2.height = window.localStorage.getItem(tagName.value + "size");
          }
        });
      });
      nextTick(() => {
        item.graphRef.setJsonData(item.graphData);
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
    list.value.forEach((item, index) => {
      item.graphData.lines.forEach((item2) => {
        if (item2.text === tagName.value) {
          item2.lineWidth = window.localStorage.getItem(
            tagName.value + "linesize"
          );
        }
      });
      nextTick(() => {
        item.graphRef.setJsonData(item.graphData);
      });
    });
  }
};
//修改字段 id
const idClick = (e) => {
  window.localStorage.setItem(tagName.value, "id");
  list.value.forEach((item, index) => {
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
                item2.text = item2.id;
              }
            });
          });
        }
      });
    });
    nextTick(() => {
      item.graphRef.setJsonData(item.graphData);
    });
  });
};
//修改字段properties
const fileClick = (e) => {
  window.localStorage.setItem(tagName.value, e.target.innerText);
  list.value.forEach((item, index) => {
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
      item.graphRef.setJsonData(item.graphData);
    });
  });
};
//修改line字段 id
const lineIdClick = (e) => {
  window.localStorage.setItem(tagName.value, "id");
  list.value.forEach((item, index) => {
    item.graphData.lines.forEach((item2) => {
      if (item2.type === tagName.value) {
        item2.text = item2.id;
      }
    });
    nextTick(() => {
      item.graphRef.setJsonData(item.graphData);
    });
  });
};
//修改字段line type
const lineTypeClick = (e) => {
  window.localStorage.setItem(tagName.value, "type");
  list.value.forEach((item, index) => {
    item.graphData.lines.forEach((item2) => {
      if (item2.type === tagName.value) {
        item2.text = item2.type;
      }
    });
    nextTick(() => {
      item.graphRef.setJsonData(item.graphData);
    });
  });
};
//修改字段 line properties
const lineFileClick = (e) => {
  window.localStorage.setItem(tagName.value, e.target.innerText);
  list.value.forEach((item, index) => {
    item.graphData.lines.forEach((item2) => {
      if (item2.type === tagName.value) {
        item2.text = item2.properties[e.target.innerText];
      }
    });
    nextTick(() => {
      item.graphRef.setJsonData(item.graphData);
    });
  });
};
//下载图片
mitts.on("download", (item) => {
  item.graphRef.getInstance().downloadAsImage("png", "graph");
});
//数据
mitts.on("params", (result: any) => {
  result.id = result.queryId;
  result.labelList = {};
  result.relationList = [];
  result.flagshowN = undefined;
  result.flagshowP = undefined;
  result.flagshowR = undefined;
  result.flagshowE = undefined;
  result.flagshowL = undefined;
  result.overview = false;
  result.graph = false;
  result.graphRef = ref(null);
  result.propertiesFlag = false;
  result.Properties = {};
  result.showNodeMenu = false;
  result.showNodeInfoCard = false
  result.unstructured = false
  result.downloadFlag = false
  if (queryIdList.value.indexOf(result.queryId) === -1) {//为第一次预渲染loading
    queryIdList.value.unshift(result.queryId)
    list.value.unshift(result);//渲染占位
  } else {//第二次数据回来后
    const uniquequeryIdList = [...new Set(queryIdList.value)];
    list.value[uniquequeryIdList.lastIndexOf(result.queryId)] = result;
  }
  let textName = "";
  let textTitle = "";
  let lineText = "";
  result.graphData = {
    rootId: list.value.length,
    nodes: [],
    lines: [],
  };
  if (result.error) {
    result.flagshowER = true;
  } else if (!result.records && !result.error) {
    result.flagshowL = true
  } else if (result.records.length === 0) {
    result.flagshowE = true;
  } else {
    result.records.forEach((item: any, index: Number) => {
      for (let i = 0; i < item._fields.length; i++) {
        if (
          item._fields[i] !== null &&
          !item._fields[i].start &&
          !item._fields[i].end &&
          item._fields[i].labels &&
          item._fields[i].properties
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
    // result.graph = true;
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
    result.flagshowN = false;
    result.flagshowR = false;
    result.flagshowE = false;
  } else if (result.flagshowN) {
    //nodes
    // result.graph = true;
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
      result.graphRef.value.setJsonData(result.graphData);
    });
  }
  if (result.records) { // 判断没有不走，第一次没有，不走，就不报错
    result.records.forEach(item => {
      item._fields.forEach(item2 => {
        for (let key in item2.properties) {
          if (item2.properties[key] && item2.properties[key].bytes && item2.properties[key].info.indexOf("image") !== -1) {
            result.unstructured = true
            result.fileInfo = item2.properties[key]
            result.downloadFlag = true
          } else if (item2.properties[key] && item2.properties[key].bytes) {
            result.downloadFlag = true
          }
        }
      })
    })
  }
});
const addImg = (fileInfo) => {
  let mimeType = fileInfo.info.split("=")[fileInfo.info.split("=").length - 1]
  let mimeType2 = mimeType.slice(0, mimeType.length - 1)
  console.log(mimeType2, '2511')
  imgList.value = [`data:${mimeType2};base64,${fileInfo.bytes}`]
}
const downLoadClick = async (fileInfo, scoped) => {
  if (fileInfo.info && fileInfo.info !== "") {
    let mimeType = fileInfo.info.split("=")[fileInfo.info.split("=").length - 1]
    let mimeType2 = mimeType.slice(0, mimeType.length - 1)
    let base64 = `data:${mimeType2};base64,${fileInfo.bytes}`
    let filename = `${scoped.Properties.label[0]}.${mimeType2.split("/")[1]}`
    // 创建一个a标签  
    const link = document.createElement('a');
    link.href = base64;
    link.download = filename;
    // 触发点击  
    document.body.appendChild(link); // 需要先添加到文档流中  
    link.click();
    // 清理  
    document.body.removeChild(link);
  } else if (fileInfo.info && fileInfo.info === "") {
    let byteStream = await base64ToByteStream(fileInfo.bytes)
    let filename = await generateRandomFilename()
    await saveByteStreamAsFile(byteStream, filename)
  }
}
// Function to convert Base64 to Uint8Array (byte stream) // 将base64编码转换
function base64ToByteStream(base64) {
  const binaryString = atob(base64); // Decode Base64 string
  const len = binaryString.length;
  const bytes = new Uint8Array(len); // Create a byte stream
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
// Function to generate a random filename // 生成随机文件名称
function generateRandomFilename() {
  const randomString = Math.random().toString(36).substring(2, 15); // Generate a random string
  return randomString + '.bin'; // Append .bin extension
}
// Function to save the byte stream as a file // 创建a标签进行下载
function saveByteStreamAsFile(byteStream, filename) {
  const blob = new Blob([byteStream], { type: 'application/octet-stream' }); // Create a Blob from the byte stream
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click(); // Trigger the download
}
</script>

<style scoped>
.el-image-viewer__wrapper {
  z-index: 9999 !important;
  /* 使用足够高的z-index，并使用!important确保优先级 */
}

.c-node-info-card {
  text-align: left;
  padding: 10px;
  background-color: rgba(233, 210, 243, 0.68);
  border-radius: 10px;
  font-size: 12px;
  line-height: 25px;
}

.c-operate-panels {
  position: absolute;
  z-index: 700;
  left: 30px;
  top: 30px;
  width: 200px;
}

.c-svg-button {
  fill: rgba(26, 22, 28, 0.65);
  cursor: pointer;
}

.c-svg-button:hover {
  fill: rgba(26, 23, 28, 0.85);
}

::v-deep.relation-graph .rel-node-shape-0 {
  display: flex;
  align-items: center;
  justify-content: center;
}

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

@keyframes growUp {
  from {
    scale: 10%;
    rotate: 0deg;
  }

  50% {
    scale: 30%;
    rotate: 90deg;
  }

  to {
    scale: 100%;
    rotate: 360deg;
  }
}

.c-surround-menu-panel {
  position: absolute;
  width: 160px;
  height: 160px;
  z-index: 999;
  animation: growUp 0.5s linear;
  box-shadow: 0 0 0 38px rgba(255, 255, 255, 0.56) inset;
  border-radius: 50%;
}
</style>
<style>
.graphMenu .el-tabs__nav {
  display: flex;
  align-items: center;
}

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