<template>
  <div class="h-[120px] fixed bottom-0 left-0 right-0">
    <div class="h-[105px]">
      <ul class="h-full flex justify-around items-center">
        <li>
          <router-link to="/">
            <home-icon />
          </router-link>
        </li>
        <li>
          <router-link to="/new">
            <add-list-icon />
          </router-link>
        </li>
        <li>
          <router-link to="/profile">
            <profile-icon />
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
</script>

<style>
.router-link-active #border{
  @apply fill-[#E23E3E];
}
.router-link-active #background{
  @apply fill-[#F9D8D8];
}
</style>
