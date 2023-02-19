<template>
  <div>
    <label for="file" class="cursor-pointer text-primary-50 bg-white border border-primary-50 py-[14px] font-[400] px-[15px] text-center rounded-[16px]">Changer la photo</label>
    <input
      id="file"
      class="hidden"
      v-bind="$attrs"
      type="file"
      @change="emit('file-uploaded', $event)"
    >
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'file-uploaded', event: Event): void,
}>()
</script>
