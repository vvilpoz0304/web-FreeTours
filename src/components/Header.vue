<script setup>
import router from "@/router";
import {ref} from "vue"


const emit = defineEmits(["sesionCerrada"])

const props = defineProps({
  title: String,
  usuarioAutenticado: Object
});

// const usuarioAutenticado = localStorage.getItem("sesion") ? ref(JSON.parse(localStorage.getItem('sesion'))) : ref(null);

function cerrarSesion() {

  emit("sesionCerrada", null);
  router.push({name:"home"})
}
</script>


<template>
    <header class="bg-dark text-white  p-3">
      <div class="row">
        <h1 class="col-8">{{ title }}</h1>
        <div class="col-4">

        <div v-if="usuarioAutenticado" class="container text-end">
          <span>Bienvenido, {{ usuarioAutenticado.usuario }} ({{ usuarioAutenticado.rol }})</span>
          <button @click.prevent="cerrarSesion" class="btn btn-danger">Cerrar Sesión</button>
        </div>
      </div>
      </div>
  </header>
</template>
  
 
<style scoped>

</style>
  