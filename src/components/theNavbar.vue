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
          <router-link :to="{name: 'Profile'}">
            <img class="avatar-small" :src="user.avatar" :alt="`${user.name}'s profile picture`">
            <span>
              {{user.name}}
              <img class="icon-profile" src="../assets/svg/arrow-profile.svg" alt="">
            </span>
          </router-link>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item"><router-link to="profile.html">View profile</router-link></li>
              <li class="dropdown-menu-item"><router-link to="#">Log out</router-link></li>
            </ul>
          </div>
        </li>
        <li @click="$store.dispatch('signOut')" v-if="user" class="navbar-item"><a>Sign Out</a></li>
        <li v-if="!user" class="navbar-item"><router-link :to="{name: 'SignIn'}">Sign In</router-link></li>
        <li v-if="!user" class="navbar-item"><router-link :to="{name: 'Register'}">Register</router-link></li>
      </ul>

      <ul>
        <li class="navbar-item">
          <router-link :to="{name: 'Home'}">Home</router-link>
        </li>
        <!-- <li class="navbar-item">
          <router-link to="/category">Category</router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/forum">Forum</router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/thread">Thread</router-link>
        </li>
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
    ...mapGetters({ user: 'authUser' })
  }
}

</script>

<style>

</style>
