<script setup>
import { ref } from 'vue';
import router from './router'
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';


const session = ref(localStorage.getItem("session"));

function updateDataSesion(user) {
  session.value = user;

  if (user) {
    localStorage.setItem("session", JSON.stringify(user));
    router.push("/home");
  } else {

    localStorage.removeItem("session");
  }
}

</script>

<template>
  <Header :userAuth="session" @session-closed="updateDataSesion" />
  <RouterView @sessionStarted="updateDataSesion" :userAuth="session"/>
  <Footer />
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
