<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <Header/>
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
