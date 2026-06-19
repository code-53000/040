<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>跑道管理</span>
        <el-button type="primary" @click="openDialog()">新增跑道</el-button>
      </div>
    </template>
    <el-table :data="runways" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" width="150" />
      <el-table-column prop="code" label="编码" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : row.status === 'maintenance' ? 'warning' : 'danger'">
            {{ statusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="length" label="长度(m)" width="100" />
      <el-table-column prop="width" label="宽度(m)" width="100" />
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="showDialog" :title="editingId ? '编辑跑道' : '新增跑道'" width="500px">
    <el-form :model="form" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" style="width: 100%">
          <el-option label="活跃" value="active" />
          <el-option label="维护中" value="maintenance" />
          <el-option label="关闭" value="closed" />
        </el-select>
      </el-form-item>
      <el-form-item label="长度(m)">
        <el-input-number v-model="form.length" style="width: 100%" />
      </el-form-item>
      <el-form-item label="宽度(m)">
        <el-input-number v-model="form.width" style="width: 100%" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" :rows="2" />
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

const runways = ref([])
const showDialog = ref(false)
const editingId = ref(null)
const form = reactive({ name: '', code: '', status: 'active', length: null, width: null, description: '' })

onMounted(() => loadData())

async function loadData() {
  const res = await api.get('/admin/runways')
  runways.value = res.data || []
}

function openDialog(row) {
  if (row) {
    editingId.value = row.id
    Object.assign(form, { name: row.name, code: row.code, status: row.status, length: row.length, width: row.width, description: row.description })
  } else {
    editingId.value = null
    Object.assign(form, { name: '', code: '', status: 'active', length: null, width: null, description: '' })
  }
  showDialog.value = true
}

async function handleSave() {
  if (editingId.value) {
    await api.put(`/admin/runways/${editingId.value}`, form)
  } else {
    await api.post('/admin/runways', form)
  }
  ElMessage.success('保存成功')
  showDialog.value = false
  loadData()
}

async function handleDelete(id) {
  await ElMessageBox.confirm('确认删除此跑道?', '删除')
  await api.delete(`/admin/runways/${id}`)
  ElMessage.success('已删除')
  loadData()
}

function statusLabel(s) {
  const m = { active: '活跃', maintenance: '维护中', closed: '关闭' }
  return m[s] || s
}
</script>
