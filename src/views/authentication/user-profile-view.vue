<template>
  <div v-if="userStore.user">
    <div class="header fixed w-full top-0">
      <div class="z-20 relative mt-[19px] flex flex-col items-center">
        <div>
          <div v-if="!isEditMode">
            <img
              v-if="imgUrl"
              :src="imgUrl"
              alt=""
              class="w-[100px] h-[100px] rounded-full"
            >
            <div v-else class="rounded-full w-[100px] h-[100px] bg-gray-100" />
          </div>
          <div v-else class="relative">
            <div class="bg-[rgba(28,28,28,0.81)] absolute top-0 w-full h-full rounded-full flex items-center justify-center">
              <input-user-profile-photo @file-uploaded="updateFile" />
            </div>
            <img
              v-if="imgUrl"
              :src="imgUrl"
              alt=""
              class="w-[100px] h-[100px] rounded-full"
            >
            <div v-else class="rounded-full w-[100px] h-[100px] bg-gray-100" />
          </div>
        </div>
        <span class="text-white font-[400] text-[18px] mt-[5px]">{{ userStore.user.firstname }} {{ userStore.user.lastname }}</span>
      </div>
      <user-profile-svg id="header" class="absolute top-0 z-10 w-full" />
    </div>
    <div v-if="!isEditMode" class="content px-[15px]" :style="{ marginTop: `${headerSize}px` }">
      <div class="flex gap-[20px] items-center border-b border-b-[#ADAFBC] py-[13px]">
        <user-profile-icon />
        <span>{{ userStore.user.firstname }}</span>
      </div>
      <div class="flex gap-[20px] items-center border-b border-b-[#ADAFBC] py-[13px]">
        <user-profile-icon />
        <span>{{ userStore.user.lastname }}</span>
      </div>
      <div class="flex gap-[20px] items-center border-b border-b-[#ADAFBC] py-[13px]">
        <user-profile-icon />
        <span>{{ userStore.user.username }}</span>
      </div>
      <div class="flex gap-[20px] items-center border-b border-b-[#ADAFBC] py-[13px]">
        <email-icon />
        <span>{{ userStore.user.email }}</span>
      </div>
    </div>
    <div v-else class="content px-[15px]" :style="{ marginTop: `${headerSize}px` }">
      <div class="flex gap-[20px] items-center border-b border-b-[#ADAFBC]">
        <user-profile-icon />
        <input v-model="userEditForm.firstname" type="text" class="py-[13px] w-full">
      </div>
      <div class="flex gap-[20px] items-center border-b border-b-[#ADAFBC]">
        <user-profile-icon />
        <input v-model="userEditForm.lastname" type="text" class="py-[13px] w-full">
      </div>
      <div class="flex gap-[20px] items-center border-b border-b-[#ADAFBC]">
        <user-profile-icon />
        <input v-model="userEditForm.username" type="text" class="py-[13px] w-full">
      </div>
      <div class="flex gap-[20px] items-center border-b border-b-[#ADAFBC]">
        <email-icon />
        <input v-model="userEditForm.email" type="email" class="py-[13px] w-full">
      </div>
      <div class="flex gap-[20px] items-center border-b border-b-[#ADAFBC]">
        <password-icon />
        <input
          v-model="userEditForm.password"
          type="password"
          class="py-[13px] w-full"
          placeholder="Mot de passe"
        >
      </div>
      <div class="flex gap-[20px] items-center border-b border-b-[#ADAFBC]">
        <password-icon />
        <input
          v-model="userEditForm.confirm_password"
          type="password"
          class="py-[13px] w-full"
          placeholder="Confirmation du mot de passe"
        >
      </div>
    </div>
    <div v-if="error" class="flex justify-center mt-[20px] px-[15px]">
      <error-banner class="w-full">
        {{ error }}
      </error-banner>
    </div>
    <div class="relative h-[150px] mt-[50px]">
      <div class="flex justify-center w-full absolute bottom-[20px]">
        <div v-if="!isEditMode" class="flex flex-col w-full items-center gap-[20px]">
          <primary-button-reversed class="w-[60%] text-[14px] font-[400] text-[#FF7373] border-[#FF7373]" type="button" @click="isOpenModalLogout = true">
            Déconnexion
          </primary-button-reversed>
          <primary-button class="w-[60%] text-[14px] font-[400] bg-[#FF7373]" @click="isEditMode = true">
            Modifier le profil
          </primary-button>
        </div>
        <div v-else class="flex gap-[15px] w-full px-[15px]">
          <primary-button class="w-[60%] text-[14px] font-[400] bg-[#FF7373]" type="submit" @click.prevent="editUser()">
            Confirmer
          </primary-button>
          <primary-button-reversed class="w-[60%] text-[14px] font-[400] text-[#FF7373] border-[#FF7373]" type="button" @click="isEditMode = false">
            Annuler
          </primary-button-reversed>
        </div>
      </div>
    </div>
    <div v-if="openModalPassword" class="overlay h-screen w-full bg-[rgba(0,0,0,0.7)] absolute top-0 z-10" @click="openModalPassword = false" />
    <div v-if="openModalPassword" class="modal bg-white z-20 absolute w-[80%] h-[250px] top-[50%] left-[50%] rounded-[15px] shadow flex flex-col items-center justify-center">
      <span class="text-[#434242] text-[20px] font-[400] text-center">Saisir votre mot de passe actuel</span>
      <input
        v-model="userPassword"
        type="password"
        class="mt-[20px] w-[80%] py-[13px] border rounded-full shadow px-[5px]"
        placeholder="Votre mot de passe"
      >
      <div class="flex gap-[20px] items-center justify-center w-full mt-[20px]">
        <primary-button class="w-[30%]" @click="editUser">
          Confirmer
        </primary-button>
        <primary-button-reversed class="w-[30%]" @click="openModalPassword = false">
          Annuler
        </primary-button-reversed>
      </div>
    </div>
    <div v-if="isOpenModalLogout" class="overlay h-screen w-full bg-[rgba(0,0,0,0.7)] absolute top-0 z-10" @click="isOpenModalLogout = false" />
    <div v-if="isOpenModalLogout" class="modal bg-white z-20 absolute w-[80%] h-[200px] top-[50%] left-[50%] rounded-[15px] shadow flex flex-col items-center justify-center">
      <span class="text-[#434242] text-[20px] font-[400] text-center">Se déconnecter ?</span>
      <div class="flex gap-[20px] items-center justify-center w-full mt-[20px]">
        <primary-button class="w-[30%]" @click="logoutUser()">
          Confirmer
        </primary-button>
        <primary-button-reversed class="w-[30%]" @click="isOpenModalLogout = false">
          Annuler
        </primary-button-reversed>
      </div>
    </div>
    <div v-if="isOpenModalPreview" class="overlay h-screen w-full bg-[rgba(0,0,0,0.7)] absolute top-0 z-10" @click="isOpenModalPreview = false" />
    <div v-if="isOpenModalPreview" class="modal bg-white z-20 absolute w-[80%] h-[250px] top-[50%] left-[50%] rounded-[15px] shadow flex flex-col items-center justify-center">
      <span class="text-[#434242] text-[20px] font-[400] text-center">Prévisualisation de la photo</span>
      <img
        :src="previewImage"
        alt=""
        class="w-[100px] h-[100px] rounded-full mt-[20px]"
      >
      <div class="flex gap-[20px] items-center justify-center w-full mt-[20px]">
        <primary-button class="w-[30%]" @click="confirmFileUpload">
          Confirmer
        </primary-button>
        <primary-button-reversed class="w-[30%]" @click="cancelFileUpload">
          Annuler
        </primary-button-reversed>
      </div>
    </div>
    <div v-if="isPreloading" class="overlay h-screen w-full bg-[rgba(0,0,0,0.7)] absolute top-0 z-30" />
    <loader v-if="isPreloading" class="modal z-40 absolute top-[50%] left-[50%]" />
  </div>
