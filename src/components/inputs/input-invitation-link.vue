<template>
  <div>
    <label class="text-[12px] font-[300] italic text-[#ADAFBC]">Lien d'invitation</label>
  </div>
  <div class="grid grid-cols-2 gap-[10px]">
    <input-generic v-model="propsValue" required placeholder="Code d'invitation" />
    <primary-button type="button" @click.prevent="generateLink">
      Générer
    </primary-button>
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from '@/composables/useVModel';
import PrimaryButton from '@/components/buttons/primary-button.vue';
import InputGeneric from '@/components/inputs/input-generic.vue';

const props = withDefaults(defineProps<{modelValue: string | number}>(), {})
const propsValue = useVModel(props, 'modelValue')

const generateUniqueId = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
}
const generateLink = () => {
  propsValue.value = generateUniqueId() + generateUniqueId() + generateUniqueId().substring(0,2)
}

</script>

<style scoped>

</style>
