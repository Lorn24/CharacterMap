<script setup>
import selector from './selector.vue'
import { useRoute } from 'vue-router'
import {
  Application,
  Sprite,
  Container,
  Rectangle,
  Texture,
  Loader
} from 'pixi.js'
import { AzurLaneStore } from '@/stores/modules/AzurLane/ALInfo'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { paintingJson, paintingObj } from '@/api/getInfo'
import { Spine } from 'pixi-spine'

const OptionGet = AzurLaneStore()
const route = useRoute()
const pName = ref(route.params.painting)
const skinInf = ref(OptionGet.skinList[pName.value])
const pJson = ref()
const pObj = ref()
const loading = ref(true)
const app = new Application({ resolution: 2 })
const paintingContainer = new Container()
const spineContainer = new Container()
const container = ref()
let paintingFace
let back
let spineBase
let spineChar
;(async () => {
  let rarity = OptionGet.shipList[pName.value]['rarity']
  app.loader
    .add(`/AzurLane/shipbackground/${rarity}.png`, (res) => {
      back = new Sprite(res.texture)
      back.anchor.set(0.5)
      back.scale.set(
        Math.max(app.screen.width / back.width, app.screen.height / back.height)
      )
      back.position.set(app.screen.width / 2, app.screen.height / 2)
      app.stage.addChild(back)
    })
    .add(
      `/AzurLane/spinebase/&{rarity > 6 ? rarity - 2 : rarity}.png`,
      (res) => {
        spineBase = new Sprite(res.texture)
        spineBase.position.set(spineContainer.width / 2, spineContainer.height)
        spineContainer.addChild(spineBase)
        spineContainer.position.set(130, app.screen.height - 100)
      }
    )
    .load(() => handleChange(pName.value))
})()

const composeSprite = (texture, pobj) => {
  const layer = new Container()
  const count = pobj.vtList.length
  for (let i = 1; i <= count; i += 4) {
    let v0 = [pobj.vList[i].x, pobj.vList[i].y]
    let v1 = [pobj.vList[i + 2].x, pobj.vList[i + 2].y]
    let vt0 = [
      Math.round(pobj.vtList[i].u * texture.width),
      Math.round(pobj.vtList[i].v * texture.height)
    ]
    let vt1 = [
      Math.round(pobj.vtList[i + 2].u * texture.width),
      Math.round(pobj.vtList[i + 2].v * texture.height)
    ]
    let rectangle = new Rectangle(
      vt0[0],
      texture.height - vt1[1],
      vt1[0] - vt0[0],
      vt1[1] - vt0[1]
    )
    let sprite = new Sprite(new Texture(texture.baseTexture, rectangle))
    sprite.scale.set(1, -1)
    sprite.position.set(-v0[0], v1[1])
    layer.addChild(sprite)
  }
  return layer
}

const loadPainting = async (pname, jsondata) => {
  const loader = new Loader()
  const painting = new Container()
  const baseSize = jsondata[pname]['size']
  const baseScale = (app.screen.height / jsondata[pname]['view'][1]) * 0.8
  for (let file of Object.keys(jsondata)) {
    let size = jsondata[file]['size']
    let rawSize = jsondata[file]['rawSize']
    let pivot = jsondata[file]['pivot']
    let position = jsondata[file]['position']
    let layer
    if (file === 'face') {
      paintingFace = new Container()
      paintingFace.scale.set(size[0] / rawSize[0], size[1] / rawSize[1])
      paintingFace.position.set(
        baseSize[0] / 2 - size[0] * pivot[0] + position[0],
        baseSize[1] / 2 - size[1] * pivot[1] + position[1]
      )
      painting.addChild(paintingFace)
      await changeFace(jsondata[file]['list'][0])
      continue
    }
    const png = await new Promise((resolve) => {
      loader
        .reset()
        .add(`/AzurLane/painting/${pname}/${file}.png`, (res) => resolve(res))
        .load()
    })
    if (jsondata[file]['raw'] === true) {
      layer = new Container()
      let sprite = new Sprite(png.texture)
      sprite.position.set(0, sprite.height)
      sprite.scale.set(1, -1)
      layer.addChild(sprite)
    } else {
      pObj.value = await paintingObj(pName.value, file + '-mesh')
      layer = composeSprite(png.texture, pObj.value)
    }
    // console.log(size, rawSize)
    layer.scale.set(size[0] / rawSize[0], size[1] / rawSize[1])
    if (file !== pname) {
      layer.position.set(
        baseSize[0] / 2 - size[0] * pivot[0] + position[0],
        baseSize[1] / 2 - size[1] * pivot[1] + position[1]
      )
    }
    painting.addChild(layer)
  }
  loader.destroy()
  painting.pivot.set(
    baseSize[0] / 2 + jsondata[pname]['position'][0],
    baseSize[1] / 2 + jsondata[pname]['position'][1]
  )
  painting.scale.set(baseScale, -baseScale)
  painting.position.set(0, 0)
  return painting
}

