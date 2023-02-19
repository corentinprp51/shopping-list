<template>
  <div class="flex h-screen justify-center flex-col items-center">
    <heading-title class="text-3xl">
      Connexion
    </heading-title>
    <login-form v-model="userLoginForm" class="mt-[20px]" @submit="login" />
    <error-banner v-if="errorAuth" class="mt-[5px]">
      {{ errorAuth }}
    </error-banner>
    <div class="text-center mt-[15px] px-[15px]">
      <router-link class="italic text-[14px] text-blue-400 underline" to="/register">
        Vous n'avez pas encore de compte ? Vous pouvez en créer un ici
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LoginForm from '@/components/forms/login-form.vue';
import { reactive, ref } from 'vue';
import HeadingTitle from '@/components/text/heading-title.vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db, usersCollection } from '@/firebase';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'vue-router';
import ErrorBanner from '@/components/banners/error-banner.vue';
import { doc, getDoc } from 'firebase/firestore';

const errorAuth = ref('')
const userLoginForm = reactive({
  email: '',
  password: '',
})
const userStore = useUserStore()
const router = useRouter()

const login = async () => {
  errorAuth.value = ''
  if (userLoginForm.email && userLoginForm.password) {
    signInWithEmailAndPassword(auth, userLoginForm.email, userLoginForm.password)
        .then(async (userCredential) => {
          //Add User to the store
          const userDocRef = doc(db, usersCollection, userCredential.user.uid)
          const userSnapshot = await getDoc(userDocRef)
          userStore.setUser({...userCredential.user, ...userSnapshot.data()})
          await router.push('/')
        })
      .catch(() => {
        errorAuth.value = `L'adresse mail et/ou le mot de passe sont incorrects`
      })
  } else {
    errorAuth.value = `Veuillez renseigner adresse mail et/ou un mot de passe`
  }
}
</script>
