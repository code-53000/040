<template>
  <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1a237e, #0277bd)">
    <el-card style="width: 420px; border-radius: 12px">
      <template #header>
        <div style="text-align: center">
          <h2 style="margin: 0; color: #303133">航模飞行场地管理系统</h2>
          <p style="margin: 8px 0 0; color: #909399; font-size: 14px">RC Field Management System</p>
        </div>
      </template>
      <el-form :model="form" :rules="rules" ref="formRef" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock" size="large" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" size="large" :loading="loading" native-type="submit">登 录</el-button>
        </el-form-item>
      </el-form>
      <div style="text-align: center; color: #909399; font-size: 12px">
        默认账号: admin/admin123 | safety1/safety123 | member1/member123
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)

const form = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  await formRef.value?.validate()
  loading.value = true
  try {
    await userStore.login(form.username, form.password)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (e) {
    // error handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>