const changeFace = async (index) => {
  const loader = new Loader()
  const png = await new Promise((resolve) => {
    loader
      .reset()
      .add(`/AzurLane/paintingface/${pName.value}/${index}.png`, (res) =>
        resolve(res)
      )
      .load()
  })
  loader.destroy()
  let sprite = new Sprite(png.texture)
  sprite.position.set(0, sprite.height)
  sprite.scale.set(1, -1)
  paintingFace.removeChildren()
  paintingFace.addChild(sprite)
}

const handleChange = async (pname) => {
  loading.value = true
  app.loader.reset()
  pJson.value = await paintingJson(pName.value, pName.value)
  paintingContainer.removeChildren()
  paintingContainer.addChild(await loadPainting(pname, pJson.value))
  paintingContainer.pivot.set(0)
  paintingContainer.scale.set(1)
  paintingContainer.position.set(app.screen.width / 2, app.screen.height / 2)
  app.stage.addChild(paintingContainer)
  app.stage.addChild(spineContainer)
  loading.value = false

  app.loader
    .add(`/AzurLane/spine/${pName.value}/${pName.value}.skel`, (res) => {
      console.log(res)
      spineChar?.destroy()
      spineChar = new Spine(res.spineData)
      console.log(spineChar)
      spineChar.scale.set(0.5)
      spineChar.position.set(
        spineContainer.width / 2,
        spineContainer.height - 25
      )
      spineContainer.addChild(spineChar)
      spineChar.state.setAnimation(0, 'stand', true)
    })
    .load()
}

watch(pName, () => {
  handleChange(pName.value)
})

onMounted(() => {
  container.value.appendChild(app.view)
  app.renderer.resize(container.value.offsetWidth, container.value.offsetHeight)

  container.value.onwheel = (e) => {
    paintingContainer.pivot.x +=
      (e.offsetX / 2 - paintingContainer.position.x) / paintingContainer.scale.x
    paintingContainer.pivot.y +=
      (e.offsetY / 2 - paintingContainer.position.y) / paintingContainer.scale.y
    paintingContainer.position.set(e.offsetX / 2, e.offsetY / 2)
    paintingContainer.scale.set(
      Math.min(Math.max(paintingContainer.scale.x + e.deltaY * -0.005, 0.25), 4)
    )
  }

  paintingContainer.interactive = true
  paintingContainer.on('pointerdown', (e) => {
    let { x, y } = e.data.global
    paintingContainer
      .on('pointermove', (e) => {
        paintingContainer.position.x += e.data.global.x - x
        paintingContainer.position.y += e.data.global.y - y
        ;(x = e.data.global.x), (y = e.data.global.y)
      })
      .on('pointerup', () => {
        paintingContainer.off('pointermove')
      })
  })
})

onUnmounted(() => {
  app.destroy(true, true)
})
</script>

<template>
  <div id="pixi" ref="container" v-loading="loading"></div>
  <selector
    :avatorName="pName"
    :skinList="skinInf"
    v-model="pName"
    class="a-selector"
  ></selector>
</template>

<style>
#pixi {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}
#pixi canvas {
  transform-origin: 0 0;
  scale: 0.5;
}
.a-selector {
  margin: 8px 5px;
}
</style>
