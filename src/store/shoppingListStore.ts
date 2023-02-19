import { defineStore, StoreDefinition } from 'pinia';
import { ShoppingListHome } from '@/type/output/ShoppingListHome';

type State = {
    shoppingList: null | Omit<ShoppingListHome, "products">;
}
export const useShoppingListStore: StoreDefinition<"shoppingList", State>
    = defineStore('shoppingList', {
    state: () => {
        return {
            shoppingList: null,
        } as State
    },
    actions: {
        setShoppingList(shoppingList: Omit<ShoppingListHome, "products"> | null) {
            this.shoppingList = shoppingList;
        },
    }
});
