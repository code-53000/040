<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>飞行记录</span>
        <el-button v-if="userStore.isSafetyOfficer || userStore.isAdmin" type="primary" @click="showDialog = true">新增记录</el-button>
      </div>
    </template>
    <el-table :data="records" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="bookingId" label="预约ID" width="80" />
      <el-table-column prop="actualStartTime" label="实际起飞" width="100" />
      <el-table-column prop="actualEndTime" label="实际降落" width="100" />
      <el-table-column label="安全员" width="100">
        <template #default="{ row }">{{ row.safetyOfficer?.name || '-' }}</template>
      </el-table-column>
      <el-table-column prop="weatherConditions" label="天气" width="100" />
      <el-table-column prop="notes" label="备注" show-overflow-tooltip />
      <el-table-column prop="createdAt" label="记录时间" width="180" />
    </el-table>

    <el-pagination
      style="margin-top: 16px; justify-content: flex-end"
      v-model:current-page="query.page"
      :page-size="query.limit"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="loadData"
    />
  </el-card>

  <el-dialog v-model="showDialog" title="新增飞行记录" width="500px">
    <el-form :model="form" label-width="100px">
      <el-form-item label="预约ID">
        <el-input-number v-model="form.bookingId" style="width: 100%" />
      </el-form-item>
      <el-form-item label="实际起飞">
        <el-input v-model="form.actualStartTime" placeholder="如 09:30" />
      </el-form-item>
      <el-form-item label="实际降落">
        <el-input v-model="form.actualEndTime" placeholder="如 10:00" />
      </el-form-item>
      <el-form-item label="天气">
        <el-input v-model="form.weatherConditions" placeholder="晴/多云/风大等" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.notes" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="handleAdd">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../../api'
import { useUserStore } from '../../stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const records = ref([])
const total = ref(0)
const showDialog = ref(false)
const query = reactive({ page: 1, limit: 20 })
const form = reactive({ bookingId: null, actualStartTime: '', actualEndTime: '', weatherConditions: '', notes: '' })

onMounted(() => loadData())

async function loadData() {
  const res = await api.get('/flight-records', { params: query })
  records.value = res.data[0] || []
  total.value = res.data[1] || 0
}

async function handleAdd() {
  await api.post('/flight-records', form)
  ElMessage.success('飞行记录已添加')
  showDialog.value = false
  loadData()
}
</script>
