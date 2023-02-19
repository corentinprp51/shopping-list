import { defineStore, StoreDefinition } from 'pinia';
import { User } from 'firebase/auth';

type State = {
    user: null | User & UserCollection;
}

export type UserCollection = {
    id: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    photo: string;
    created_at: string;
    updated_at: string;
}

export const useUserStore: StoreDefinition<"user", State>
    = defineStore('user', {
    state: () => {
        return {
            user: null,
        } as State
    },
    actions: {
        setUser(user: User & UserCollection | null) {
            this.user = user;
        },
        // async logout() {
        //     // Logout Firebase
        //     this.router.push('/login')
        //     await signOut(auth)
        //     this.setUser(null)
        //     FlashMessagesService.getInstance().success('Vous vous êtes déconnecté')
        //
        // }
    }
});
