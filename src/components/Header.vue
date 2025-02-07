<script setup>
import router from "@/router";
import {ref} from "vue"
import NavBar from "./NavBar.vue";

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
        <nav class="navbar navbar-expand-lg navbar-light">
        
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a class="nav-link"><RouterLink to="/">Home</RouterLink></a>
                </li>
                <li v-if="datosUsuario?.rol=='profe'" class="nav-item active">
                    <a class="nav-link" href="#">Preguntas <span class="sr-only">(current)</span></a>
                </li>
                <li v-if="datosUsuario?.rol=='profe'" class="nav-item">
                    <a class="nav-link" href="#">Categorias</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Exámenes</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Resultados</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link"><RouterLink to="/login">Login</RouterLink></a>
                </li>
            </ul>
        </div>
    </nav>
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
  