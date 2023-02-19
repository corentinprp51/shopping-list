<template>
  <div>
    <span class="text-[12px] text-[#ADAFBC] font-[400]">À acheter</span>
    <div class="mt-[6px]">
      <div v-for="product in productsUnChecked" :key="product.libelle" class="flex items-center justify-between py-[15px] border-b border-b-[#ADAFBC]">
        <div class="flex items-center gap-[10px]" @click="emit('checkProduct', product)">
          <div class="w-[20px] h-[20px] bg-white rounded-full border border-primary-50" />
          <span class="text-[14px] font-[300] text-black">{{ product.libelle }}</span>
        </div>
        <div>
          <delete-icon @click="emit('deleteProduct', product.id)" />
        </div>
      </div>
      <div v-if="productsUnChecked.length === 0" class="text-[14px] text-[#ADAFBC] italic">
        Aucun produits
      </div>
    </div>
  </div>
  <div class="mt-[18px]">
    <span class="text-[12px] text-[#ADAFBC] font-[400]">Achetés</span>
    <div class="mt-[6px]">
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
</template>

<script lang="ts" setup>

import { Product } from '@/type/output/ShoppingListHome';
import { computed, onMounted, ref } from 'vue';
import DeleteIcon from '@/components/icons/delete-icon.vue';
import ProductCheckedIcon from '@/components/icons/product-checked-icon.vue';
import { useRoute } from 'vue-router';

const props = defineProps<{ products: Array<Product> }>()
const emit = defineEmits<{
  (e: 'checkProduct', product: Product): void,
  (e: 'unCheckProduct', product: Product): void,
  (e: 'deleteProduct', productId: string): void,
}>()
const route = useRoute()
const listId = ref('')
onMounted(() => {
  listId.value = route.params.id as string
})
const productsUnChecked = computed(() => {
  return props.products.filter((p) => !p.checked)
})
const productsChecked = computed(() => {
  return props.products.filter((p) => p.checked)
})

</script>
