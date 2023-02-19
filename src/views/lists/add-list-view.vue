<template>
  <div class="px-[15px]">
    <div class="header mt-[40px]">
      <div class="flex justify-between">
        <router-link to="/">
          <arrow-back />
        </router-link>
      </div>
      <div class="flex items-center gap-[10px] mt-[19px]">
        <div class="flex justify-start gap-[20px] text-black font-[400] text-[20px]">
          <span :class="createIsActive ? 'text-primary-50 border-b border-b-primary-50' : ''" @click="createIsActive = true">Créer une liste</span>
          <span :class="!createIsActive ? 'text-primary-50 border-b border-b-primary-50' : ''" @click="createIsActive = false">Rejoindre une liste</span>
        </div>
      </div>
    </div>
    <div class="add-content mt-[35px]">
      <div v-if="createIsActive">
        <edit-shopping-list-form v-model="shoppingList" img-url="" @submit="createList($event)" />
      </div>
      <div v-else>
        <form class="flex items-center justify-center flex-col w-full" @submit.prevent="joinList">
          <input-generic-with-label v-model="joinLink" label="Code d'invitation" class="w-full" />
          <primary-button class="w-full mt-[15px]">
            Rejoindre
          </primary-button>
        </form>
      </div>
      <error-banner v-if="error" class="mt-[20px] w-full text-center">
        {{ error }}
      </error-banner>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ArrowBack from '@/components/icons/arrow-back.vue';
import { reactive, ref, watch } from 'vue';
import EditShoppingListForm from '@/components/forms/edit-shopping-list-form.vue';
import { addDoc, collection, getDocs, query, updateDoc, where, serverTimestamp } from 'firebase/firestore';
import { db, shoppingListsRef, shoppingListsUsersRef, storage } from '@/firebase';
import router from '@/router';
import { useUserStore } from '@/store/userStore';
import InputGenericWithLabel from '@/components/inputs/input-generic-with-label.vue';
import PrimaryButton from '@/components/buttons/primary-button.vue';
import { uploadBytes, ref as referenceStockage } from 'firebase/storage';
import FlashMessagesService from '@/services/FlashMessagesService';
import ErrorBanner from '@/components/banners/error-banner.vue';

const createIsActive = ref(true)
const error = ref('')
const userStore = useUserStore()
const shoppingList = reactive({
  title: '',
  invitation_link: '',
  photo: '',
})
const joinLink = ref('')

watch(createIsActive, () => {
  error.value = ''
})

const createList = async (file: File | null) => {
  error.value = ''
  if (shoppingList.title && shoppingList.invitation_link) {
    const q = query(shoppingListsRef, where("invitation_link", "==", shoppingList.invitation_link))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.docs.length === 0) {
      if (file) {
        const imgTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/tiff']
        if (!imgTypes.includes(file.type) || file.size > 1048576) {
          error.value = `Le fichier n'est pas au bon format ou sa taille est supérieur à 1Mo`
          return
        }
      }
      const shoppingListRef = await addDoc(collection(db, 'shopping_lists'), {
        title: shoppingList.title,
        invitation_link: shoppingList.invitation_link,
        created_at: serverTimestamp(),
        updated_at: null,
        photo: '',
      })
      await addDoc(collection(db, 'shopping_lists_users'), {
        role: 'owner',
        shoppingListId: shoppingListRef.id,
        userId: userStore.user?.uid || '',
      })
      if (file) {
        if (!shoppingList.photo) {
          const fileType = file.type.split('/')[1]
          shoppingList.photo = `lists/${shoppingListRef.id}.${fileType}`
        }
        const storageRef = referenceStockage(storage, shoppingList.photo)
        await uploadBytes(storageRef, file)
      }
      await updateDoc(shoppingListRef, {
        id: shoppingListRef.id,
        photo: shoppingList.photo
      })
      FlashMessagesService.getInstance().success(`Liste créée avec succès`)
      await router.push({ name: 'get-list', params: { id: shoppingListRef.id } })
    } else {
      error.value = `Le code d'invitation existe déjà`
    }
  } else {
    error.value = `Veuillez saisir un nom pour la liste ainsi que son code d'invitation`
  }
}

const joinList = async () => {
  error.value = ''
  // Récupérer la liste avec le lien d'invitation
  const q = query(shoppingListsRef, where("invitation_link", "==", joinLink.value))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.docs.length > 0) {
    const shoppingListSnap = querySnapshot.docs[0]
    // Rejoindre la liste
    if (shoppingListSnap.exists()){
      // Check si le user n'est pas déjà présent dans la liste
      const q2 = query(shoppingListsUsersRef, where("userId", "==", userStore.user?.uid || ''), where("shoppingListId", "==", shoppingListSnap.id))
      const querySnapshot2 = await getDocs(q2)
      if (querySnapshot2.docs.length == 0) {
        await addDoc(collection(db, 'shopping_lists_users'), {
          role: 'member',
          shoppingListId: shoppingListSnap.id,
          userId: userStore.user?.uid || '',
        })
        FlashMessagesService.getInstance().success(`Vous venez de rejoindre la liste ${shoppingListSnap.data().title}`)
        await router.push({ name: 'get-list', params: { id: shoppingListSnap.id } })
      } else {
        error.value = `Vous avez déjà rejoint cette liste`
      }
    }
  } else {
    error.value = `Le code d'invitation est invalide`
  }
  return
}

</script>

<style scoped>

</style>
