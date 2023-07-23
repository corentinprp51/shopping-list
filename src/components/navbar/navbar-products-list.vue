<template>
  <div class="h-[120px] fixed bottom-0 left-0 right-0">
    <div class="h-[105px]">
      <ul class="h-full flex justify-around items-center">
        <li>
          <router-link
            v-if="userRole === 'owner'"
            :to="{ name: 'edit-list', params: { id: route.params.id } }"
            style="-webkit-tap-highlight-color: transparent"
            @click="addAnimation(1)"
          >
            <edit-icon :class="elementToAnimate === 1 ? 'clickedButton' : ''" />
          </router-link>
          <router-link
            v-else
            to="/"
            style="-webkit-tap-highlight-color: transparent"
            @click="addAnimation(1)"
          >
            <home-icon :class="elementToAnimate === 1 ? 'clickedButton' : ''" />
          </router-link>
        </li>
        <li>
          <div style="-webkit-tap-highlight-color: transparent" @click="openModal">
            <add-product-icon :class="elementToAnimate === 2 ? 'clickedButton' : ''" />
          </div>
        </li>
        <li>
          <div style="-webkit-tap-highlight-color: transparent" @click="copyInvitationLink">
            <add-user-icon :class="elementToAnimate === 3 ? 'clickedButton' : ''" />
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div v-if="isModalOpen" class="overlay h-screen w-full bg-[rgba(0,0,0,0.7)] absolute top-0 z-10" @click="isModalOpen = false" />
  <div v-if="isModalOpen" class="modal bg-white z-20 absolute w-[95%] min-h-[200px] top-[50%] left-[50%] rounded-[15px] shadow flex flex-col items-center justify-center py-4">
    <span class="text-[#434242] text-[20px] font-[400]">Ajouter un produit</span>
    <form class="flex flex-col gap-[10px] items-center justify-center w-[80%] mt-[16px]" @submit.prevent="addProduct">
      <input-generic
        id="input"
        ref="input"
        v-model="product.libelle"
        placeholder="Nom du produit"
        class="w-full text-[14px]"
      />
      <input-select-generic v-model="product.category" :options="getCategoriesOptions()" class="w-full text-sm" />
      <primary-button class="w-full mt-[5px] text-[14px]">
        Ajouter
      </primary-button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import HomeIcon from '@/components/icons/home-icon.vue';
import { useUserStore } from '@/store/userStore';
import AddUserIcon from '@/components/icons/add-user-icon.vue';
import AddProductIcon from '@/components/icons/add-product-icon.vue';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db, shoppingListsUsersRef } from '@/firebase';
import EditIcon from '@/components/icons/edit-icon.vue';
import { Product } from '@/type/output/ShoppingListHome';
import InputGeneric from '@/components/inputs/input-generic.vue';
import PrimaryButton from '@/components/buttons/primary-button.vue';
import { useShoppingListStore } from '@/store/shoppingListStore';
import FlashMessagesService from '@/services/FlashMessagesService';
import InputSelectGeneric from '@/components/inputs/input-select-generic.vue';
import { getCategoriesOptions } from '@/utils/categories';

const userStore = useUserStore()
const shoppingListStore = useShoppingListStore()
const userRole = ref(null)
const route = useRoute()
const isModalOpen = ref(false)
const product: Omit<Product, "id"> = reactive({
  libelle: '',
  checked: false,
  category: ''
})
const elementToAnimate = ref<number>(0)
const addAnimation = (number: number) => {
  elementToAnimate.value = number
  setTimeout(() => elementToAnimate.value = 0, 500)
}

onMounted(async () => {
  if (route.params.id as string && userStore.user) {
    const qRole = query(shoppingListsUsersRef, where("userId", "==", userStore.user.uid), where("shoppingListId", "==", route.params.id as string))
    const roleDocSnap = await getDocs(qRole)
    userRole.value = roleDocSnap.docs[0].data().role
  }
})

const openModal = () => {
  addAnimation(2)
  isModalOpen.value = true
  setTimeout(() => {
    const input: HTMLElement | null = document.getElementById('input')
    if (input)
      input.focus()
  }, 10)
}

const addProduct = async () => {
  const shoppingListRef = await doc(db, "shopping_lists", route.params.id as string)
  await addDoc(collection(db, `shopping_lists/${route.params.id as string}/products`), {
    ...product
  })
  isModalOpen.value = false
  await updateDoc(shoppingListRef, {
    updated_at: serverTimestamp(),
  })
}

const copyInvitationLink = () => {
  addAnimation(3)
  if (shoppingListStore.shoppingList) {
    FlashMessagesService.getInstance().success(`Lien d'invitation copié !`)
    return navigator.clipboard.writeText(shoppingListStore.shoppingList.invitation_link)
  }
}

watch(isModalOpen, () => {
  if(!isModalOpen.value)
    product.libelle = ''
})

</script>

<style>
.router-link-active #border{
  @apply fill-[#E23E3E];
}
.router-link-active #background{
  @apply fill-[#F9D8D8];
}
.modal {
  transform: translate(-50%, -50%);
}

.clickedButton {
  animation: scaleOnClick 0.5s;
}

@keyframes scaleOnClick {
  0%,100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.25);
  }
}
</style>
