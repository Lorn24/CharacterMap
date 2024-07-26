<script setup>
import { ArknightsStore } from '@/stores/modules/Arknights/ArkInfo'
import ArkIcon from '@/components/ArkIcon.vue'
import * as THREE from 'three'
//导入轨道控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
//导入hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import { onMounted, ref } from 'vue'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 0, 10)
scene.add(camera)
//渲染器
const renderer = new THREE.WebGLRenderer({
  //设置抗锯齿
  antialias: true
})
//添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
//设置带阻尼的惯性
controls.enableDamping = true
renderer.setSize(window.innerWidth, window.innerHeight)
//加载hdr贴图
const rgbeLoader = new RGBELoader()
rgbeLoader.load(
  './three/udim/industrial_pipe_and_valve_01_2k.hdr',
  (envMap) => {
    //设置球形映射
    envMap.mapping = THREE.EquirectangularReflectionMapping
    //设置背景贴图
    scene.background = envMap
    //设置环境贴图
    scene.environment = envMap
  }
)
// 监听窗口变化
window.addEventListener('resize', () => {
  //重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  //重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  //更新相机投影矩阵
  camera.updateProjectionMatrix()
})
// 定义渲染函数
const animate = () => {
  controls.update()
  requestAnimationFrame(animate)
  // //旋转
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()

const arkCatalogue = ref()
const avatarList = ref()

const OptionGet = ArknightsStore()
OptionGet.setDefaultList()
avatarList.value = OptionGet.avatarList
console.log(avatarList.value)

onMounted(() => {
  //将webgl渲染的canvas内容添加到
  arkCatalogue.value.appendChild(renderer.domElement)
})
</script>
<template>
  <div ref="arkCatalogue" class="ark-catalogue">
    <el-container class="ark-container">
      <el-header>
        <el-button
          type="primary"
          style="margin-left: 16px"
          @click="drawer = true"
          class="select-button"
        >
          筛选
        </el-button>
      </el-header>
      <el-main>
        <ul class="infinite-list" style="overflow: auto">
          <el-scrollbar>
            <li
              v-for="(item, index) in avatarList"
              :key="index"
              class="infinite-list-item"
            >
              <ArkIcon :siname="item.name" :avatar="item.avatar"></ArkIcon>
            </li>
          </el-scrollbar>
        </ul>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.ark-catalogue canvas {
  position: relative;
  top: 0;
  left: 0;
  z-index: -1;
}
.ark-container {
  position: absolute;
}
.select-button {
  margin-top: 20px;
  width: 80px;
  height: 40px;
  font-size: 20px;
}
.infinite-list {
  width: 90vw;
  height: 80vh;
  margin: 0 auto;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
.infinite-list .infinite-list-item {
  margin: 10px;
  width: 140px;
  height: 140px;
  display: inline-block;
  position: relative;
}
</style>
