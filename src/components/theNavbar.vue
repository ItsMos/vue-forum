<template>
  <header
    class="header"
    id="header"
    v-click-outside="() => (mobileNavMenu = false)"
    v-page-scroll="() => (mobileNavMenu = false)"
  >
    <router-link :to="{ name: 'Home' }" class="logo">
      <img src="../assets/svg/vueschool-logo.svg" />
    </router-link>

    <div class="btn-hamburger" @click="mobileNavMenu = !mobileNavMenu">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <nav class="navbar" :class="{ 'navbar-open': mobileNavMenu }">
      <ul>
        <li v-if="user" class="navbar-user">
          <a
            v-click-outside="() => (userDropdownOpen = false)"
            @click.prevent="userDropdownOpen = !userDropdownOpen"
            id="user-dropdown-toggle"
          >
            <img
              class="avatar-small"
              :src="user.avatar"
              :alt="`${user.name} profile picture`"
            />
            <span>
              {{ user.name }}
              <img
                class="icon-profile"
                src="../assets/svg/arrow-profile.svg"
                alt=""
              />
            </span>
          </a>
          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{ 'active-drop': userDropdownOpen }">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li v-if="user" class="dropdown-menu-item">
                <router-link :to="{ name: 'Profile' }"
                  >View profile</router-link
                >
              </li>
              <li v-if="user" class="dropdown-menu-item">
                <a
                  @click.prevent="
                    $store.dispatch('auth/signOut'),
                      $router.push({ name: 'Home' })
                  "
                  >Sign Out</a
                >
              </li>
            </ul>
          </div>
        </li>
        <li v-if="!user" class="navbar-item">
          <router-link :to="{ name: 'SignIn' }">Sign In</router-link>
        </li>
        <li v-if="!user" class="navbar-item">
          <router-link :to="{ name: 'Register' }">Register</router-link>
        </li>
        <li v-if="user" class="navbar-mobile-item">
          <router-link :to="{ name: 'Profile' }">View Profile</router-link>
        </li>
        <li v-if="user" class="navbar-mobile-item">
          <a
            @click.prevent="
              $store.dispatch('auth/signOut'), $router.push({ name: 'Home' })
            "
          >
            Sign Out</a
          >
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const { getters } = useStore()
const router = useRouter()

const user = computed(() => getters['auth/authUser'])
const mobileNavMenu = ref(false)
const userDropdownOpen = ref(false)

router.beforeEach(() => {
  mobileNavMenu.value = false
})
</script>
