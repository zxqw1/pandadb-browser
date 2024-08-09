<template>
    <div>
      <div style="height: 100vh;width: 100vw;">
        <RelationGraph
          ref="graphRef"
          :options="graphOptions"
          :on-node-click="onNodeClick"
          :on-canvas-click="onCanvasClick"
          :on-zoom-end="onZoomEnd"
          :on-node-drag-end="onNodeDragEnd"
          :on-canvas-drag-end="onCanvasDragEnd"
        >
          <template #node="{node}">
            <div class="my-node-style" :style="{'background-image': 'url(' + node.data.icon + ')'}" />
            <div class="c-node-name" :style="{color:node.color}">{{ node.text }}</div>
          </template>
          <template #graph-plug>
            <!-- Node Menu -->
             <!-- 就这一块，放进去就报错，你看看给我整出来 -->
            <div
              v-if="showNodeMenu"
              class="c-surround-menu-panel"
              style="display: flex;align-items: center;justify-content: center;place-items: center;"
              :style="{
                width:nodeMenuPanel.width + 'px',
                height:nodeMenuPanel.height + 'px',
                left:nodeMenuPanel.x + 'px',
                top:nodeMenuPanel.y + 'px'
              }">
              <svg width="100%" height="100%" viewBox="0 0 400 400">
                <g>
                  <g fill="#000000">
                    <path class="c-svg-button" d="m9.99469,187.08997c0,-40.82082 27.52652,-97.86001 62.20722,-128.85359c32.50037,-29.06937 66.90853,-43.9133 114.603,-49.41106l7.15417,-0.82466l0,61.84972l0,61.91844l-4.49691,0c-23.5747,0 -58.05098,34.01735 -58.18725,57.3828l0,4.46692l-60.64011,0l-60.64011,0l0,-6.52858z" @click="clickNodeMenu('1', $event)" />
                    <path class="c-svg-button" d="m269.58887,188.4644c-4.36064,-26.73282 -34.27188,-56.69558 -56.68828,-56.69558l-3.95183,0l0,-61.781l0,-61.71228l7.83552,0.68722c91.98219,8.52152 166.11303,82.60374 174.22109,174.00389l0.95389,10.6519l-60.77638,0l-60.77638,0l-0.81762,-5.15414z" @click="clickNodeMenu('2', $event)" />
                    <path class="c-svg-button" d="m176.92533,393.32443c-89.32493,-11.68273 -166.93065,-94.35519 -166.93065,-177.92103l0,-6.66603l60.43571,0l60.50384,0l0.68135,5.97881c2.52099,23.09056 29.02549,50.99166 52.12324,55.04625c11.3104,1.99294 10.22024,-4.87926 10.22024,63.43033l0,61.09378l-6.47282,-0.20617c-3.54302,-0.13744 -8.31246,-0.41233 -10.56092,-0.75594z" @click="clickNodeMenu('3', $event)" />
                    <path class="c-svg-button" d="m209.28944,332.98659l0.34067,-61.57483l7.49485,-1.64933c7.08604,-1.51188 11.51481,-3.22993 21.12184,-8.4528c6.06401,-3.22993 20.03168,-18.28003 23.43843,-25.22094c4.97385,-10.17084 7.22231,-15.94348 7.22231,-18.62364c0,-1.37444 0.40881,-3.91715 0.88575,-5.6352l0.81762,-3.09249l60.43571,0l60.50384,0l0,5.15414c-0.06813,86.31472 -81.62568,171.87351 -171.35942,179.77653l-11.24227,0.96211l0.34067,-61.64356z" @click="clickNodeMenu('4', $event)" />
                  </g>
                </g>
              </svg>
              <div style="height:100%;width:100%;position: absolute;left: 0px;top:0px;user-select: none;pointer-events: none;color: #ffffff;font-size: 22px;">
  
                  <div style="position: absolute;left:20px;top:20px;"><CircumIcon color="#ffffff" size="20px" name="circle_info"/></div>
                  <div style="position: absolute;right:20px;top:20px;"><CircumIcon color="#ffffff" size="20px" name="link"/></div>
                  <div style="position: absolute;left:20px;top:75px;transform: rotate(180deg);"><CircumIcon color="#ffffff" size="20px" name="maximize_1"/></div>
                  <div style="position: absolute;right:20px;top:75px;"><CircumIcon color="#ffffff" size="20px" name="circle_plus"/></div>
              </div>
              <div class="c-current-node-text"><input v-model="currentNode.text"></div>
            </div>
            <div class="c-operate-panels">
              <!--- Node info card -->
              <div v-if="showNodeInfoCard && currentNode" class="c-node-info-card" :style="{backgroundColor: currentNode.color}">
                <div style="border-bottom: #ffffff solid 1px;">
                  Name: {{ currentNode.text }}
                </div>
                <div style="border-bottom: #ffffff solid 1px;">
                  Position: What you want to show
                </div>
                Avatar:
                <img class="c-person-pic" :src="currentNode.data.icon">
                <div class="c-node-options-panel">
                  <div>Name:</div>
                  <el-input v-model="currentNode.text" style="width:100%;" />
                  <div>Color:</div>
                  <el-color-picker v-model="currentNode.borderColor" show-alpha @change="onChangeColor" />
                  <div>Avatar:</div>
                  <el-input v-model="currentNode.data.icon" style="width:100%;" />
                </div>
              </div>
            </div>
          </template>
        </RelationGraph>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineComponent, ref, onMounted } from 'vue';
