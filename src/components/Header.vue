<script setup>
import router from "@/router";
import { ref } from "vue"

const emit = defineEmits(["sessionClosed"])

const props = defineProps({
    userAuth: Object
});

// const usuarioAutenticado = localStorage.getItem("sesion") ? ref(JSON.parse(localStorage.getItem('sesion'))) : ref(null);

function logOut() {

    emit("sessionClosed", null);
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
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="../assets/images/perfil.png" alt="Perfil">
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li v-if="userAuth">
                                    <RouterLink class="dropdown-item" to="/profile">Perfil</RouterLink>
                                </li>
                                <li v-else>
                                    <RouterLink class="dropdown-item" to="/login">Iniciar Sesión</RouterLink>
                                </li>
                                <li v-if="userAuth">
                                    <a class="dropdown-item" @click="logOut">Cerrar Sesión</a>
                                </li>
                            </ul>
                        </div>
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

header div {
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

nav li {
    margin: 0em 5em 0em 5em;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

#dropdownMenuButton1 {
    border: 0px;
    background-color: rgb(125, 179, 125);
    height: 4em;
}

.dropdown-item {
    display: flex;
    justify-content: center;
    width: 2em;
}
</style>