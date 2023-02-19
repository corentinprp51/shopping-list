<template>
  <div class="flex flex-col items-center">
    <form class="flex flex-col justify-center items-center" @submit.prevent="emit('submit')">
      <div class="w-full">
        <input-generic
          v-model="propsValue.email"
          class="w-[324px]"
          type="email"
          placeholder="Adresse mail"
          required
        />
      </div>
      <div class="w-full">
        <input-generic
          v-model="propsValue.password"
          class="w-[324px] mt-[24px]"
          type="password"
          placeholder="Password"
          required
        />
      </div>
      <div>
        <primary-button class="w-[324px] mt-[24px]">
          Connexion
        </primary-button>
      </div>
    </form>
  </div>
</template>

  <script lang="ts" setup>
    import { useVModel } from '@/composables/useVModel';
    import InputGeneric from '@/components/inputs/input-generic.vue';
    import PrimaryButton from '@/components/buttons/primary-button.vue';

    const props = defineProps<{modelValue: { email: string, password: string }}>()
    const propsValue = useVModel<{ email: string, password: string }>(props, 'modelValue')
    const emit = defineEmits<{
      (e: 'submit'): void,
    }>()
  </script>
