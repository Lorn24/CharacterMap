import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jsondata } from '@/api/GetInfo'
import { judgeStorage } from '@/utils/judge'

export const DestinyChildStore = defineStore(
  'DCInfo',
  () => {
    const avatarList = ref({})
    const setDefaultList = async () => {
      if (judgeStorage('DCInfo')) {
        const resList = await jsondata('destinychild-live2d')
        avatarList.value = resList
        console.log(avatarList.value)
      }
    }
    return {
      avatarList,
      setDefaultList
    }
  },
  {
    persist: true
  }
)
