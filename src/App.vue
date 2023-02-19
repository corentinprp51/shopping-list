<template>
  <div class="fixed w-screen overflow-hidden">
    <!-- Flash Message Handler -->
    <flash-message-handler />
    <div :class="isMounted === true && route.name !== 'login' && route.name !== 'register' ? 'mt-[20px] content overflow-y-scroll' : ''">
      <router-view :class="isMounted && route.name !== 'login' && route.name !== 'register' ? 'min-height' : ''" />
    </div>
    <navbar v-if="isMounted === true && route.name !== 'login' && route.name !== 'register' && route.name !== 'get-list'" />
    <navbar-products-list v-if="isMounted === true && route.name === 'get-list'" />
  </div>
</template>

<script lang="ts" setup>
import Navbar from '@/components/navbar/navbar-component.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import NavbarProductsList from '@/components/navbar/navbar-products-list.vue';
import FlashMessageHandler from '@/components/banners/flash-messages/flash-message-handler.vue';

const route = useRoute()
const router = useRouter()
const isMounted = ref(false)
onMounted(async () => {
  await router.isReady();
  isMounted.value = true
})
</script>
<style>
.min-height {
  height: calc(100vh - 120px);
  overflow-y: scroll;
}
</style>
