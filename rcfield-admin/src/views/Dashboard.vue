<template>
  <div>
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="总预约数" :value="stats.totalBookings || 0" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="待审核" :value="stats.pendingBookings || 0" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="事故记录" :value="stats.totalIncidents || 0" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="活跃跑道" :value="stats.activeRunways || 0" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" v-if="userStore.isAdmin || userStore.isSafetyOfficer">
      <el-col :span="12">
        <el-card header="预约状态分布">
          <div ref="bookingStatusChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="事故类型分布">
          <div ref="incidentTypeChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px" v-if="userStore.isAdmin || userStore.isSafetyOfficer">
      <el-col :span="12">
        <el-card header="跑道使用情况">
          <div ref="runwayUsageChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="近期预约趋势">
          <div ref="recentTrendChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card v-if="userStore.isMember" header="我的快捷操作" style="margin-top: 20px">
      <el-row :gutter="20">
        <el-col :span="6">
          <router-link to="/flight-bookings/new">
            <el-button type="primary" size="large" style="width: 100%">新建飞行预约</el-button>
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link to="/hangar/aircraft">
            <el-button type="success" size="large" style="width: 100%">管理我的飞机</el-button>
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link to="/hangar/batteries">
            <el-button type="warning" size="large" style="width: 100%">管理我的电池</el-button>
          </router-link>
        </el-col>
        <el-col :span="6">
          <router-link to="/flight-bookings">
            <el-button size="large" style="width: 100%">查看预约记录</el-button>
          </router-link>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import api from '../api'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const stats = ref({})
const bookingStatusChart = ref()
const incidentTypeChart = ref()
const runwayUsageChart = ref()
const recentTrendChart = ref()

onMounted(async () => {
  if (userStore.isAdmin || userStore.isSafetyOfficer) {
    try {
      const res = await api.get('/admin/stats')
      stats.value = res.data
      await nextTick()
      renderCharts()
    } catch (e) {
      // may fail for non-admin
    }
  }
})

function renderCharts() {
  if (stats.value.bookingByStatus?.length) {
    const chart = echarts.init(bookingStatusChart.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: stats.value.bookingByStatus.map(i => ({
          name: statusLabel(i.status),
          value: parseInt(i.count),
        })),
      }],
    })
  }

  if (stats.value.incidentByType?.length) {
    const chart = echarts.init(incidentTypeChart.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: stats.value.incidentByType.map(i => ({
          name: incidentTypeLabel(i.type),
          value: parseInt(i.count),
        })),
      }],
    })
  }

  if (stats.value.runwayUsage?.length) {
    const chart = echarts.init(runwayUsageChart.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: stats.value.runwayUsage.map(i => i.runway) },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: stats.value.runwayUsage.map(i => parseInt(i.count)) }],
    })
  }

  if (stats.value.recentBookings?.length) {
    const chart = echarts.init(recentTrendChart.value)
    const sorted = [...stats.value.recentBookings].reverse()
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: sorted.map(i => i.date) },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: sorted.map(i => parseInt(i.count)), smooth: true, areaStyle: {} }],
    })
  }
}

function statusLabel(s) {
  const m = { pending: '待审核', approved: '已通过', rejected: '已拒绝', cancelled: '已取消', completed: '已完成' }
  return m[s] || s
}

function incidentTypeLabel(t) {
  const m = { frequency_conflict: '频率冲突', airspace_conflict: '空域冲突', runway_incursion: '跑道入侵', equipment_failure: '设备故障', other: '其他' }
  return m[t] || t
}
</script>
