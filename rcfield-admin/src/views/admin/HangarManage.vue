<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>格位管理</span>
        <el-button type="primary" @click="showDialog = true">新增格位</el-button>
      </div>
    </template>
    <el-table :data="slots" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="code" label="编码" width="100" />
      <el-table-column prop="row" label="行" width="60" />
      <el-table-column prop="column" label="列" width="60" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'available' ? 'success' : row.status === 'occupied' ? 'danger' : 'warning'">
            {{ statusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="占用会员" width="120">
        <template #default="{ row }">{{ row.member?.name || '-' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button size="small" @click="openEditDialog(row)">编辑</el-button>
          <el-button v-if="row.status === 'maintenance'" type="success" size="small" @click="setSlotStatus(row.id, 'available')">启用</el-button>
          <el-button v-if="row.status === 'available'" type="warning" size="small" @click="setSlotStatus(row.id, 'maintenance')">维护</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="showDialog" :title="editingId ? '编辑格位' : '新增格位'" width="500px">
    <el-form :model="form" label-width="80px">
      <el-form-item label="编码">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="行">
        <el-input-number v-model="form.row" :min="1" style="width: 100%" />
      </el-form-item>
      <el-form-item label="列">
        <el-input-number v-model="form.column" :min="1" style="width: 100%" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" style="width: 100%">
          <el-option label="空闲" value="available" />
          <el-option label="维护中" value="maintenance" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const slots = ref([])
const showDialog = ref(false)
const editingId = ref(null)
const form = reactive({ code: '', row: 1, column: 1, status: 'available' })

onMounted(() => loadData())

async function loadData() {
  const res = await api.get('/hangar/slots', { params: { limit: 200 } })
  slots.value = res.data[0] || []
}

function openEditDialog(row) {
  editingId.value = row.id
  Object.assign(form, { code: row.code, row: row.row, column: row.column, status: row.status })
  showDialog.value = true
}

async function handleSave() {
  if (editingId.value) {
    await api.put(`/admin/hangar-slots/${editingId.value}`, form)
  } else {
    await api.post('/admin/hangar-slots', form)
  }
  ElMessage.success('保存成功')
  showDialog.value = false
  editingId.value = null
  Object.assign(form, { code: '', row: 1, column: 1, status: 'available' })
  loadData()
}

async function setSlotStatus(id, status) {
  await api.put(`/admin/hangar-slots/${id}`, { status })
  ElMessage.success('状态已更新')
  loadData()
}

async function handleDelete(id) {
  await ElMessageBox.confirm('确认删除此格位?', '删除')
  await api.delete(`/admin/hangar-slots/${id}`)
  ElMessage.success('已删除')
  loadData()
}

function statusLabel(s) {
  const m = { available: '空闲', occupied: '占用', maintenance: '维护' }
  return m[s] || s
}
</script>
