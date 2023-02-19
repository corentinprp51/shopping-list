<template>
  <div v-if="shoppingList && shoppingListStore.shoppingList" class="px-[15px]">
    <div class="header mt-[40px]">
      <div class="flex justify-between">
        <router-link :to="{ name: 'get-list', params: { id: route.params.id } }">
          <arrow-back />
        </router-link>
        <div class="flex">
          <div v-for="(user, index) in shoppingList.users" :key="user.uid" class="rounded-full w-[20px] h-[20px] bg-gray-300">
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
        <span class="text-black font-[400] text-[20px]">{{ shoppingListStore.shoppingList.title }}</span>
        <span @click="isModalOpen = true"><delete-icon /></span>
      </div>
    </div>
    <div class="form-edit mt-[35px]">
      <edit-shopping-list-form v-model="shoppingList" :img-url="listUrl" @submit="editShoppingList($event)" />
    </div>
    <error-banner v-if="error" class="mt-[20px] w-full text-center">
      {{ error }}
    </error-banner>
  </div>
  <loader v-else />
  <div v-if="isModalOpen" class="overlay h-screen w-full bg-[rgba(0,0,0,0.7)] absolute top-0 z-10" @click="isModalOpen = false" />
  <div v-if="isModalOpen && shoppingListStore.shoppingList" class="modal bg-white z-20 absolute w-[80%] h-[200px] top-[50%] left-[50%] rounded-[15px] shadow flex flex-col items-center justify-center">
    <span class="text-[#434242] text-[20px] font-[400]">Supprimer <span class="font-semibold">{{ shoppingListStore.shoppingList.title }}</span> ?</span>
    <div class="flex gap-[20px] items-center justify-center w-full mt-[20px]">
      <primary-button class="w-[30%]" @click="removeShoppingList">
        Confirmer
      </primary-button>
      <primary-button-reversed class="w-[30%]" @click="isModalOpen = false">
        Annuler
      </primary-button-reversed>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ArrowBack from '@/components/icons/arrow-back.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref as reference, Ref } from 'vue';
import { ShoppingListHome } from '@/type/output/ShoppingListHome';
import { useShoppingListStore } from '@/store/shoppingListStore';
import { User } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, shoppingListsRef, shoppingListsUsersRef, storage } from '@/firebase';
import { useGetOneList } from '@/composables/shopping_lists/useGetOneList';
import Loader from '@/components/loader/loader-component.vue';
import EditShoppingListForm from '@/components/forms/edit-shopping-list-form.vue';
import { deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import DeleteIcon from '@/components/icons/delete-icon.vue';
import PrimaryButton from '@/components/buttons/primary-button.vue';
import PrimaryButtonReversed from '@/components/buttons/primary-button-reversed.vue';
import FlashMessagesService from '@/services/FlashMessagesService';
import ErrorBanner from '@/components/banners/error-banner.vue';

const route = useRoute()
const router = useRouter()
const { state, fetchList } = useGetOneList()
const shoppingListStore = useShoppingListStore()
const shoppingList: Ref<null | ShoppingListHome> = reference(null)
const listUrl: Ref<string> = reference('')
const photosURL: Ref<Array<string>> = reference([])
const isModalOpen: Ref<boolean> = reference(false)
const error = reference('')

const getImgUrl = async (users: Array<User & { photo: string }>) => {
  photosURL.value = await Promise.all(
      users.filter(user => user.photo)
          .map(async (user) => await getDownloadURL(ref(storage, user.photo)))
  )
}

onMounted(async () => {
  if (route.params.id) {
    if (!shoppingListStore.shoppingList) {
      // Firebase Fetch Query
      await fetchList(route.params.id as string)
      await shoppingListStore.setShoppingList(state.list)
    }
    shoppingList.value = { ...shoppingListStore.shoppingList as ShoppingListHome }
    if (shoppingList.value && shoppingList.value.photo)
      listUrl.value = await getDownloadURL(ref(storage, shoppingList.value.photo))
    if (shoppingList.value && shoppingList.value.users && shoppingList.value.users.length > 0) {
      await getImgUrl(shoppingList.value.users)
    }
  }
})

const editShoppingList = async (file: File | null) => {
  error.value = ''
  if (shoppingList.value && shoppingList.value.title && shoppingList.value.invitation_link) {
    const shoppingListRef = await doc(db, "shopping_lists", route.params.id as string)
    const q = query(shoppingListsRef, where("invitation_link", "==", shoppingList.value.invitation_link))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.docs.length === 0 || (shoppingListStore.shoppingList && shoppingList.value.invitation_link === shoppingListStore.shoppingList.invitation_link)) {
      if (file) {
        // Convertir le type en fonction de la photo (jpg / png)
        const fileType = file.type.split('/')[1]
        const imgTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/tiff']
        if (!imgTypes.includes(file.type) || file.size > 1048576) {
          error.value = `Le fichier n'est pas au bon format ou sa taille est supérieur à 1Mo`
          return
        }
        if (!shoppingList.value.photo) {
          shoppingList.value.photo = `lists/${shoppingList.value.id}.${fileType}`
        }
        const storageRef = ref(storage, shoppingList.value.photo)
        await uploadBytes(storageRef, file)
      }
      await updateDoc(shoppingListRef, {
        title: shoppingList.value.title,
        invitation_link: shoppingList.value.invitation_link,
        updated_at: serverTimestamp(),
        photo: shoppingList.value.photo || ''
      })
      FlashMessagesService.getInstance().success(`Liste ${shoppingList.value.title} mise à jour !`)
      await router.push({ name: 'get-list', params: { id: route.params.id } })
    } else {
      error.value = `Le code d'invitation existe déjà`
    }
  } else {
    error.value = `Veuillez saisir un nom pour la liste ainsi que son code d'invitation`
  }
}

const removeShoppingList = async () => {
  if (shoppingList.value) {
    const listId = shoppingList.value.id
    // Remove all users from shopping List
    const q = query(shoppingListsUsersRef, where("shoppingListId", "==", listId))
    const querySnapshot = await getDocs(q)
    for (const doc of querySnapshot.docs) {
      if(doc.exists()) {
        await deleteDoc(doc.ref)
      }
    }
    // Remove Shopping List
    const listRef = await doc(db, `shopping_lists`, listId)
    await deleteDoc(listRef)
    isModalOpen.value = false
    setTimeout(() => {
      if (shoppingList.value)
        FlashMessagesService.getInstance().success(`Liste ${shoppingList.value.title} supprimée !`)
    }, 500)
    await router.push('/')
  }
}
</script>

<style scoped>

</style>
