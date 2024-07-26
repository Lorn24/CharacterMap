<script setup>
import { computed } from 'vue'

const props = defineProps({
  avatarName: String,
  skinList: {}
})
const emits = defineEmits(['update'])
const name = computed({
  get: () => props.avatarName,
  set: (value) => emits('update', value)
})
// console.log('name:', name)
</script>

<template>
  <el-select v-model="name" size="large" class="avator-select">
    <el-option
      v-for="(item, index) in props.skinList.skin"
      :key="index"
      :label="item"
      :value="item"
    />
  </el-select>
</template>

<style>
.avator-select {
  width: 16em;
  box-shadow: var(--el-box-shadow-light);
}
</style>
