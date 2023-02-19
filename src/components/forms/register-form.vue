<template>
  <div class="flex flex-col items-center">
    <form class="flex flex-col justify-center items-center" @submit.prevent="emit('submit', file)">
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
          v-model="propsValue.username"
          class="w-[324px] mt-[24px]"
          type="text"
          placeholder="Nom d'utilisateur"
          required
        />
      </div>
      <div class="w-full">
        <input-generic
          v-model="propsValue.firstName"
          class="w-[324px] mt-[24px]"
          type="text"
          placeholder="Nom"
        />
      </div>
      <div class="w-full">
        <input-generic
          v-model="propsValue.lastName"
          class="w-[324px] mt-[24px]"
          type="text"
          placeholder="Prénom"
        />
      </div>
      <div class="w-full">
        <input-generic
          v-model="propsValue.password"
          class="w-[324px] mt-[24px]"
          type="password"
          placeholder="Mot de passe"
          required
        />
      </div>
      <div class="w-full">
        <input-generic
          v-model="propsValue.confirm_password"
          class="w-[324px] mt-[24px]"
          type="password"
          placeholder="Confirmation du mot de passe"
          required
        />
      </div>
      <div class="w-full mt-[40px] flex flex-col items-center">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          alt="List Logo"
          class="w-[60px] h-[60px]"
        >
        <input-load-photo class="mt-[30px]" @file-uploaded="updateFile" />
      </div>
      <div class="w-full mt-[50px]">
        <primary-button class="w-[324px]">
          Inscription
        </primary-button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from '@/composables/useVModel';
import InputGeneric from '@/components/inputs/input-generic.vue';
import PrimaryButton from '@/components/buttons/primary-button.vue';
import InputLoadPhoto from '@/components/inputs/input-load-photo.vue';
import { ref as reference, Ref } from 'vue';

type RegisterForm = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirm_password: string;
}
const props = defineProps<{modelValue: RegisterForm}>()
const propsValue = useVModel(props, 'modelValue')
const emit = defineEmits<{
  (e: 'submit', file: File | null): void,
}>()

const file: Ref<File | null> = reference(null)
const imageUrl = reference('')
const updateFile = (event: Event) => {
  const files = (event.target as HTMLInputElement).files as FileList
  file.value = files[0]
  imageUrl.value = URL.createObjectURL(file.value)
}
</script>
