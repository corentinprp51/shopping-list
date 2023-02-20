<template>
  <div class="h-[120px] fixed bottom-0 left-0 right-0">
    <div class="h-[105px]">
      <ul class="h-full flex justify-around items-center">
        <li class="menu-element" @click="addAnimation(1)">
          <router-link to="/">
            <home-icon :class="elementToAnimate === 1 ? 'clickedButton' : ''" />
          </router-link>
        </li>
        <li class="menu-element" @click="addAnimation(2)">
          <router-link to="/new">
            <add-list-icon :class="elementToAnimate === 2 ? 'clickedButton' : ''" />
          </router-link>
        </li>
        <li class="menu-element">
          <router-link to="/profile" @click="addAnimation(3)">
            <profile-icon :class="elementToAnimate === 3 ? 'clickedButton' : ''" />
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HomeIcon from '@/components/icons/home-icon.vue';
import AddListIcon from '@/components/icons/add-list-icon.vue';
import ProfileIcon from '@/components/icons/profile-icon.vue';
import { ref } from 'vue';
const elementToAnimate = ref<number>(0)
const addAnimation = (number: number) => {
  elementToAnimate.value = number
  setTimeout(() => elementToAnimate.value = 0, 500)
}
</script>

<style>
.router-link-active #border{
  @apply fill-[#E23E3E];
}
.router-link-active #background{
  @apply fill-[#F9D8D8];
}
.menu-element {
  -webkit-tap-highlight-color: transparent
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
