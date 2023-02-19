<template>
  <select v-model="propsValue" name="input-select" class="border rounded-[10px] p-[12px]">
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.libelle }}
    </option>
  </select>
</template>

<script lang="ts" setup>
import { useVModel } from '@/composables/useVModel';

const props = defineProps<{ modelValue: string, options: Array<{ value: string, libelle: string }>}>()
const propsValue = useVModel<string>(props, 'modelValue')
</script>
