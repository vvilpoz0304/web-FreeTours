<script setup>
import router from '../router';
import { ref } from 'vue';

const props = defineProps({
    datosUsuario:Object
})


const usuario = props.datosUsuario;

</script>
<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Navbar</a>
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
</template>