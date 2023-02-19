<template>
  <input
    v-bind="$attrs"
    v-model="propsValue"
    class="w-full rounded-[10px] p-[12px] font-[400] focus:outline-none focus:border-primary-50 shadow"
  >
</template>

<script lang="ts" setup>
import { useVModel } from '@/composables/useVModel';

const props = withDefaults(defineProps<{modelValue: string | number}>(), {})
const propsValue = useVModel(props, 'modelValue')
</script>
