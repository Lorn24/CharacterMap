import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jsondata } from '@/api/GetInfo'
import { judgeStorage } from '@/utils/judge'

export const ArknightsStore = defineStore(
  'ArkInfo',
  () => {
    const avatarList = ref({})
    const setDefaultList = async () => {
      if (judgeStorage('ArkInfo')) {
        const resList = await jsondata('arknights-config')
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
