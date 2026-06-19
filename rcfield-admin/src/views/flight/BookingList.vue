<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>飞行预约列表</span>
        <el-button type="primary" @click="$router.push('/flight-bookings/new')">新建预约</el-button>
      </div>
    </template>
    <el-form :inline="true" :model="query" style="margin-bottom: 16px">
      <el-form-item label="状态">
        <el-select v-model="query.status" clearable placeholder="全部" style="width: 120px">
          <el-option label="待审核" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已拒绝" value="rejected" />
          <el-option label="已取消" value="cancelled" />
          <el-option label="已完成" value="completed" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="query.date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="bookings" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="startTime" label="开始时间" width="100" />
      <el-table-column prop="endTime" label="结束时间" width="100" />
      <el-table-column label="跑道" width="120">
        <template #default="{ row }">{{ row.runway?.name || '-' }}</template>
      </el-table-column>
      <el-table-column prop="frequency" label="频率(MHz)" width="110" />
      <el-table-column label="会员" width="100">
        <template #default="{ row }">{{ row.member?.name || '-' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button v-if="row.status === 'pending' && (userStore.isSafetyOfficer || userStore.isAdmin)" type="success" size="small" @click="reviewBooking(row.id, 'approved')">通过</el-button>
          <el-button v-if="row.status === 'pending' && (userStore.isSafetyOfficer || userStore.isAdmin)" type="danger" size="small" @click="reviewBooking(row.id, 'rejected')">拒绝</el-button>
          <el-button v-if="row.status === 'pending' || row.status === 'approved'" type="warning" size="small" @click="cancelBooking(row.id)">取消</el-button>
        </template>
      </el-table-column>
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
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../../api'
import { useUserStore } from '../../stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const userStore = useUserStore()
const bookings = ref([])
const total = ref(0)
const query = reactive({ status: '', date: '', page: 1, limit: 20 })

onMounted(() => loadData())

async function loadData() {
  const params = { ...query }
  if (!params.status) delete params.status
  if (!params.date) delete params.date
  const res = await api.get('/flight-bookings', { params })
  bookings.value = res.data[0] || []
  total.value = res.data[1] || 0
}

async function reviewBooking(id, status) {
  await ElMessageBox.confirm(`确认${status === 'approved' ? '通过' : '拒绝'}此预约?`, '审核')
  await api.put(`/flight-bookings/${id}/review`, { status })
  ElMessage.success('操作成功')
  loadData()
}

async function cancelBooking(id) {
  await ElMessageBox.confirm('确认取消此预约?', '取消')
  await api.put(`/flight-bookings/${id}/cancel`)
  ElMessage.success('已取消')
  loadData()
}

function statusLabel(s) {
  const m = { pending: '待审核', approved: '已通过', rejected: '已拒绝', cancelled: '已取消', completed: '已完成' }
  return m[s] || s
}

function statusType(s) {
  const m = { pending: 'warning', approved: 'success', rejected: 'danger', cancelled: 'info', completed: '' }
  return m[s] || ''
}
</script>
