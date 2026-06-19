<template>
  <el-card header="机库格位总览">
    <div style="margin-bottom: 16px">
      <el-tag>总格位: {{ slots.length }}</el-tag>
      <el-tag type="success" style="margin-left: 8px">空闲: {{ slots.filter(s => s.status === 'available').length }}</el-tag>
      <el-tag type="danger" style="margin-left: 8px">占用: {{ slots.filter(s => s.status === 'occupied').length }}</el-tag>
      <el-tag type="warning" style="margin-left: 8px">维护: {{ slots.filter(s => s.status === 'maintenance').length }}</el-tag>
    </div>
    <div v-for="row in rows" :key="row" style="display: flex; gap: 12px; margin-bottom: 12px">
      <div v-for="col in cols" :key="col" style="flex: 1">
        <el-card
          :body-style="{ padding: '12px', textAlign: 'center', cursor: 'pointer' }"
          :style="slotStyle(row, col)"
          shadow="hover"
          @click="showSlotDetail(row, col)"
        >
          <div style="font-weight: bold">{{ `H${row}-${col}` }}</div>
          <el-tag :type="slotStatusType(row, col)" size="small" style="margin-top: 4px">
            {{ slotStatusLabel(row, col) }}
          </el-tag>
          <div v-if="getSlot(row, col)?.member" style="font-size: 12px; color: #909399; margin-top: 4px">
            {{ getSlot(row, col).member?.name }}
          </div>
        </el-card>
      </div>
    </div>
  </el-card>

  <el-dialog v-model="detailVisible" :title="'格位 ' + currentSlot?.code" width="500px">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="编码">{{ currentSlot?.code }}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="slotStatusType2(currentSlot)">{{ slotStatusLabel2(currentSlot) }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="占用会员">{{ currentSlot?.member?.name || '无' }}</el-descriptions-item>
    </el-descriptions>
    <div v-if="currentSlot?.aircraft?.length" style="margin-top: 12px">
      <h4>飞机</h4>
      <el-tag v-for="a in currentSlot.aircraft" :key="a.id" style="margin: 4px">{{ a.name }} ({{ a.type }})</el-tag>
    </div>
    <div v-if="currentSlot?.batteries?.length" style="margin-top: 12px">
      <h4>电池</h4>
      <el-tag v-for="b in currentSlot.batteries" :key="b.id" type="warning" style="margin: 4px">{{ b.name }}</el-tag>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../api'

const slots = ref([])
const detailVisible = ref(false)
const currentSlot = ref(null)

const rows = computed(() => [...new Set(slots.value.map(s => s.row))].sort())
const cols = computed(() => [...new Set(slots.value.map(s => s.column))].sort())

onMounted(async () => {
  const res = await api.get('/hangar/slots', { params: { limit: 100 } })
  slots.value = res.data[0] || []
})

function getSlot(row, col) {
  return slots.value.find(s => s.row === row && s.column === col)
}

function slotStyle(row, col) {
  const s = getSlot(row, col)
  if (!s) return {}
  if (s.status === 'occupied') return { border: '2px solid #f56c6c' }
  if (s.status === 'maintenance') return { border: '2px solid #e6a23c' }
  return { border: '2px solid #67c23a' }
}

function slotStatusType(row, col) {
  const s = getSlot(row, col)
  if (!s) return 'info'
  const m = { available: 'success', occupied: 'danger', maintenance: 'warning' }
  return m[s.status] || 'info'
}

function slotStatusLabel(row, col) {
  const s = getSlot(row, col)
  if (!s) return '-'
  const m = { available: '空闲', occupied: '占用', maintenance: '维护' }
  return m[s.status] || s.status
}

function slotStatusType2(s) {
  if (!s) return 'info'
  const m = { available: 'success', occupied: 'danger', maintenance: 'warning' }
  return m[s.status] || 'info'
}

function slotStatusLabel2(s) {
  if (!s) return '-'
  const m = { available: '空闲', occupied: '占用', maintenance: '维护' }
  return m[s.status] || s.status
}

async function showSlotDetail(row, col) {
  const s = getSlot(row, col)
  if (!s) return
  const res = await api.get(`/hangar/slots/${s.id}`)
  currentSlot.value = res.data
  detailVisible.value = true
}
</script>
