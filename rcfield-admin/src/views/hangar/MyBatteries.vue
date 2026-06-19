<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>我的电池</span>
        <el-button type="primary" @click="showDialog = true">登记新电池</el-button>
      </div>
    </template>
    <el-table :data="batteries" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" width="150" />
      <el-table-column prop="capacity" label="容量(mAh)" width="120" />
      <el-table-column prop="cellCount" label="S数" width="80" />
      <el-table-column prop="chargeCycles" label="充电次数" width="100" />
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

  <el-dialog v-model="showDialog" title="登记新电池" width="500px">
    <el-form :model="form" label-width="100px">
      <el-form-item label="名称">
        <el-input v-model="form.name" placeholder="电池名称" />
      </el-form-item>
      <el-form-item label="容量(mAh)">
        <el-input-number v-model="form.capacity" :min="100" :step="100" style="width: 100%" />
      </el-form-item>
      <el-form-item label="S数">
        <el-select v-model="form.cellCount" placeholder="选择S数" style="width: 100%">
          <el-option :label="n + 'S'" :value="n" v-for="n in [2,3,4,5,6]" :key="n" />
        </el-select>
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

const batteries = ref([])
const availableSlots = ref([])
const showDialog = ref(false)
const form = reactive({ name: '', capacity: null, cellCount: null, hangarSlotId: null })

onMounted(() => loadData())

async function loadData() {
  const [bRes, sRes] = await Promise.all([
    api.get('/hangar/my-batteries'),
    api.get('/hangar/slots', { params: { status: 'available', limit: 100 } }),
  ])
  batteries.value = bRes.data || []
  availableSlots.value = (sRes.data[0] || []).filter(s => s.status === 'available')
}

async function handleAdd() {
  await api.post('/hangar/battery', form)
  ElMessage.success('电池登记成功')
  showDialog.value = false
  Object.assign(form, { name: '', capacity: null, cellCount: null, hangarSlotId: null })
  loadData()
}

async function handleDelete(id) {
  await ElMessageBox.confirm('确认删除此电池?', '删除')
  await api.delete(`/hangar/battery/${id}`)
  ElMessage.success('已删除')
  loadData()
}
</script>
