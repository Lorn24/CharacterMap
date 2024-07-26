<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { DestinyChildStore } from '@/stores/modules/DestinyChild/DCInfo'
import MyDCicon from '@/components/MyDcicon.vue'
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display/cubism2'

const OptionGet = DestinyChildStore()
OptionGet.setDefaultList()
const dcapp = new PIXI.Application({ resolution: 2, backgroundAlpha: 0 })
const dccontainer = ref()
const live2dList = ref(OptionGet.avatarList)
const renderName = ref('c000_01')
let dcmodel

window.PIXI = PIXI

const loadModel = async (liname) => {
  if (dcmodel) {
    dcapp.stage.removeChild(dcmodel)
    dcmodel.destroy() // 销毁之前的模型
  }

  dcmodel = await Live2DModel.from(`/live2d/DestinyChild/${liname}/model.json`)
  const scaleSize = Math.min(
    dccontainer.value.offsetWidth / dcmodel.width,
    dccontainer.value.offsetHeight / dcmodel.height
  )
  dcapp.stage.addChild(dcmodel)
  dcmodel.scale.set(scaleSize)

  // 交互
  dcmodel.on('click', () => {
    dcmodel.expression()
  })
}

//组件通信改变renderName
const changeSiname = (name) => {
  renderName.value = name
  console.log(renderName.value)
}

//监听renderName的改变，重新渲染live2d图像
watch(renderName, () => {
  loadModel(renderName.value)
})

onMounted(() => {
  dccontainer.value.appendChild(dcapp.view)
  dcapp.renderer.resize(
    dccontainer.value.offsetWidth,
    dccontainer.value.offsetHeight
  )
  loadModel(renderName.value)
})
onUnmounted(() => {
  dcmodel?.destroy()
  dcapp?.destroy()
})
</script>

<template>
  <div id="dcpixi" ref="dccontainer"></div>
  <div id="testli">
    <ul class="infinite-list" style="overflow: auto">
      <el-scrollbar>
        <li
          v-for="(item, index) in live2dList"
          :key="index"
          class="infinite-list-item"
        >
          <MyDCicon
            :siname="item.name"
            @change-siname="changeSiname"
          ></MyDCicon>
        </li>
      </el-scrollbar>
    </ul>
  </div>
</template>

<style>
#dcpixi {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}
#dcpixi canvas {
  transform-origin: 0 0;
  scale: 0.5;
}
#testli {
  position: absolute;
  right: 0;
  width: auto;
  height: 100vh;
}
#testli .infinite-list {
  width: 30vw;
  height: 100vh;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
#testli .infinite-list .infinite-list-item {
  margin: 10px;
  width: 116px;
  height: 116px;
  display: inline-block;
  position: relative;
}
</style>
