import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/userStore';
import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home-view.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/list/:id',
        name: 'get-list',
        component: () => import('@/views/lists/list-view.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/list/:id/edit',
        name: 'edit-list',
        component: () => import('@/views/lists/edit-list-view.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/new',
        name: 'new-list',
        component: () => import('@/views/lists/add-list-view.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/authentication/user-profile-view.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/authentication/login-view.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/authentication/register-view.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const getCurrentUser = () => {
    const userStore = useUserStore()
    return new Promise(((resolve, reject) => {
        const removeListener = onAuthStateChanged(auth, (user) => {
            removeListener()
            if (user && user.uid) {
                getDoc(doc(db, `users/${user?.uid}`))
                    .then((document) => {
                        userStore.setUser({...user, ...document.data()})
                        resolve(user)
                    })
            } else {
                resolve(user)
            }
        }, reject);
    }))
}

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if(userStore.user || await getCurrentUser()) {
            next()
            return
        } else {
            next('/login')
            return
        }
    }
    if ((userStore.user || await getCurrentUser()) && (to.name == 'login' || to.name == 'register')) {
        next('/')
        return
    }
    next()
})

export default router
