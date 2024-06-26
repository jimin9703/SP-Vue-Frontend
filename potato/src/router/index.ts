import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import TravelRoutes from '@/travel/router/TravelRoutes'
import TravelBoardRoutes from '@/travel_board/router/TravelBoardRoutes'
import HomeRoutes from '@/home/router/HomeRoutes'
import AuthenticationRoutes from '@/authentication/router/AuthenticationRoutes'
import AccountRoutes from '@/account/router/AccountRoutes'



const routes: Array<RouteRecordRaw> = [
  // 항상 도메인의 router를 추가했으면 main router 에도 추가 해줘야 함
  ...TravelRoutes,
  ...TravelBoardRoutes,
  ...HomeRoutes,
  ...AuthenticationRoutes,
  ...AccountRoutes,
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router