<template>
  <div class="mt-[19px]">
    <div>
      <h1 class="text-center text-[20px] font-[400] text-black">
        Vos listes de courses
      </h1>
    </div>
    <div class="mt-[35px]">
      <h2 class="font-[400] text-[12px] text-[#ADAFBC] ml-[15px]">
        Récemment ajoutées
      </h2>
      <div v-if="!isPreloading" class="mt-[17px]">
        <shopping-list-card
          v-for="list in lists"
          :key="list.id"
          :shopping-list="list"
          @click="router.push({ name: 'get-list', params: { id: list.id } })"
        />
      </div>
      <loader v-else class="mt-[17px]" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { signOut } from 'firebase/auth'
// import { auth } from '@/firebase';
// signOut(auth)
import { useGetLists } from '@/composables/shopping_lists/useGetLists';
import ShoppingListCard from '@/components/cards/shopping-list-card.vue';
import Loader from '@/components/loader/loader-component.vue';
import { useRouter } from 'vue-router';

const { lists, isPreloading } = useGetLists()
const router = useRouter()
</script>