</template>

<script lang="ts" setup>
import UserProfileSvg from '@/components/icons/user-profile-svg.vue';
import { useUserStore } from '@/store/userStore';
import { onMounted, reactive, Ref, ref as reference } from 'vue';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '@/firebase';
import UserProfileIcon from '@/components/icons/user-profile-icon.vue';
import EmailIcon from '@/components/icons/email-icon.vue';
import PrimaryButton from '@/components/buttons/primary-button.vue';
import PrimaryButtonReversed from '@/components/buttons/primary-button-reversed.vue';
import PasswordIcon from '@/components/icons/password-icon.vue';
import InputUserProfilePhoto from '@/components/inputs/input-user-profile-photo.vue';
import ErrorBanner from '@/components/banners/error-banner.vue';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from 'firebase/auth'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import FlashMessagesService from '@/services/FlashMessagesService';
import Loader from '@/components/loader/loader-component.vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const userStore = useUserStore()
const imgUrl = reference("")
const isEditMode = reference(false)
const file: Ref<File | null> = reference(null)
const userEditForm = reactive({
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
  confirm_password: '',
  photo: '',
})
const userPassword = reference('')
const error = reference('')
const openModalPassword = reference(false)
const isOpenModalPreview = reference(false)
const isOpenModalLogout = reference(false)
const previewImage = reference('')
const isPreloading = reference(false)
const headerSize = reference<number | null>(null)

