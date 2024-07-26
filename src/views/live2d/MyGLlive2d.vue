<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { GirlsfrontLineStore } from '@/stores/modules/GirlsfrontLine/GFLInfo'
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display/cubism4'

const OptionGet = GirlsfrontLineStore()
OptionGet.setDefaultList()
const glapp = new PIXI.Application({ resolution: 2, backgroundAlpha: 0 })
const glcontainer = ref()
const live2dList = ref(OptionGet.avatarList)
const renderName = ref('79type_1402')
const status = ref('normal')
let limodel

window.PIXI = PIXI

const loadModel = async (liname, listatus) => {
  if (limodel) {
    glapp.stage.removeChild(limodel)
    limodel.destroy() // 销毁之前的模型
  }

  limodel = await Live2DModel.from(
    `/live2d/GirlsFrontLine/${liname}/${listatus}/${listatus}.model3.json`
  )
  const scaleSize = Math.min(
    glcontainer.value.offsetWidth / limodel.width,
    glcontainer.value.offsetHeight / limodel.height
  )
  glapp.stage.addChild(limodel)
  limodel.scale.set(scaleSize * 1.2)

  // 交互
  limodel.on('click', () => {
    limodel.motion('')
  })
}

// //组件通信改变renderName
// const changeSiname = (name) => {
//   renderName.value = name
//   console.log(renderName.value)
// }

//监听renderName的改变，重新渲染live2d图像
watch([renderName, status], () => {
  loadModel(renderName.value, status.value)
})

onMounted(() => {
  glcontainer.value.appendChild(glapp.view)
  glapp.renderer.resize(
    glcontainer.value.offsetWidth,
    glcontainer.value.offsetHeight
  )
  loadModel(renderName.value, status.value)
})
onUnmounted(() => {
  limodel?.destroy()
  glapp?.destroy()
})
</script>

<template>
  <div id="lipixi" ref="glcontainer"></div>
  <el-radio-group v-model="status" class="select-status">
    <el-radio label="normal" size="large">normal</el-radio>
    <el-radio label="destroy" size="large">destroy</el-radio>
  </el-radio-group>
  <el-select
    v-model="renderName"
    class="select-avatar"
    placeholder="Select"
    size="large"
  >
    <el-option
      v-for="(item, index) in live2dList"
      :key="index"
      :label="item.name"
      :value="item.name"
    />
  </el-select>
</template>

<style>
#lipixi {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}
#lipixi canvas {
  transform-origin: 0 0;
  scale: 0.5;
}
.select-status {
  position: absolute;
  right: 45px;
}
.select-avatar {
  position: absolute;
  right: 20px;
  top: 50px;
}
</style>
