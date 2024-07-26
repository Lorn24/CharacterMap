<script setup>
// import selector from './selector.vue'
import { useRoute } from 'vue-router'
import { Application, Sprite, Container, Texture, Loader } from 'pixi.js'
import { ArknightsStore } from '@/stores/modules/Arknights/ArkInfo'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { Spine } from 'pixi-spine'
import ArkSelector from './ArkSelector.vue'

const OptionGet = ArknightsStore()
const route = useRoute()
const Name = ref(route.params.name)
const skinInf = ref(OptionGet.avatarList[Name.value])
const arkName = ref(skinInf.value.skin[0])
// console.log(skinInf.value)
const arkloading = ref(true)
const arkapp = new Application({ resolution: 2, backgroundAlpha: 0 })
const arkpcontainer = new Container()
const spineContainer = new Container()
const arkcontainer = ref()
let arkback
let spineChar
;(async () => {
  arkapp.loader
    .add(`/background/background02.png`, (res) => {
      arkback = new Sprite(res.texture)
      arkback.anchor.set(0.5)
      arkback.scale.set(
        Math.max(
          arkapp.screen.width / arkback.width,
          arkapp.screen.height / arkback.height
        )
      )
      arkback.position.set(arkapp.screen.width / 2, arkapp.screen.height / 2)
      arkapp.stage.addChild(arkback)
    })
    .load(() => handleChange(arkName.value))
})()

const composeArkSprite = (texture) => {
  const layer = new Container()
  let sprite = new Sprite(new Texture(texture.baseTexture))
  let scale = arkcontainer.value.offsetHeight / texture.height
  sprite.scale.set(scale * 1.4)
  // sprite.position.set(-v0[0], v1[1])
  layer.addChild(sprite)
  return layer
}

// #号可能会被浏览器忽略
const loadArkPainting = async (pname) => {
  const loader = new Loader()
  const painting = new Container()
  const changeUrl = `/Arknights/chararts/${skinInf.value.name}/char_${skinInf.value.code}_${pname}.png`

  console.log(changeUrl)
  const png = await new Promise((resolve) => {
    loader
      .reset()
      .add(changeUrl, (res) => resolve(res))
      .load()
  })
  let layer = composeArkSprite(png.texture)
  painting.addChild(layer)
  // painting.scale.set(baseScale, -baseScale)
  loader.destroy()
  painting.position.set(
    -arkcontainer.value.offsetWidth / 5,
    -arkcontainer.value.offsetHeight / 1.8
  )
  return painting
}

const handleChange = async (pname) => {
  arkloading.value = true
  arkapp.loader.reset()
  arkpcontainer.removeChildren()
  arkpcontainer.addChild(await loadArkPainting(pname))
  // arkpcontainer.pivot.set(0)
  // arkpcontainer.scale.set(1)
  arkpcontainer.position.set(arkapp.screen.width / 2, arkapp.screen.height / 2)
  arkapp.stage.addChild(arkpcontainer)
  arkapp.stage.addChild(spineContainer)
  arkloading.value = false

  // pSkel.value = await spineSkel(arkName.value, arkName.value)
  // console.log(pSkel.value)
  // 使用encodeURIComponent()函数来进行URL编码
  arkapp.loader
    .add(
      `/Arknights/chararts/${skinInf.value.name}/BattleFront/char_${skinInf.value.code}_${pname}/char_${skinInf.value.code}_${pname}.skel`,
      (res) => {
        console.log(res)
        spineChar?.destroy()
        spineChar = new Spine(res.spineData)
        console.log(spineChar)
        spineChar.scale.set(0.5)
        console.log(spineContainer.width, spineContainer.height)
        spineChar.position.set(
          arkcontainer.value.offsetWidth / 7,
          arkcontainer.value.offsetHeight - 50
        )
        spineContainer.addChild(spineChar)
        spineChar.state.setAnimation(0, 'stand', true)
      }
    )
    .load()
}

watch(arkName, () => {
  handleChange(arkName.value)
})

onMounted(() => {
  arkcontainer.value.appendChild(arkapp.view)
  arkapp.renderer.resize(
    arkcontainer.value.offsetWidth,
    arkcontainer.value.offsetHeight
  )

  arkcontainer.value.onwheel = (e) => {
    arkpcontainer.pivot.x +=
      (e.offsetX / 2 - arkpcontainer.position.x) / arkpcontainer.scale.x
    arkpcontainer.pivot.y +=
      (e.offsetY / 2 - arkpcontainer.position.y) / arkpcontainer.scale.y
    arkpcontainer.position.set(e.offsetX / 2, e.offsetY / 2)
    arkpcontainer.scale.set(
      Math.min(Math.max(arkpcontainer.scale.x + e.deltaY * -0.005, 0.25), 4)
    )
  }

  arkpcontainer.interactive = true
  arkpcontainer.on('pointerdown', (e) => {
    let { x, y } = e.data.global
    arkpcontainer
      .on('pointermove', (e) => {
        arkpcontainer.position.x += e.data.global.x - x
        arkpcontainer.position.y += e.data.global.y - y
        ;(x = e.data.global.x), (y = e.data.global.y)
      })
      .on('pointerup', () => {
        arkpcontainer.off('pointermove')
      })
  })
})

onUnmounted(() => {
  arkapp.destroy(true, true)
})
</script>

<template>
  <div id="pixi" ref="arkcontainer" v-loading="loading"></div>
  <ArkSelector
    :avatorName="arkName"
    :skinList="skinInf"
    v-model="arkName"
    class="a-selector"
  ></ArkSelector>
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
