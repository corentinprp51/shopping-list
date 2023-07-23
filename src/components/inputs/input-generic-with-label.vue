<template>
  <div>
    <label class="text-[12px] font-[300] italic text-[#ADAFBC]">{{ label }}</label>
    <input-generic v-bind="$attrs" v-model="propsValue" />
  </div>
</template>

<script lang="ts" setup>
import InputGeneric from '@/components/inputs/input-generic.vue';
import { useVModel } from '@/composables/useVModel';

const props = withDefaults(defineProps<{modelValue: string | number; label: string}>(), {})
const propsValue = useVModel(props, 'modelValue')
</script>
