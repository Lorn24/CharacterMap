<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({
  siname: String,
  avatar: String
})
const router = useRouter()
const goAvatar = (value) => {
  router.push({
    name: 'ark-avatar',
    params: {
      name: value
    }
  })
}
</script>

<template>
  <el-card>
    <el-image
      :src="`/Arknights/char_icon/${props.siname}.png`"
      alt=""
      fit="contain"
      class="first-img"
      @click="goAvatar(props.avatar)"
    ></el-image>
  </el-card>
</template>

<style>
.first-img {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  border: 2px solid #76677a;
}
</style>
