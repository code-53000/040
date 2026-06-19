<template>
  <el-card header="上报事故">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" style="max-width: 600px">
      <el-form-item label="关联飞行记录">
        <el-input-number v-model="form.flightRecordId" placeholder="飞行记录ID（可选）" style="width: 100%" />
      </el-form-item>
      <el-form-item label="事故类型" prop="type">
        <el-select v-model="form.type" placeholder="选择类型" style="width: 100%">
          <el-option label="频率冲突" value="frequency_conflict" />
          <el-option label="空域冲突" value="airspace_conflict" />
          <el-option label="跑道入侵" value="runway_incursion" />
          <el-option label="设备故障" value="equipment_failure" />
          <el-option label="其他" value="other" />
        </el-select>
      </el-form-item>
      <el-form-item label="严重程度" prop="severity">
        <el-select v-model="form.severity" placeholder="选择严重程度" style="width: 100%">
          <el-option label="轻微" value="minor" />
          <el-option label="严重" value="major" />
          <el-option label="危急" value="critical" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="4" placeholder="详细描述事故情况" />
      </el-form-item>
      <el-form-item>
        <el-button type="danger" :loading="loading" @click="handleSubmit">上报事故</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()
const loading = ref(false)
const form = reactive({ flightRecordId: null, type: '', severity: '', description: '' })
const rules = {
  type: [{ required: true, message: '请选择事故类型', trigger: 'change' }],
  severity: [{ required: true, message: '请选择严重程度', trigger: 'change' }],
  description: [{ required: true, message: '请描述事故情况', trigger: 'blur' }],
}

async function handleSubmit() {
  await formRef.value?.validate()
  loading.value = true
  try {
    await api.post('/incidents', form)
    ElMessage.success('事故上报成功')
    router.push('/incidents')
  } catch (e) {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>
