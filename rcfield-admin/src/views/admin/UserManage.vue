<template>
  <el-card header="用户管理">
    <el-form :inline="true" style="margin-bottom: 16px">
      <el-form-item label="角色">
        <el-select v-model="role" clearable placeholder="全部" style="width: 140px" @change="loadData">
          <el-option label="管理员" value="admin" />
          <el-option label="安全员" value="safety_officer" />
          <el-option label="会员" value="member" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="showDialog = true">新增用户</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="users" border stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : row.role === 'safety_officer' ? 'warning' : ''">
            {{ roleLabel(row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="130" />
      <el-table-column prop="email" label="邮箱" />
    </el-table>
  </el-card>

  <el-dialog v-model="showDialog" title="新增用户" width="500px">
    <el-form :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.role" style="width: 100%">
          <el-option label="管理员" value="admin" />
          <el-option label="安全员" value="safety_officer" />
          <el-option label="会员" value="member" />
        </el-select>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
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
import { ElMessage } from 'element-plus'

const users = ref([])
const role = ref('')
const showDialog = ref(false)
const form = reactive({ username: '', password: '', name: '', role: 'member', phone: '', email: '' })

onMounted(() => loadData())

async function loadData() {
  const params = {}
  if (role.value) params.role = role.value
  const res = await api.get('/admin/users', { params })
  users.value = res.data || []
}

async function handleAdd() {
  await api.post('/admin/users', form)
  ElMessage.success('用户创建成功')
  showDialog.value = false
  Object.assign(form, { username: '', password: '', name: '', role: 'member', phone: '', email: '' })
  loadData()
}

function roleLabel(r) {
  const m = { admin: '管理员', safety_officer: '安全员', member: '会员' }
  return m[r] || r
}
</script>
