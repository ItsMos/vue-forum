<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="signIn" class="card card-form">
        <h1 class="text-center">Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="form.email"
            id="email"
            type="text"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="form.password"
            id="password"
            type="password"
            class="form-input"
          />
        </div>

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <router-link :to="{ name: 'Register' }"
            >Create an account?</router-link
          >
        </div>
      </form>

      <div class="push-top text-center">
        <button @click="signInWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
const { dispatch } = useStore()
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['ready'])

const form = {
  email: '',
  password: '',
}

async function signIn() {
  try {
    await dispatch('auth/signInWithEmailAndPassword', form)
    successRedirect()
  } catch (error) {
    alert(error.message)
  }
}

async function signInWithGoogle() {
  await dispatch('auth/signInWithGoogle')
  successRedirect()
}

function successRedirect() {
  const redirectTo = route.query.redirectTo || { name: 'Home' }
  router.push(redirectTo)
}

emit('ready')
</script>
