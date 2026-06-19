<template>
  <el-container style="height: 100vh">
    <el-aside width="220px" style="background: #304156">
      <div style="padding: 20px; text-align: center; color: #fff; font-size: 16px; font-weight: bold">
        航模场地管理
      </div>
      <el-menu
        :default-active="route.path"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>控制台</span>
        </el-menu-item>
        <el-sub-menu index="flight">
          <template #title>
            <el-icon><Position /></el-icon>
            <span>飞行预约</span>
          </template>
          <el-menu-item index="/flight-bookings">预约列表</el-menu-item>
          <el-menu-item index="/flight-bookings/new">新建预约</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="hangar">
          <template #title>
            <el-icon><Box /></el-icon>
            <span>机库管理</span>
          </template>
          <el-menu-item index="/hangar/slots">格位总览</el-menu-item>
          <el-menu-item index="/hangar/aircraft">我的飞机</el-menu-item>
          <el-menu-item index="/hangar/batteries">我的电池</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="safety">
          <template #title>
            <el-icon><Warning /></el-icon>
            <span>安全记录</span>
          </template>
          <el-menu-item index="/flight-records">飞行记录</el-menu-item>
          <el-menu-item index="/incidents">事故记录</el-menu-item>
          <el-menu-item index="/incidents/report">上报事故</el-menu-item>
        </el-sub-menu>
        <el-sub-menu v-if="userStore.isAdmin" index="admin">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/admin/runways">跑道管理</el-menu-item>
          <el-menu-item index="/admin/hangar-slots">格位管理</el-menu-item>
          <el-menu-item index="/admin/frequency">频率分配</el-menu-item>
          <el-menu-item index="/admin/users">用户管理</el-menu-item>
          <el-menu-item index="/admin/stats">使用统计</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="background: #fff; border-bottom: 1px solid #e6e6e6; display: flex; align-items: center; justify-content: space-between">
        <span style="font-size: 18px; font-weight: 500">{{ route.meta.title || '航模飞行场地管理系统' }}</span>
        <div style="display: flex; align-items: center; gap: 12px">
          <el-tag :type="roleTagType">{{ roleLabel }}</el-tag>
          <span>{{ userStore.user?.name }}</span>
          <el-button type="danger" text @click="handleLogout">退出</el-button>
        </div>
      </el-header>
      <el-main style="background: #f0f2f5">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const roleLabel = computed(() => {
  const map = { admin: '管理员', safety_officer: '安全员', member: '会员' }
  return map[userStore.userRole] || userStore.userRole
})

const roleTagType = computed(() => {
  const map = { admin: 'danger', safety_officer: 'warning', member: '' }
  return map[userStore.userRole] || ''
})

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>
