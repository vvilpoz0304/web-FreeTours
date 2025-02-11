<script setup>
import router from "@/router";
import { ref } from "vue"


const emit = defineEmits(["sesionCerrada"])

const props = defineProps({
    userAuth: Object
});

// const usuarioAutenticado = localStorage.getItem("sesion") ? ref(JSON.parse(localStorage.getItem('sesion'))) : ref(null);

function cerrarSesion() {

    emit("sesionCerrada", null);
    router.push({ name: "home" })
}

</script>


<template>
    <header class="text-white  p-3">
        <div>
            <img src="../assets/images/logo.png" alt="Logo">
            <h1>Yogui-ri</h1>
        </div>
        <nav class="navbar navbar-expand-lg navbar-light">
            
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link">
                            <RouterLink to="/home">Home</RouterLink>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Quiénes somos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" v-if="userAuth">
                            <RouterLink to="/profile"><img src="../assets/images/perfil.png" alt="Perfil"></RouterLink>
                        </a>
                        <a class="nav-link" v-else>
                            <RouterLink to="/login"><img src="../assets/images/perfil.png" alt="Perfil"></RouterLink>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>


<style scoped>
header {
    background-color: rgb(125, 179, 125);
    display: flex;
    align-items: center;
    justify-content: space-between;
}
header div{
    display: flex;
    align-items: center;
}
img {
    width: 4em;
    height: auto;
    margin: 0em 3em 0em 2em;
}

nav {
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}
nav li{
    margin: 0em 5em 0em 5em;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

</style>