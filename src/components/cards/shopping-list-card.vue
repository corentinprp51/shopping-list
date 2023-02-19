<template>
  <div class="w-full px-[15px] flex items-center justify-between">
    <div class="flex items-center">
      <div class="img rounded-full w-[40px] h-[40px]" :class="listUrl ? '' : 'bg-gray-300'">
        <img
          v-if="listUrl"
          :src="listUrl"
          class="w-[40px] h-[40px]"
          alt=""
        >
      </div>
      <div class="ml-[15px] flex flex-col justify-center">
        <span class="text-[14px] font-[400]">{{ shoppingList.title }}</span>
        <span class="text-[12px] font-[300] text-[#ADAFBC]">{{ shoppingList.products ? (shoppingList.products.length === 1 ? '1 produit' : `${shoppingList.products.length} produits`) : 'Vide' }}</span>
      </div>
    </div>
    <div class="flex items-center justify-end">
      <div class="flex mr-[25px]">
        <div v-for="(user, index) in shoppingList.users" :key="user.uid" class="rounded-full w-[20px] h-[20px] bg-gray-300">
          <img v-if="photosURL.length > index" :src="photosURL[index]" alt="">
        </div>
      </div>
      <span class="text-[#ADAFBC] font-[300] text-[30px] mr-[10px]">></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ShoppingListHome } from '@/type/output/ShoppingListHome';
import { ref, getDownloadURL } from 'firebase/storage'
import { onMounted, Ref, ref as reference } from 'vue'
import { storage } from '@/firebase';
import { User } from 'firebase/auth';

const props = defineProps<{ shoppingList: ShoppingListHome }>()

const photosURL: Ref<Array<string>> = reference([])
const listUrl: Ref<string> = reference('')
const getImgUrl = async (users: Array<User & { photo: string }>) => {
  photosURL.value = await Promise.all(
      users.filter(user => user.photo)
      .map(async (user) => await getDownloadURL(ref(storage, user.photo)))
  )
}
onMounted(async() => {
  if (props.shoppingList.photo)
    listUrl.value = await getDownloadURL(ref(storage, props.shoppingList.photo))
  if (props.shoppingList.users.length > 0)
    await getImgUrl(props.shoppingList.users)
})
</script>

<style scoped>

</style>
