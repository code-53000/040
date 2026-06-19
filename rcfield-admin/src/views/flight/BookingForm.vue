<template>
  <el-card header="新建飞行预约">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" style="max-width: 600px">
      <el-form-item label="跑道" prop="runwayId">
        <el-select v-model="form.runwayId" placeholder="选择跑道" style="width: 100%">
          <el-option v-for="r in runways" :key="r.id" :label="r.name + ' (' + r.code + ')'" :value="r.id" :disabled="r.status !== 'active'" />
        </el-select>
      </el-form-item>
      <el-form-item label="飞机" prop="aircraftId">
        <el-select v-model="form.aircraftId" placeholder="选择飞机" style="width: 100%">
          <el-option v-for="a in aircraft" :key="a.id" :label="a.name + ' (' + a.type + ')'" :value="a.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="date">
        <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" style="width: 100%" :disabled-date="d => d < new Date()" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-time-select v-model="form.startTime" :max-time="form.endTime" start="06:00" step="00:30" end="20:00" placeholder="开始时间" style="width: 100%" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-time-select v-model="form.endTime" :min-time="form.startTime" start="06:00" step="00:30" end="20:00" placeholder="结束时间" style="width: 100%" />
      </el-form-item>
      <el-form-item label="频率(MHz)" prop="frequency">
        <el-input-number v-model="form.frequency" :min="27" :max="5800" :step="0.025" :precision="3" placeholder="遥控频率" style="width: 100%" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleSubmit">提交预约</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()
const loading = ref(false)
const runways = ref([])
const aircraft = ref([])

const form = reactive({
  runwayId: null,
  aircraftId: null,
  date: '',
  startTime: '',
  endTime: '',
  frequency: null,
})

const rules = {
  runwayId: [{ required: true, message: '请选择跑道', trigger: 'change' }],
  aircraftId: [{ required: true, message: '请选择飞机', trigger: 'change' }],
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
}

onMounted(async () => {
  const [runwaysRes, aircraftRes] = await Promise.all([
    api.get('/admin/runways'),
    api.get('/hangar/my-aircraft'),
  ])
  runways.value = runwaysRes.data || []
  aircraft.value = aircraftRes.data || []
})

async function handleSubmit() {
  await formRef.value?.validate()
  loading.value = true
  try {
    await api.post('/flight-bookings', form)
    ElMessage.success('预约提交成功，等待审核')
    router.push('/flight-bookings')
  } catch (e) {
    // handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>
