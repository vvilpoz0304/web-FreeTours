<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header.vue';
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <Header/>
  <NavBar/>
  <RouterView />
  <Footer/>
</template>

<style scoped>
.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
</style>
