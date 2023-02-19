<template>
  <div class="flex flex-col items-center">
    <form class="flex flex-col justify-center items-center w-full" @submit.prevent="emit('submit', file)">
      <div class="w-full">
        <input-generic-with-label
          v-model="propsValue.title"
          label="Libellé"
          type="email"
          class="w-full"
          placeholder="Adresse mail"
          required
        />
      </div>
      <div class="w-full mt-[20px]">
        <input-invitation-link
          v-model="propsValue.invitation_link"
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
      <div class="w-full">
        <primary-button class="w-full mt-[75px]" type="submit">
          Enregistrer
        </primary-button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from '@/composables/useVModel';
import PrimaryButton from '@/components/buttons/primary-button.vue';
import { ShoppingListHome } from '@/type/output/ShoppingListHome';
import InputGenericWithLabel from '@/components/inputs/input-generic-with-label.vue';
import InputInvitationLink from '@/components/inputs/input-invitation-link.vue';
import InputLoadPhoto from '@/components/inputs/input-load-photo.vue';
import { Ref, ref as reference, watch } from 'vue'

const props = defineProps<{modelValue: Pick<ShoppingListHome, "title" | "invitation_link" | "photo">; imgUrl: string}>()
const propsValue = useVModel<Pick<ShoppingListHome, "title" | "invitation_link" | "photo">>(props, 'modelValue')
const file: Ref<File | null> = reference(null)
const emit = defineEmits<{
  (e: 'submit', file: File | null): void,
}>()

const imageUrl = reference('')
watch(() => props.imgUrl, () => {
  imageUrl.value = props.imgUrl
})

const updateFile = (event: Event) => {
  const files = (event.target as HTMLInputElement).files as FileList
  file.value = files[0]
  imageUrl.value = URL.createObjectURL(file.value)
}
</script>
