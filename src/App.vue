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
  <div class="layout">
    <Header :userAuth="session" @session-closed="updateDataSesion" />
    
    <main class="content">
      <RouterView @sessionStarted="updateDataSesion" :userAuth="session"/>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* El contenedor ocupa toda la altura de la pantalla */
}

.content {
  flex: 1; /* Ocupa el espacio disponible y empuja el footer */
  overflow-y: auto; /* Permite desplazamiento si el contenido es grande */
}

footer {
  background: rgb(125, 179, 125);
  color: white;
  text-align: center;
  padding: 10px;
  width: 100%;
}
</style>