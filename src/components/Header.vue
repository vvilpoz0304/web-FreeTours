<script setup>
import router from "@/router";
import { ref, computed } from "vue"

const emit = defineEmits(["sessionClosed"])

const props = defineProps({
    userAuth: Object
});

//Comprobamos el rol del usuario logueado;
const rol = computed(() => props.userAuth ? props.userAuth.rol : null); //Utilizamos computed para que se actualice el valor de rol cuando cambie el valor de userAuth

// Funcion para cerrar la sesion;
function logOut() {
    emit("sessionClosed", null);
    router.push({ name: "home" })
}

</script>

<template>
    <header class="text-white  p-3">
        <div>
            <img src="/images/logo.png" alt="Logo">
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
                                <img src="/images/perfil.png" alt="Perfil">
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li v-if="userAuth && rol === 'admin'">
                                    <RouterLink class="dropdown-item" to="/admin">Administrar</RouterLink>
                                </li>
                                <li v-else-if="userAuth && rol === 'guia'">
                                    <RouterLink class="dropdown-item" to="/guia">Mi guia</RouterLink>
                                </li>
                                <li v-else-if="userAuth && rol === 'cliente'">
                                    <RouterLink class="dropdown-item" to="/cliente">Mi usuario</RouterLink>
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
    background-color: #6bc472;
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
    border: none;
}

.nav-link {
    color: white;
    /* Color del texto */
    text-decoration: none;
    /* Eliminar subrayado */
    border-radius: 0.25em;
    /* Bordes redondeados */
    border: none !important;
    /* Eliminar borde */
}

.nav-link:hover {
    background-color: #5aa65a;
    /* Color de fondo al pasar el ratón */
    color: white;
    /* Color del texto al pasar el ratón */
}

#dropdownMenuButton1 {
    border: 0px;
    background-color: #6bc472;
    height: 4em;
}

.dropdown-item {
    display: flex;
    justify-content: center;
    width: 2em;
}

.dropdown-menu a {
    margin: 0%;
    padding: 0%;
    width: auto;
}

.dropdown-menu a:hover {
    background-color: lightgray !important;
}
</style>