onMounted(async () => {
  if (userStore.user) {
    headerSize.value = document.getElementById('header')?.clientHeight || 0;
    userEditForm.firstname = userStore.user.firstname
    userEditForm.lastname = userStore.user.lastname
    userEditForm.username = userStore.user.username
    userEditForm.email = userStore.user.email
    userEditForm.photo = userStore.user.photo
    if (userStore.user.photo) {
      imgUrl.value = await getDownloadURL(ref(storage, userStore.user.photo))
    }
  }
})

const updateFile = (event: Event) => {
  const files = (event.target as HTMLInputElement).files as FileList
  file.value = files[0]
  previewImage.value = URL.createObjectURL(file.value)
  isOpenModalPreview.value = true
}

const confirmFileUpload = () => {
  isOpenModalPreview.value = false
  previewImage.value = ''
}
const cancelFileUpload = () => {
  file.value = null
  isOpenModalPreview.value = false
}

const logoutUser = async () => {
  await signOut(auth)
  userStore.setUser(null)
  await router.push('/login')
  FlashMessagesService.getInstance().success('Vous vous êtes déconnecté')
}

const editUser = async () => {
  error.value = ''
  openModalPassword.value = false
  isPreloading.value = true
  if (userPassword.value && auth.currentUser && auth.currentUser.email) {
    const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        userPassword.value
    )
    await reauthenticateWithCredential(auth.currentUser, credential)
      .catch(() => {
        error.value = `Le mot de passe est incorrect`
      })
      .finally(() => userPassword.value = '')
  }
  if (error.value) {
    isPreloading.value = false
    return
  }
  const userRef = await doc(db, "users", userStore.user?.uid || '')
  let needToChangeMail = false
  let needToChangePassword = false
  let needToUploadPhoto = false
  if (userEditForm.username && userEditForm.email && userStore.user) {
    if (userEditForm.email !== userStore.user.email && auth.currentUser) {
      needToChangeMail = true
    }
    if (userEditForm.password) {
      if (userEditForm.password === userEditForm.confirm_password) {
        if (userEditForm.password.length > 6) {
          needToChangePassword = true
        } else {
          error.value = `Le nouveau mot de passe doit faire plus de 6 caractères`
          isPreloading.value = false
          return
        }
      } else {
        error.value = `Les deux mots de passe ne sont pas identiques`
        isPreloading.value = false
        return
      }
    }
    if (file.value) {
      // Convertir le type en fonction de la photo (jpg / png)
      const fileType = file.value.type.split('/')[1]
      const imgTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/tiff']
      if (!imgTypes.includes(file.value.type) || file.value.size > 1048576) {
        error.value = `Le fichier n'est pas au bon format ou sa taille est supérieur à 1Mo`
        isPreloading.value = false
        return
      }
      if (!userEditForm.photo) {
        userEditForm.photo = `users/${userStore.user.uid}.${fileType}`
      }
      needToUploadPhoto = true
    }

    if (needToChangeMail && auth.currentUser){
      await updateEmail(auth.currentUser, userEditForm.email)
        .catch((err) => {
          if (err.code === 'auth/requires-recent-login') {
            openModalPassword.value = true
            error.value = `Veuillez saisir votre mot de passe`
          } else {
            error.value = `L'adresse e-mail est déjà utilisée`
          }
        })
    }
    if (needToUploadPhoto && file.value && !error.value) {
      const storageRef = ref(storage, userEditForm.photo)
      await uploadBytes(storageRef, file.value)
      imgUrl.value = await getDownloadURL(storageRef)
    }

    if (needToChangePassword && auth.currentUser && !error.value){
      await updatePassword(auth.currentUser, userEditForm.password)
          .catch((err) => {
            if (err.code === 'auth/requires-recent-login') {
              openModalPassword.value = true
              error.value = `Veuillez saisir votre mot de passe`
            }
          })
    }

    // Update Document
    if (error.value) {
      isPreloading.value = false
      return
    }
    await updateDoc(userRef, {
      username: userEditForm.username,
      firstname: userEditForm.firstname,
      lastname: userEditForm.lastname,
      email: userEditForm.email,
      updated_at: serverTimestamp(),
      photo: userEditForm.photo
    })

    isEditMode.value = false
    userStore.user.firstname = userEditForm.firstname
    userStore.user.lastname = userEditForm.lastname
    userStore.user.username = userEditForm.username
    userStore.user.email = userEditForm.email
    userStore.user.photo = userEditForm.photo
    isPreloading.value = false
    FlashMessagesService.getInstance().success(`Profil mis à jour !`)

  } else {
    error.value = `Veuillez saisir une adresse e-mail et un nom d'utilisateur`
  }
}

// await updateEmail(auth.currentUser, userEditForm.email)
//     .catch(() => error.value = `L'adresse e-mail est déjà utilisée`)

// await updatePassword(auth.currentUser, userEditForm.password)
//     .catch(() => error.value = `Le mot de passe est incorrect`);

// const storageRef = ref(storage, userEditForm.photo)
// await uploadBytes(storageRef, file.value)

</script>