//   import CircumIcon from "@klarr-agency/circum-icons-vue"; // Vue
  import RelationGraph, {
      RelationGraphComponent,
      RelationGraphInstance,
      RGJsonData,
      RGNode,
      RGUserEvent,
      RGLine,
      RGLink,
      RGOptions
  } from 'relation-graph-vue3';
  
  const graphOptions: RGOptions = {
      debug: false,
      defaultLineShape: 1,
      placeSingleNode: false,
      moveToCenterWhenRefresh: true,
      zoomToFitWhenRefresh: true,
      layout: {
          layoutName: 'force',
          maxLayoutTimes: 50
  
      },
      defaultNodeBorderWidth: 0,
      defaultNodeColor: '#e85f84',
      'defaultLineMarker': {
          'markerWidth': 20,
          'markerHeight': 20,
          'refX': 3,
          'refY': 3,
          'data': 'M 0 0, V 6, L 4 3, Z'
      }
  };
  const graphRef = ref<RelationGraphInstance | null>(null);
  const isShowCodePanel = ref(false);
  const showNodeInfoCard = ref(false);
  const showNodeOptionsEditor = ref(false);
  const showNodeMenu = ref(false);
  const nodeMenuPanel = ref({ x: 0, y: 0, width: 120, height: 120 });
  const currentNode = ref<RGNode | null>(null);
  onMounted(() => {
      showGraph();
  });
  const showGraph = async() => {
      const graphJsonData: RGJsonData = {
          'rootId': 'N13',
          'nodes': [
              { 'id': 'N1', 'text': '侯亮平', 'color': '#ec6941', 'borderColor': '#ff875e', data: { icon: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2308340537,462224207&fm=58&app=83&f=JPEG?w=250&h=250&s=EC708F46DA96B89CB69D5DDA0300D014&n=侯亮平'}},
              { 'id': 'N2', 'text': '李达康', 'color': '#ec6941', 'borderColor': '#ff875e', data: { icon: 'https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2677153550,2207805387&fm=58&app=83&f=JPEG?w=250&h=250&s=249039DDC2D153D411A851360300C062&n=李达康'}},
              { 'id': 'N3', 'text': '祁同伟', 'color': 'rgba(0, 206, 209, 1)', 'borderColor': '#6cc0ff', data: { icon: 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1725297532,1915921796&fm=58&app=83&f=JPEG?w=250&h=250&s=FE8EA444A60759554DAC1DBB03000092&n=祁同伟'}},
              { 'id': 'N4', 'text': '陈岩石', 'color': '#ec6941', 'borderColor': '#ff875e', data: { icon: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2025797948,1615296290&fm=58&app=83&f=JPEG?w=250&h=250&s=B5B04C331F32739C4604F9F503007021&n=陈岩石'}},
              { 'id': 'N5', 'text': '陆亦可', 'color': '#ec6941', 'borderColor': '#ff875e', data: { icon: 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=344720653,260255884&fm=58&app=83&f=JPEG?w=250&h=250&s=57B8AB676AE862941D94ED170300E060&n=陆亦可'}},
              { 'id': 'N6', 'text': '高育良', 'color': 'rgba(0, 206, 209, 1)', 'borderColor': '#6cc0ff', data: { icon: 'https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3098576865,849900134&fm=58&app=83&f=JPEG?w=250&h=250&s=EDE01A63A65917DC104509920300C0C1&n=高育良'}},
              { 'id': 'N7', 'text': '沙瑞金', 'color': '#ec6941', 'borderColor': '#ff875e', data: { icon: 'https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3722686698,2547355567&fm=58&app=83&f=JPEG?w=250&h=250&s=BF8A356E04E1B2BCEFA45D860100E0E1&n=沙瑞金'}},
              { 'id': 'N8', 'text': '高小琴', 'color': 'rgba(0, 206, 209, 1)', 'borderColor': '#6cc0ff', data: { icon: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=4266886844,1791850012&fm=58&s=66B01AC758BB67960834B8FA0300C011&n=高小琴'}},
              { 'id': 'N9', 'text': '高小凤', 'color': 'rgba(0, 206, 209, 1)', 'borderColor': '#6cc0ff', data: { icon: 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2747443453,2680399969&fm=58&app=83&f=JPEG?w=150&h=150&s=DB8828C1562265150814ADFE03007012&n=高小凤'}},
              { 'id': 'N10', 'text': '赵东来', 'color': '#ec6941', 'borderColor': '#ff875e', data: { icon: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=3301823375,1282024443&fm=58&app=83&f=JPG?w=250&h=250&s=2BC2834F2C22A25D12C06CA80300E013&n=赵东来'}},
              { 'id': 'N11', 'text': '程度', 'color': 'rgba(0, 206, 209, 1)', 'borderColor': '#6cc0ff', data: { icon: 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=134233720,666111889&fm=58&app=83&f=JPG?w=250&h=250&s=4DE5A844801F1BD461E039A20300C0C3&n=程度'}},
              { 'id': 'N12', 'text': '吴惠芬', 'color': '#ec6941', 'borderColor': '#ff875e', data: { icon: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1215039713,3597142764&fm=58&app=83&f=JPEG?w=250&h=250&s=1A20E0018E3B6E9CD10C7DA30300E081&n=吴惠芬'}},
              { 'id': 'N13', 'text': '赵瑞龙', 'color': 'rgba(0, 206, 209, 1)', 'borderColor': '#6cc0ff', data: { icon: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1140839330,2922201597&fm=58&app=83&f=JPEG?w=250&h=250&s=CDF9A844D45AB87512C8508B0100F080&n=赵瑞龙'}},
              { 'id': 'N14', 'text': '赵立春', 'color': 'rgba(0, 206, 209, 1)', 'borderColor': '#6cc0ff', data: { icon: 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2110325119,1633583088&fm=58&app=83&f=JPEG?w=120&h=120&s=971E35C05A43305DCA7C1C0B030080C&n=赵立春'}},
              { 'id': 'N15', 'text': '陈海', 'color': '#ec6941', 'borderColor': '#ff875e', data: { icon: 'https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=1416498138,2265298708&fm=58&app=83&f=JPEG?w=250&h=250&s=F906CF1C0E1356D046AC3CEB0300B0A0&n=陈海'}},
              { 'id': 'N16', 'text': '梁璐', 'color': '#ec6941', 'borderColor': '#ff875e', data: { icon: 'https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3749144697,3456463661&fm=58&app=83&f=JPEG?w=250&h=250&s=783823D3FE621E94138CC08B030070C2&n=梁璐'}},
              { 'id': 'N17', 'text': '刘新建', 'color': 'rgba(0, 206, 209, 1)', 'borderColor': '#6cc0ff', data: { icon: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2263876103,310235844&fm=58&app=83&f=JPEG?w=250&h=250&s=6CE2A944CC1223DC632CC09203009082&n=刘新建'}},
              { 'id': 'N18', 'text': '欧阳菁', 'color': 'rgba(0, 206, 209, 1)', 'borderColor': '#6cc0ff', data: { icon: 'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=3590139977,3135325708&fm=58&app=83&f=JPEG?w=250&h=250&s=2F1C8B46C4A214BCE100A81A03004091&n=欧阳菁'}},
              { 'id': 'N19', 'text': '吴心怡', 'color': '#ec6941', 'borderColor': '#ff875e', data: { icon: 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2110325119,1633583088&fm=58&app=83&f=JPEG?w=120&h=120&s=971E35C05A43305DCA7C1C0B030080C&n=吴心怡'}},
              { 'id': 'N20', 'text': '蔡成功', 'color': 'rgba(0, 206, 209, 1)', 'borderColor': '#6cc0ff', data: { icon: 'https://dss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=4153440298,254451173&fm=58&app=83&f=JPEG?w=250&h=250&s=07C2B4488C42D355548CC41F010080D1&n=蔡成功'}},
              { 'id': 'N21', 'text': '丁义珍', 'color': 'rgba(0, 206, 209, 1)', 'borderColor': '#6cc0ff', data: { icon: 'https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=842795163,1346447987&fm=58&app=83&f=JPEG?w=250&h=250&s=2BC3736EE499247D41C0B4820100E093&n=丁义珍'}}
          ],
          'lines': [
              { 'from': 'N6', 'to': 'N1', 'text': '师生', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N6', 'to': 'N3', 'text': '师生', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N14', 'to': 'N6', 'text': '前领导', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N14', 'to': 'N13', 'text': '父子', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N14', 'to': 'N17', 'text': '前部队下属', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N2', 'to': 'N14', 'text': '前任秘书', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N3', 'to': 'N8', 'text': '情人', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N4', 'to': 'N15', 'text': '父子', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N5', 'to': 'N15', 'text': '属下', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N7', 'to': 'N4', 'text': '故人', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N3', 'to': 'N15', 'text': '师哥', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N3', 'to': 'N1', 'text': '师哥', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N1', 'to': 'N15', 'text': '同学，生死朋友', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N6', 'to': 'N12', 'text': '夫妻', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N15', 'to': 'N10', 'text': '朋友', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N8', 'to': 'N9', 'text': '双胞胎', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N10', 'to': 'N5', 'text': '爱慕', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N3', 'to': 'N11', 'text': '领导', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N6', 'to': 'N9', 'text': '情人', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N13', 'to': 'N3', 'text': '勾结', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N2', 'to': 'N10', 'text': '领导', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N13', 'to': 'N11', 'text': '领导', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N7', 'to': 'N2', 'text': '领导', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N7', 'to': 'N6', 'text': '领导', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N3', 'to': 'N16', 'text': '夫妻', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N12', 'to': 'N16', 'text': '朋友', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N2', 'to': 'N18', 'text': '夫妻', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N13', 'to': 'N17', 'text': '洗钱工具', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N13', 'to': 'N8', 'text': '勾结，腐化', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N13', 'to': 'N9', 'text': '腐化', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N19', 'to': 'N5', 'text': '母女', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N19', 'to': 'N12', 'text': '姐妹', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N20', 'to': 'N1', 'text': '发小', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N20', 'to': 'N18', 'text': '举报', 'color': '#ed724d', 'fontColor': '#ed724d'},
              { 'from': 'N18', 'to': 'N17', 'text': '举报', 'color': '#ed724d', 'fontColor': '#ed724d'},
              { 'from': 'N17', 'to': 'N13', 'text': '举报', 'color': '#ed724d', 'fontColor': '#ed724d'},
              { 'from': 'N2', 'to': 'N21', 'text': '领导', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N8', 'to': 'N21', 'text': '策划出逃', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N3', 'to': 'N21', 'text': '勾结', 'color': '#d2c0a5', 'fontColor': '#d2c0a5'},
              { 'from': 'N13', 'to': 'N21', 'text': '勾结', 'color': '#d2c0a5', 'fontColor': '#d2c0a5' }
          ]
      };
      const graphInstance = graphRef.value?.getInstance();
      if (graphInstance) {
          await graphInstance.setJsonData(graphJsonData);
      }
  };
  
  const updateNodeMenuPosition = () => {
      if (!currentNode.value) return;
      const graphInstance = graphRef.value?.getInstance();
      if (graphInstance) {
          const _base_position = graphInstance.getBoundingClientRect();
          const viewCoordinate = graphInstance.getViewPointByCanvasPoint({
              x: currentNode.value.x + currentNode.value.el.offsetWidth / 2,
              y: currentNode.value.y + currentNode.value.el.offsetHeight / 2
          });
          console.log('showNodeMenus:', viewCoordinate, _base_position);
          nodeMenuPanel.value.x = viewCoordinate.x - nodeMenuPanel.value.width / 2;
          nodeMenuPanel.value.y = viewCoordinate.y - nodeMenuPanel.value.height / 2;
      }
  };
  
  const onNodeClick = (nodeObject: RGNode, $event: RGUserEvent) => {
      console.log('onNodeClick:', nodeObject);
      currentNode.value = nodeObject;
      updateNodeMenuPosition();
      showNodeMenu.value = true;
  };
  
  const onCanvasClick = () => {
      const graphInstance = graphRef.value?.getInstance();
      if (graphInstance) {
          graphInstance.clearChecked();
      }
      showNodeMenu.value = false;
      showNodeInfoCard.value = false;
      showNodeOptionsEditor.value = false;
  };
  
  const onZoomEnd = () => {
      console.log('onZoomEnd:');
      updateNodeMenuPosition();
  };
  
  const onNodeDragEnd = () => {
      console.log('onNodeDragEnd:');
      updateNodeMenuPosition();
  };
  
  const onCanvasDragEnd = () => {
      console.log('onCanvasDragEnd:');
      updateNodeMenuPosition();
  };
  
  const clickNodeMenu = (menuId: string, e: RGUserEvent) => {
      showNodeMenu.value = false;
      console.log('Node:', currentNode.value?.text, 'Menu Event:', menuId);
      if (menuId === '1') {
          showNodeInfoCard.value = !showNodeInfoCard.value;
      } else if (menuId === '2') {
          copyNode();
      } else if (menuId === '3') {
          createLine(e);
      } else if (menuId === '4') {
          addChildNode();
      }
  };
  
  const copyNode = () => {
      const graphInstance = graphRef.value?.getInstance();
      if (graphInstance && currentNode.value) {
          const newNodeId = graphInstance.generateNewNodeId();
          const newNode: RGNode = {
              id: newNodeId,
              color: currentNode.value.color,
              text: currentNode.value.text,
              borderColor: currentNode.value.borderColor,
              data: { ...currentNode.value.data },
              force_weight: 20, // default is 1
  
              x: currentNode.value.x + 60,
              y: currentNode.value.y + 60
  
          };
          graphInstance.addNodes([newNode]);
          graphInstance.layouter.allLinks = graphInstance.getLinks();
          graphInstance.layouter.allNodes = graphInstance.getNodes();
          graphInstance.layouter.autoLayout();
      }
  };
  
  const showNodeInfo = () => {
      showNodeInfoCard.value = !showNodeInfoCard.value;
  };
  
  const addChildNode = () => {
      const graphInstance = graphRef.value!.getInstance();
      const newNodeId = graphInstance.generateNewNodeId();
      graphInstance.addNodes([{id: newNodeId, text: 'New Node', x: currentNode.value!.x + 60, y: currentNode.value!.y + 60}]);
      graphInstance.addLines([{from: currentNode.value!.id, to: newNodeId}]);
      graphInstance.layouter.allLinks = graphInstance.getLinks();
      graphInstance.layouter.allNodes = graphInstance.getNodes();
      graphInstance.layouter.autoLayout();
  };
  const onChangeColor = (v) => {
      console.log('onChangeColor', v);
      currentNode.value!.borderColor = v;
      currentNode.value!.color = v;
      currentNode.value!.fontColor = v;
  };
  const createLine = (e) => {
      const graphInstance = graphRef.value!.getInstance();
      graphInstance.startCreatingLinePlot(e, {
          template: {
              lineWidth: 2,
              color: '#8080ff',
              text: 'New Line'
          },
          fromNode: currentNode.value,
          onCreateLine: (from, to) => {
              console.log('New Line：', from, to);
              if (to.id) { // 创建的连线的起点一定是节点，但终点可以是空白处，终点没有选择成节点时to不是一个节点，to.id不会有值，这里做了判断，只处理to为节点的情况
                  graphInstance.addLines([{
                      from: from.id,
                      to: to.id,
                      lineWidth: 3,
                      color: '#8080ff',
                      text: 'New Line'
                  }]);
              }
          }
      });
  };
  </script>
  
  <style  scoped>
  ::v-deep(.relation-graph) {
      .rel-node-shape-0{
          padding:3px !important;
      }
  }
  .my-node-style{
      background-position: center center;
      background-size: 100%;
      height:100%;
      width:100%;
      border-radius: 40px;
      overflow: visible;
  }
  .c-node-name{
      width:80px;
      text-align:center;
      color: #2E74B5;
      margin-top: 10px;
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
  .c-surround-menu-panel{
      position:absolute;width:160px;height:160px;z-index:999;
      animation: growUp 0.5s linear;
      box-shadow: 0 0 0 38px rgba(255, 255, 255, 0.56) inset;
      border-radius: 50%;
  }
  .c-svg-button {
      fill: rgba(26, 22, 28, 0.65);
      cursor: pointer;
  }
  .c-svg-bottom-text {
      cursor: pointer;
      color: #ffffff;
  }
  .c-svg-button:hover {
      fill: rgba(26, 23, 28, 0.85);
  }
  @keyframes node-text-in {
      from {
          opacity: 0;
      }
      50% {
          opacity: 0;
      }
      to {
          opacity: 1;
      }
  }
  .c-current-node-text {
      position: absolute;
      top: calc(100% + 16px);
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      animation: node-text-in 1s linear;
      input {
          background-color: rgba(35, 30, 37, 0.68);
          color: #ffffff;
          border-radius: 5px;
          width: 100%;
          padding-left:10px;
          padding-right:10px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          border-width: 0px;
          &:focus {
              background-color: #dfac03;
          }
      }
  }
  .c-operate-panels {
      position: absolute;z-index: 700;left:30px; top:30px;width:200px;
  }
  .c-node-info-card {
      text-align: left;padding:10px;
      background-color: rgba(233, 210, 243, 0.68);
      border-radius: 10px;
      font-size: 12px;
      line-height: 25px;
  }
  .c-person-pic{
      width: 120px;
      border-radius: 50%;
      margin-top:10px;
  }
  .c-node-options-panel {
      border-radius: 10px;
      font-size: 12px;
      line-height: 25px;
      margin-top: 20px;
  }
  </style>
  