<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>我的飞机</span>
        <el-button type="primary" @click="showDialog = true">登记新飞机</el-button>
      </div>
    </template>
    <el-table :data="aircraft" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" width="150" />
      <el-table-column prop="type" label="类型" width="120">
        <template #default="{ row }">{{ typeLabel(row.type) }}</template>
      </el-table-column>
      <el-table-column prop="frequency" label="频率(MHz)" width="120" />
      <el-table-column label="格位" width="120">
        <template #default="{ row }">{{ row.hangarSlot?.code || '未分配' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="showDialog" title="登记新飞机" width="500px">
    <el-form :model="form" label-width="100px">
      <el-form-item label="名称">
        <el-input v-model="form.name" placeholder="飞机名称" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="form.type" placeholder="选择类型" style="width: 100%">
          <el-option label="固定翼" value="fixed_wing" />
          <el-option label="多旋翼" value="multi_rotor" />
          <el-option label="直升机" value="helicopter" />
          <el-option label="其他" value="other" />
        </el-select>
      </el-form-item>
      <el-form-item label="频率(MHz)">
        <el-input-number v-model="form.frequency" :min="27" :max="5800" :step="0.025" :precision="3" style="width: 100%" />
      </el-form-item>
      <el-form-item label="格位">
        <el-select v-model="form.hangarSlotId" clearable placeholder="选择格位" style="width: 100%">
          <el-option v-for="s in availableSlots" :key="s.id" :label="s.code" :value="s.id" />
        </el-select>
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
import { ElMessage, ElMessageBox } from 'element-plus'

const aircraft = ref([])
const availableSlots = ref([])
const showDialog = ref(false)
const form = reactive({ name: '', type: '', frequency: null, hangarSlotId: null })

onMounted(() => loadData())

async function loadData() {
  const [aRes, sRes] = await Promise.all([
    api.get('/hangar/my-aircraft'),
    api.get('/hangar/slots', { params: { status: 'available', limit: 100 } }),
  ])
  aircraft.value = aRes.data || []
  availableSlots.value = (sRes.data[0] || []).filter(s => s.status === 'available')
}

async function handleAdd() {
  await api.post('/hangar/aircraft', form)
  ElMessage.success('飞机登记成功')
  showDialog.value = false
  Object.assign(form, { name: '', type: '', frequency: null, hangarSlotId: null })
  loadData()
}

async function handleDelete(id) {
  await ElMessageBox.confirm('确认删除此飞机?', '删除')
  await api.delete(`/hangar/aircraft/${id}`)
  ElMessage.success('已删除')
  loadData()
}

function typeLabel(t) {
  const m = { fixed_wing: '固定翼', multi_rotor: '多旋翼', helicopter: '直升机', other: '其他' }
  return m[t] || t
}
</script>
