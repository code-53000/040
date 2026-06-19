<template>
  <el-card header="频率分配与查看">
    <el-form :inline="true" style="margin-bottom: 16px">
      <el-form-item label="日期">
        <el-date-picker v-model="date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="bookings" border stripe>
      <el-table-column prop="id" label="预约ID" width="80" />
      <el-table-column label="会员" width="100">
        <template #default="{ row }">{{ row.member?.name || '-' }}</template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始" width="80" />
      <el-table-column prop="endTime" label="结束" width="80" />
      <el-table-column prop="frequency" label="当前频率(MHz)" width="140" />
      <el-table-column label="跑道" width="100">
        <template #default="{ row }">{{ row.runway?.name || '-' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-input-number v-model="row.newFreq" :min="27" :max="5800" :step="0.025" :precision="3" size="small" style="width: 130px" />
          <el-button type="primary" size="small" @click="allocate(row)">分配</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api'
import { ElMessage } from 'element-plus'

const date = ref(new Date().toISOString().slice(0, 10))
const bookings = ref([])

onMounted(() => loadData())

async function loadData() {
  if (!date.value) return
  const res = await api.get('/admin/frequency-usage', { params: { date: date.value } })
  bookings.value = (res.data || []).map(b => ({ ...b, newFreq: b.frequency }))
}

async function allocate(row) {
  if (!row.newFreq) {
    ElMessage.warning('请输入频率')
    return
  }
  await api.put(`/admin/allocate-frequency/${row.id}`, { frequency: row.newFreq })
  ElMessage.success('频率已分配')
  loadData()
}
</script>
