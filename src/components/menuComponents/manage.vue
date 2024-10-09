  <template>
  <div>
    <el-menu class="el-menu-vertical-demo" active-text-color="#6C7D2E" active-color="#f8ffe3" @select="menuSelect"
      @close="handleClose">
      <el-sub-menu index="Monitor">
        <template #title>
          <el-icon>
            <Odometer />
          </el-icon>
          <span class="monitor">实时监控</span>
        </template>
        <el-menu-item index="OperationLog">
          <el-icon>
            <Tickets />
          </el-icon>
          <span>操作日志</span>
        </el-menu-item>
        <el-menu-item index="RunLog">
          <el-icon>
            <Memo />
          </el-icon>
          <span>运行日志</span>
        </el-menu-item>
        <el-menu-item index="Database">
          <el-icon><Coin /></el-icon>
          <span>
            数据库运行情况
          </span>
          </el-menu-item>
        <el-menu-item index="OperatingSystem">
          <el-icon><DataBoard /></el-icon>
        <span>系统运行情况</span>  
        </el-menu-item>
        <el-menu-item index="alarm">
          <el-icon><Warning /></el-icon>
        <span>告警记录</span>  
        </el-menu-item>
        <el-menu-item index="threshold">
          <el-icon><Postcard /></el-icon>
          <span>阈值配置</span>
        </el-menu-item>
        <el-menu-item index="statistics">
          <el-icon><DataAnalysis /></el-icon>
        <span>统计数据</span>  
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item index="management">
          <el-icon><Management /></el-icon>
        <span>作业管理</span>  
        </el-menu-item>
      <el-menu-item index="onlineBackup">
        <el-icon>
          <CopyDocument />
        </el-icon>
        <span>在线备份</span>
      </el-menu-item>
      <el-menu-item index="restore">
        <el-icon>
          <SetUp />
        </el-icon>
        <span>数据恢复</span>
      </el-menu-item>
      <el-sub-menu index="audit">
        <template #title>
          <el-icon>
            <CreditCard />
          </el-icon>
          <span class="monitor">操作审计</span>
        </template>
        <el-menu-item index="loginLog">
          <el-icon><DocumentRemove /></el-icon>
          <span>登录日志</span>
        </el-menu-item>
        <el-menu-item index="OperationRecord">
          <el-icon><Reading /></el-icon>
          <span>操作记录</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { Odometer, CopyDocument, SetUp, CreditCard, Tickets,Memo,Coin,DataBoard,Warning,Postcard,DataAnalysis,Management,DocumentRemove,Reading} from '@element-plus/icons-vue'
import mitts from '../../utils/bus'
const menuSelect = (key: string, keyPath: string[]) => {
  mitts.emit("menuEmit", key)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
/* 修改一级菜单项鼠标浮动时的背景色 */
.el-menu .el-menu-item:hover,
.el-menu .el-submenu__title:hover {
  background-color: #f8ffe3;
  /* 你可以修改为任何你想要的颜色 */
}

/* 如果你还想修改子菜单项的背景色 */
.el-submenu .el-menu .el-menu-item:hover,
.el-submenu .el-submenu__title:hover {
  background-color: #f8ffe3;
  /* 你可以为子菜单项指定不同的颜色 */
}

.monitor:hover {
  background-color: #f8ffe3;
}

::v-deep .el-sub-menu__title:hover {
  background-color: #f8ffe3 !important;
}
</style>