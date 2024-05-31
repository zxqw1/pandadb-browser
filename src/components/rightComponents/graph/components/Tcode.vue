<template>
  <div style="padding: 10px; height: 338px; overflow-y: scroll">
    <table style="width: 100%">
      <tr>
        <td class="Server">Server version</td>
        <td>{{ summaryData.server.agent }}</td>
      </tr>
      <tr>
        <td class="Server">Server address</td>
        <td>{{ summaryData.server.address }}</td>
      </tr>
      <tr>
        <td class="Server">Query</td>
        <td>{{ summaryData.query.text }}</td>
      </tr>
      <tr>
        <td class="Server">Summary</td>
        <td>
          <div style="height: 30px; line-height: 30px;">
            {{ summaryData }}
          </div>
        </td>
      </tr>
      <tr>
        <td class="Server">Response</td>
        <td>
          <div >
            {{ ResponseData }}
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  codeData: Object,
});
const summaryData = props.codeData.data.item.summary;
const ResponseData = props.codeData.data.item.records;
// watch(props, (newValue, oldValue) => {
//   const summaryData = props.codeData.data.item.summary;
// const ResponseData = props.codeData.data.item.records;
// });
</script>

<style scoped>
.Server {
  width: 35%;
  font-size: 16px;
  color: #666666;
  font-weight: 600;
}
tr {
  height: 30px !important;
}
</style>