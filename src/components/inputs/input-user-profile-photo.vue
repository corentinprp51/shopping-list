<template>
  <div>
    <label for="file" class="cursor-pointer"><edit-photo-icon /></label>
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
import EditPhotoIcon from '@/components/icons/edit-photo-icon.vue';

const emit = defineEmits<{
  (e: 'file-uploaded', event: Event): void,
}>()
</script>
