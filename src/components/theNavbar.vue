<template>
  <header class="header" id="header">

    <router-link :to="{name: 'Home'}" class="logo">
      <img src="../assets/svg/vueschool-logo.svg">
    </router-link>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar">
      <ul>

        <li v-if="user" class="navbar-user">
          <a
            v-click-outside="()=> userDropdownOpen = false"
            @click.prevent="userDropdownOpen = !userDropdownOpen"
            id="user-dropdown-toggle"
          >
            <img class="avatar-small" :src="user.avatar" :alt="`${user.name}'s profile picture`">
            <span>
              {{user.name}}
              <img class="icon-profile" src="../assets/svg/arrow-profile.svg" alt="">
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{'active-drop': userDropdownOpen}" @click="userDropdownOpen = false">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item"><router-link :to="{name: 'Profile'}">View profile</router-link></li>
              <li class="dropdown-menu-item">
                <a @click.prevent="$store.dispatch('auth/signOut')">Sign Out</a>
              </li>
            </ul>
          </div>
        </li>
        <li v-if="!user" class="navbar-item"><router-link :to="{name: 'SignIn'}">Sign In</router-link></li>
        <li v-if="!user" class="navbar-item"><router-link :to="{name: 'Register'}">Register</router-link></li>
      </ul>

      <ul>
        <li class="navbar-item">
          <router-link :to="{name: 'Home'}">Home</router-link>
        </li>
        <!--
        Show these option only on mobile
        <li class="navbar-item mobile-only">
          <router-link to="/profile">My Profile</router-link>
        </li>
        <li class="navbar-item mobile-only">
          <router-link to="#">Logout</router-link>
        </li> -->
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('auth', { user: 'authUser' })
  },
  data() {
    return {
      userDropdownOpen: false
    }
  }
}

</script>
