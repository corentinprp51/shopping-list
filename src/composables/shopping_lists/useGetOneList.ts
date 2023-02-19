import { reactive } from 'vue';
import { Product, ShoppingListHome } from '@/type/output/ShoppingListHome';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db, shoppingListsUsersRef } from '@/firebase';
import { User } from 'firebase/auth';
import { useUserStore } from '@/store/userStore';

export const useGetOneList = () => {
    const state : Partial<{ list: null | ShoppingListHome; isPreloading: boolean }> = reactive({ list: null, isPreloading: true })
    const userStore = useUserStore()

    const fetchList = async (id: string) => {
        // Rules firebase
        // Get List Snapshot
        const shoppingListSnap = await getDoc(doc(db,`shopping_lists/${id}`))
        // Get role of current User
        const qRole = query(shoppingListsUsersRef, where("userId", "==", userStore.user?.uid), where("shoppingListId", "==", id))
        const roleDocSnap = await getDocs(qRole)
        const role = roleDocSnap.docs[0].data().role
        // Get all users from list
        const q = query(shoppingListsUsersRef, where("shoppingListId", "==", id))
        const junctions = await getDocs(q)
        const usersSnapshots = await Promise.all(
            junctions.docs
                .filter(userDoc => userDoc.exists())
                .map((async userDoc => await getDoc(doc(db,`users/${userDoc.data().userId}`))))
        )
        const users = usersSnapshots.filter(document => document.exists()).map(document => ({id: document.id,...document.data() as User & {photo: string}}))
        // Get all products from list
        const productsSnapshot = await getDocs(collection(db, `shopping_lists/${id}/products`))
        const products = productsSnapshot.docs.filter(doc => doc.exists()).map(doc => ({id: doc.id, ...doc.data() as Omit<Product, "id">}))
        state.list = {
            id: shoppingListSnap.id,
            users,
            products,
            role,
            ...shoppingListSnap.data() as Omit<ShoppingListHome, "users" | "products" | "id" | "role">
        }
        state.isPreloading = false
    }
    return {
        state,
        fetchList
    }
}
