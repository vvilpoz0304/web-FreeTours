<script setup>
import { ref } from 'vue';
import router from './router'
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';


const session = ref(JSON.parse(localStorage.getItem("session")));

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
  <div class="layout">
    <Header :userAuth="session" @session-closed="updateDataSesion" />
    
    <main class="content">
      <RouterView @sessionStarted="updateDataSesion" :userAuth="session"/>
    </main>

    <Footer />
  </div>
</template>

<style scoped>

html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* Oculta cualquier desbordamiento lateral */
  height: 100%; /* Asegura que el body tenga altura completa */
}
.content {
  flex: 1;
  overflow: hidden; /* Evita que Vue cree un scroll dentro del div */
}
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* El contenedor ocupa toda la altura de la pantalla */
}

footer {
  background: rgb(125, 179, 125);
  color: white;
  text-align: center;
  padding: 10px;
  width: 100%;
}
</style>