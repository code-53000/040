import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    component: () => import('../components/AppLayout.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'flight-bookings', name: 'BookingList', component: () => import('../views/flight/BookingList.vue') },
      { path: 'flight-bookings/new', name: 'BookingNew', component: () => import('../views/flight/BookingForm.vue') },
      { path: 'hangar/slots', name: 'HangarSlots', component: () => import('../views/hangar/HangarSlots.vue') },
      { path: 'hangar/aircraft', name: 'MyAircraft', component: () => import('../views/hangar/MyAircraft.vue') },
      { path: 'hangar/batteries', name: 'MyBatteries', component: () => import('../views/hangar/MyBatteries.vue') },
      { path: 'incidents', name: 'IncidentList', component: () => import('../views/incident/IncidentList.vue') },
      { path: 'incidents/report', name: 'IncidentReport', component: () => import('../views/incident/IncidentReport.vue') },
      { path: 'flight-records', name: 'FlightRecords', component: () => import('../views/incident/FlightRecords.vue') },
      { path: 'admin/runways', name: 'RunwayManage', component: () => import('../views/admin/RunwayManage.vue'), meta: { roles: ['admin'] } },
      { path: 'admin/hangar-slots', name: 'HangarManage', component: () => import('../views/admin/HangarManage.vue'), meta: { roles: ['admin'] } },
      { path: 'admin/frequency', name: 'FrequencyAlloc', component: () => import('../views/admin/FrequencyAlloc.vue'), meta: { roles: ['admin'] } },
      { path: 'admin/users', name: 'UserManage', component: () => import('../views/admin/UserManage.vue'), meta: { roles: ['admin'] } },
      { path: 'admin/stats', name: 'Stats', component: () => import('../views/admin/Stats.vue'), meta: { roles: ['admin', 'safety_officer'] } },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/dashboard')
  } else {
    const roles = to.meta?.roles
    if (roles) {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      if (!user || !roles.includes(user.role)) {
        next('/dashboard')
        return
      }
    }
    next()
  }
})

export default router
