<template>
  <el-card header="事故记录">
    <el-form :inline="true" :model="query" style="margin-bottom: 16px">
      <el-form-item label="类型">
        <el-select v-model="query.type" clearable placeholder="全部" style="width: 140px">
          <el-option label="频率冲突" value="frequency_conflict" />
          <el-option label="空域冲突" value="airspace_conflict" />
          <el-option label="跑道入侵" value="runway_incursion" />
          <el-option label="设备故障" value="equipment_failure" />
          <el-option label="其他" value="other" />
        </el-select>
      </el-form-item>
      <el-form-item label="严重程度">
        <el-select v-model="query.severity" clearable placeholder="全部" style="width: 120px">
          <el-option label="轻微" value="minor" />
          <el-option label="严重" value="major" />
          <el-option label="危急" value="critical" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="incidents" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column label="类型" width="120">
        <template #default="{ row }">
          <el-tag :type="incidentTypeTag(row.type)">{{ typeLabel(row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="严重程度" width="100">
        <template #default="{ row }">
          <el-tag :type="severityType(row.severity)">{{ severityLabel(row.severity) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column label="上报人" width="100">
        <template #default="{ row }">{{ row.reporter?.name || '-' }}</template>
      </el-table-column>
      <el-table-column prop="createdAt" label="上报时间" width="180" />
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

const incidents = ref([])
const total = ref(0)
const query = reactive({ type: '', severity: '', page: 1, limit: 20 })

onMounted(() => loadData())

async function loadData() {
  const params = { ...query }
  if (!params.type) delete params.type
  if (!params.severity) delete params.severity
  const res = await api.get('/incidents', { params })
  incidents.value = res.data[0] || []
  total.value = res.data[1] || 0
}

function typeLabel(t) {
  const m = { frequency_conflict: '频率冲突', airspace_conflict: '空域冲突', runway_incursion: '跑道入侵', equipment_failure: '设备故障', other: '其他' }
  return m[t] || t
}

function incidentTypeTag(t) {
  const m = { frequency_conflict: 'danger', airspace_conflict: 'danger', runway_incursion: 'warning', equipment_failure: '', other: 'info' }
  return m[t] || ''
}

function severityLabel(s) {
  const m = { minor: '轻微', major: '严重', critical: '危急' }
  return m[s] || s
}

function severityType(s) {
  const m = { minor: '', major: 'warning', critical: 'danger' }
  return m[s] || ''
}
</script>
