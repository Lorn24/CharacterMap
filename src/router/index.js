import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/catalogue',
      name: 'alcatalogue',
      meta: {
        scrollPosition: true,
        keepAlive: true // 启用路由组件缓存
      },
      component: () => import('@/views/catalogue/MyCatalogue.vue')
    },
    {
      path: '/home',
      component: () => import('@/views/home/MyHome.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/MyTest.vue')
    },
    {
      path: '/catalogue/:painting',
      name: 'avatar',
      meta: {
        keepAlive: false
      },
      component: () => import('@/views/avatar/MyAvatar.vue')
    },
    {
      path: '/alLive2d',
      name: 'allive2d',
      component: () => import('@/views/live2d/MyALlive2d.vue')
    },
    {
      path: '/glLive2d',
      name: 'gllive2d',
      component: () => import('@/views/live2d/MyGLlive2d.vue')
    },
    {
      path: '/dcLive2d',
      name: 'dclive2d',
      component: () => import('@/views/live2d/MyDClive2d.vue')
    },
    {
      path: '/Arknights',
      name: 'arknights',
      component: () => import('@/views/Arknights/ArkCatalogue.vue')
    },
    {
      path: '/Arknights/:name',
      name: 'ark-avatar',
      component: () => import('@/views/Arknights/ArkAvatar.vue')
    },
    {
      path: '/three-background',
      name: 'three-background',
      component: () => import('@/views/three/ThreeBackground.vue')
    }
  ]
  // //保持上一个路由的滚动位置
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     return { top: 0 }
  //   }
  // }
})

export default router
