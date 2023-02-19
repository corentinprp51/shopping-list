<template>
  <div class="flex h-screen justify-center flex-col items-center">
    <heading-title class="text-3xl text-center">
      Nouveau compte
    </heading-title>
    <register-form v-model="userRegisterForm" class="mt-[20px]" @submit="register" />
    <error-banner v-if="errorAuth" class="mt-[5px]">
      {{ errorAuth }}
    </error-banner>
    <div class="text-center mt-[15px]">
      <router-link class="italic text-[14px] text-blue-400 underline" to="/login">
        Vous avez déjà un compte ? Connectez-vous ici
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import HeadingTitle from '@/components/text/heading-title.vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, storage, usersCollection } from '@/firebase';
import { setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import RegisterForm from '@/components/forms/register-form.vue';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'vue-router';
import ErrorBanner from '@/components/banners/error-banner.vue';
import { ref as referenceStockage, uploadBytes } from 'firebase/storage';
import FlashMessagesService from '@/services/FlashMessagesService';

const errorAuth = ref('')

const userRegisterForm = reactive({
  email: '',
  username: '',
  firstName: '',
  lastName: '',
  confirm_password: '',
  password: '',
  photo: '',
})

const userStore = useUserStore()
const router = useRouter()

const register = async (file: File | null) => {
  errorAuth.value = ''
  if (userRegisterForm.password == userRegisterForm.confirm_password && userRegisterForm.password !== '') {
    if (userRegisterForm.username && userRegisterForm.email) {
      errorAuth.value = ''
      if (file) {
        const imgTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/tiff']
        if (!imgTypes.includes(file.type) || file.size > 1048576) {
          errorAuth.value = `Le fichier n'est pas au bon format ou sa taille est supérieur à 1Mo`
          return
        }
      }
      createUserWithEmailAndPassword(auth, userRegisterForm.email, userRegisterForm.password)
          .then(async (userCredential) => {
            // Add user to Firestore collection
            // Gérer les photos
            const userDocRef = doc(db, usersCollection, userCredential.user.uid)
            if (file) {
              if (!userRegisterForm.photo) {
                const fileType = file.type.split('/')[1]
                userRegisterForm.photo = `users/${userCredential.user.uid}.${fileType}`
              }
              const storageRef = referenceStockage(storage, userRegisterForm.photo)
              await uploadBytes(storageRef, file)
            }
            await setDoc(userDocRef, {
              id: userCredential.user.uid,
              email: userRegisterForm.email,
              username: userRegisterForm.username,
              firstname: userRegisterForm.firstName,
              lastname: userRegisterForm.lastName,
              created_at: serverTimestamp(),
              updated_at: null,
              photo: userRegisterForm.photo
            })
            const userSnapshot = await getDoc(userDocRef)
            userStore.setUser({ ...userCredential.user, ...userSnapshot.data()})
            FlashMessagesService.getInstance().success(`Compte créé avec succès !`)
            await router.push('/')
          })
          .catch(() => {
            errorAuth.value = `L'adresse mail ou le nom d'utilisateur existent déjà`
          })
    } else {
      errorAuth.value = `L'adresse mail et le nom d'utilisateur sont obligatoires`
    }
  }
  else {
    errorAuth.value = 'Les deux mots de passe ne sont pas identiques'
  }
}
</script>
