<template>
  <div style="padding: 10px; height: 338px; overflow-y: scroll">
    <el-row>
      <el-col class="severTitle" :span="8"> Server version </el-col>
      <el-col :span="16" class="severContent">
        {{ summaryData.server.agent }}
      </el-col>
    </el-row>
    <el-row>
      <el-col class="severTitle" :span="8"> Server address </el-col>
      <el-col :span="16" class="severContent">
        {{ summaryData.server.address }}
      </el-col>
    </el-row>
    <el-row>
      <el-col class="severTitle" :span="8"> Query </el-col>
      <el-col :span="16" class="severContent">
        {{ summaryData.query.text }}
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
        :style="{ height: isunfold ? '100%' : '30px'} "
        style="font-size: 16px; color: #666666;overflow: hidden;">
        {{ summaryData }}
      </el-col>
    </el-row>
    <el-row>
      <el-col class="severTitle" :span="8">
        Response
        <CaretRightOutlined v-if="!isres" @click="resClick" />
        <CaretDownOutlined v-else @click="resClick"/></el-col>
      <el-col
        :span="16"
        :style="{ height: isres ? '100%' : '30px'} "
        style="font-size: 16px; color: #666666;overflow: hidden;">
        {{ ResponseData }}
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CaretRightOutlined,CaretDownOutlined } from "@ant-design/icons-vue";
// summaryData是否展开
const isunfold = ref(false);
const isres = ref(false)
const props = defineProps({
  codeData: Object,
});

// summaryData展开
const unfoldClick = () => {
  isunfold.value = !isunfold.value
};
//res展开
const resClick = ()=>{
  isres.value = !isres.value
}
const summaryData = props.codeData.data.item.result.summary;
const ResponseData = props.codeData.data.item.result.records;

// console.log(JSON.stringify(summaryData.query,null,2))
// watch(props, (newValue, oldValue) => {
//   const summaryData = props.codeData.data.item.summary;
// const ResponseData = props.codeData.data.item.records;
// });
</script>

<style scoped>
.severTitle {
  font-size: 16px;
  color: #666666;
  font-weight: 600;
}

</style>