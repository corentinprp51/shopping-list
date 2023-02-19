import { ref, Ref } from 'vue';
import { query, where, getDocs, doc, getDoc, collection } from 'firebase/firestore'
import { db, shoppingListsUsersRef } from '@/firebase';
import { useUserStore } from '@/store/userStore';

export const useGetLists = () => {
    // eslint-disable-next-line
    const lists: Ref<Array<any>> = ref([])
    const isPreloading = ref(false)
    const error: Ref<string> = ref('')
    const userStore = useUserStore()

    const getLists = async () => {
        error.value = ''
        isPreloading.value = true
        const q = query(shoppingListsUsersRef, where("userId", "==", userStore.user?.uid || ''))
        const junctions = await getDocs(q)
        const shopping_lists = await Promise.all(
            junctions.docs
                .filter((document => document.exists()))
                .map((async document => {
                    const docSnap = await getDoc(doc(db,`shopping_lists/${document.data().shoppingListId}`))
                    const q2 = query(shoppingListsUsersRef, where("shoppingListId", "==", document.data().shoppingListId || ''))
                    const junctions = await getDocs(q2)
                    const usersSnapshots = await Promise.all(
                        junctions.docs
                            .filter(userDoc => userDoc.exists())
                            .map((async userDoc => await getDoc(doc(db,`users/${userDoc.data().userId}`))))
                    )
                    const users = usersSnapshots.filter(document => document.exists()).map(document => ({id: document.id,...document.data()}))
                    const productsSnapshot = await getDocs(collection(db, `shopping_lists/${document.data().shoppingListId}/products`))
                    const products = productsSnapshot.docs.filter(doc => doc.exists()).map(doc => ({id: doc.id, ...doc.data()}))
                    return {
                        role: document.data().role,
                        users: users,
                        products: products,
                        doc: docSnap
                    }
                }))
        )
        lists.value = shopping_lists.filter(el => el.doc.exists()).map(el => ({id: el.doc.id, role: el.role, users: el.users, products: el.products, ...el.doc.data()}))
        isPreloading.value = false
    }

    getLists()

    return {
        lists,
        isPreloading,
        error
    }
}
