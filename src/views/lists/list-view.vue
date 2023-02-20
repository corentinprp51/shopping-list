<template>
  <div v-if="!state.isPreloading && state.list && state.list.products" class="px-[15px]">
    <div class="header mt-[40px]">
      <div class="flex justify-between">
        <router-link to="/" style="-webkit-tap-highlight-color: transparent">
          <arrow-back />
        </router-link>
        <div class="flex">
          <div v-for="(user, index) in state.list.users" :key="user.uid" class="rounded-full w-[20px] h-[20px] bg-gray-300">
            <img v-if="photosURL.length > index" :src="photosURL[index]" alt="">
          </div>
        </div>
      </div>
      <div class="flex items-center gap-[10px] mt-[19px]">
        <img
          v-if="listUrl"
          :src="listUrl"
          class="w-[40px] h-[40px]"
          alt=""
        >
        <div v-else class="rounded-full w-[40px] h-[40px] bg-gray-100" />
        <span class="text-black font-[400] text-[20px]">{{ state.list.title }}</span>
      </div>
    </div>
    <div class="shopping-list mt-[35px]">
      <shopping-list
        :products="state.list.products"
        @check-product="checkProduct($event)"
        @un-check-product="unCheckProduct($event)"
        @delete-product="deleteProduct($event)"
      />
    </div>
  </div>
  <loader v-else />
</template>

<script lang="ts" setup>

import { useRoute } from 'vue-router';
import { useGetOneList } from '@/composables/shopping_lists/useGetOneList';
import { onMounted, onUnmounted, Ref, ref as reference } from 'vue';
import ArrowBack from '@/components/icons/arrow-back.vue';
import Loader from '@/components/loader/loader-component.vue';
import { getDownloadURL, ref } from 'firebase/storage';
import { db, storage } from '@/firebase';
import { User } from 'firebase/auth';
import ShoppingList from '@/components/shopping-list/shopping-list.vue';
import { onSnapshot, collection, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { Product } from '@/type/output/ShoppingListHome';
import { useShoppingListStore } from '@/store/shoppingListStore';

const route = useRoute()
const shoppingListStore = useShoppingListStore()
const { state, fetchList } = useGetOneList()
const listUrl = reference("")
const photosURL: Ref<Array<string>> = reference([])
const unsub: Ref<(() => void) | null> = reference(null)
const getImgUrl = async (users: Array<User & { photo: string }>) => {
  photosURL.value = await Promise.all(
      users.filter(user => user.photo)
      .map(async (user) => await getDownloadURL(ref(storage, user.photo)))
  )
}
onMounted(async () => {
  if (route.params.id) {
    await fetchList(route.params.id as string)
    await shoppingListStore.setShoppingList(state.list)
    if (state.list)
      if (state.list.photo) {
        listUrl.value = await getDownloadURL(ref(storage, state.list.photo))
      }
    if (state.list && state.list.users && state.list.users.length > 0) {
      await getImgUrl(state.list.users)
      unsub.value = onSnapshot(collection(db, `shopping_lists/${route.params.id as string}/products`), (querySnapshot) => {
        if (state.list && state.list.products)
          state.list.products = querySnapshot.docs.filter(doc => doc.exists()).map(doc => ({ id: doc.id, ...doc.data() as Omit<Product, "id"> }))
      })
    }
  }
})

onUnmounted(() => {
  if (unsub.value)
    unsub.value()
})

const checkProduct = async (product: Product) => {
  const shoppingListRef = await doc(db, "shopping_lists", route.params.id as string)
  const productRef = await doc(db, `shopping_lists/${route.params.id as string}/products`, product.id)
  await updateDoc(productRef, {
    checked: true,
  })
  await updateDoc(shoppingListRef, {
    updated_at: serverTimestamp(),
  })
}
const unCheckProduct = async (product: Product) => {
  const shoppingListRef = await doc(db, "shopping_lists", route.params.id as string)
  const productRef = await doc(db, `shopping_lists/${route.params.id as string}/products`, product.id)
  await updateDoc(productRef, {
    checked: false,
  })
  await updateDoc(shoppingListRef, {
    updated_at: serverTimestamp(),
  })
}

const deleteProduct = async (productId: string) => {
  const shoppingListRef = await doc(db, "shopping_lists", route.params.id as string)
  const productRef = await doc(db, `shopping_lists/${route.params.id as string}/products`, productId)
  await deleteDoc(productRef)
  await updateDoc(shoppingListRef, {
    updated_at: serverTimestamp(),
  })
}

</script>
