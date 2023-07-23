<template>
  <div>
    <span class="text-[12px] text-[#ADAFBC] font-[400]">À acheter</span>
    <div class="mt-[6px] max-h-[50vh] overflow-scroll flex flex-col gap-6">
      <div v-for="category in productsUnCheckedByCategory" :key="category.libelle">
        <span class="text-sm font-semibold text-[#FF7373]">{{ category.libelle }}</span>
        <div v-for="product in category.products" :key="product.id" class="flex items-center justify-between py-[15px] border-b border-b-[#ADAFBC]">
          <div class="flex items-center gap-[10px]" @click="emit('checkProduct', product)">
            <div class="w-[20px] h-[20px] bg-white rounded-full border border-primary-50" />
            <span class="text-[14px] font-[300] text-black">{{ product.libelle }}</span>
          </div>
          <div class="flex gap-5">
            <edit-icon @click="showModal(product)" />
            <delete-icon @click="emit('deleteProduct', product.id)" />
          </div>
        </div>
      </div>
      <div v-if="productsUnCheckedByCategory.length === 0" class="text-[14px] text-[#ADAFBC] italic">
        Aucun produits
      </div>
    </div>
  </div>
  <div class="mt-[18px]">
    <span class="text-[12px] text-[#ADAFBC] font-[400]">Achetés</span>
    <div class="mt-[6px] max-h-[50vh] overflow-scroll">
      <div v-for="product in productsChecked" :key="product.libelle" class="flex items-center justify-between py-[15px] border-b border-b-[#ADAFBC]">
        <div class="flex items-center gap-[10px]" @click="emit('unCheckProduct', product)">
          <product-checked-icon />
          <span class="text-[14px] text-[#ADAFBC] italic font-[400] line-through">{{ product.libelle }}</span>
        </div>
        <div>
          <delete-icon @click="emit('deleteProduct', product.id)" />
        </div>
      </div>
      <div v-if="productsChecked.length === 0" class="text-[14px] text-[#ADAFBC] italic">
        Aucun produits
      </div>
    </div>
  </div>
  <div v-if="isModalOpen" class="overlay h-screen w-full bg-[rgba(0,0,0,0.7)] fixed top-0 left-0 z-20" @click="isModalOpen = false" />
  <div v-if="isModalOpen" class="modal bg-white z-30 absolute w-[95%] min-h-[200px] top-[50%] left-[50%] rounded-[15px] shadow flex flex-col items-center justify-center py-4">
    <span class="text-[#434242] text-[20px] font-[400]">Modifier {{ displayProductEditedName }}</span>
    <form v-if="editedProductSelected" class="flex flex-col gap-[10px] items-center justify-center w-[80%] mt-[16px]" @submit.prevent="editProduct">
      <input-generic
        id="input"
        ref="input"
        v-model="editedProductSelected.libelle"
        placeholder="Nom du produit"
        class="w-full text-[14px]"
      />
      <input-select-generic v-model="editedProductSelected.category" :options="getCategoriesOptions()" class="w-full text-sm" />
      <primary-button class="w-full mt-[5px] text-[14px]">
        Modifier
      </primary-button>
    </form>
  </div>
</template>

<script lang="ts" setup>

import { Product } from '@/type/output/ShoppingListHome';
import { computed, onMounted, ref } from 'vue';
import DeleteIcon from '@/components/icons/delete-icon.vue';
import ProductCheckedIcon from '@/components/icons/product-checked-icon.vue';
import { useRoute } from 'vue-router';
import EditIcon from '@/components/icons/edit-icon.vue';
import InputGeneric from '@/components/inputs/input-generic.vue';
import InputSelectGeneric from '@/components/inputs/input-select-generic.vue';
import PrimaryButton from '@/components/buttons/primary-button.vue';
import { getCategoriesOptions } from '@/utils/categories';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const props = defineProps<{ products: Array<Product> }>()
const emit = defineEmits<{
  (e: 'checkProduct', product: Product): void,
  (e: 'unCheckProduct', product: Product): void,
  (e: 'deleteProduct', productId: string): void
}>()
const route = useRoute()
const listId = ref('')
const editedProductSelected = ref<Product | null>(null)
const displayProductEditedName = ref<string>('')
const isModalOpen = ref<boolean>(false)
onMounted(() => {
  listId.value = route.params.id as string
})
const productsUnChecked = computed(() => {
  return props.products.filter((p) => !p.checked)
})
const productsUnCheckedByCategory = computed(() => {
  const categories = [... new Set(productsUnChecked.value.map((p) => p.category).sort())]
  return categories.map((category) => ({
    libelle: category,
    products: productsUnChecked.value.filter((p) => p.category === category)
  }))
})
const productsChecked = computed(() => {
  return props.products.filter((p) => p.checked)
})

const showModal = (product: Product) => {
  isModalOpen.value = true
  editedProductSelected.value = product
  displayProductEditedName.value = product.libelle
}

const editProduct = async () => {
  if (!editedProductSelected.value) return
  const shoppingListRef = await doc(db, "shopping_lists", route.params.id as string)
  const productRef = await doc(db, `shopping_lists/${route.params.id as string}/products`, editedProductSelected.value.id)
  await updateDoc(productRef, {
    ...editedProductSelected.value
  })
  await updateDoc(shoppingListRef, {
    updated_at: serverTimestamp(),
  })
  isModalOpen.value = false
}

</script>
