<template>
  <div v-if="message" class="bg-green-200 text-green-800 absolute right-[5px] p-[12px] rounded-[10px]">
    {{ message }}
  </div>
</template>

<script lang="ts" setup>

defineProps<{ message: string }>()
</script>
