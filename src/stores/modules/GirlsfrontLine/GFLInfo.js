import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jsondata } from '@/api/GetInfo'
import { judgeStorage } from '@/utils/judge'

export const GirlsfrontLineStore = defineStore(
  'GFLInfo',
  () => {
    const avatarList = ref({})
    const setDefaultList = async () => {
      if (judgeStorage('GFLInfo')) {
        const resList = await jsondata('girlsfrontline-live2d')
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
