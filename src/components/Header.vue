<script setup>
import router from "@/router";
import { computed } from "vue";

const emit = defineEmits(["sessionClosed"]);

const props = defineProps({
    userAuth: Object
});

// Computed para el rol del usuario
const rol = computed(() => props.userAuth ? props.userAuth.rol : null);

// Función para cerrar sesión
function logOut() {
    emit("sessionClosed", null);
    router.push({ name: "home" });
}
</script>

<template>
    <header class="text-white p-3">
        <div class="container d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
                <img src="/images/logo.png" alt="Logo">
                <h1 class="mb-0">Yogui-ri</h1>
            </div>

            <!-- Menú colapsable en dispositivos pequeños -->
            <nav class="navbar navbar-expand-lg navbar-light">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <RouterLink :userAuth="userAuth" class="nav-link" to="/">Home</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/sobreNosotros">Quienes Somos</RouterLink>
                        </li>
                    </ul>

                    <!-- Menú de usuario -->
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="/images/perfil.png" alt="Perfil">
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li v-if="userAuth && rol === 'admin'">
                                <RouterLink class="dropdown-item" to="/admin">Administrar</RouterLink>
                            </li>
                            <li v-else-if="userAuth && rol === 'guia'">
                                <RouterLink class="dropdown-item" to="/guia">Mi guía</RouterLink>
                            </li>
                            <li v-if="userAuth">
                                <RouterLink class="dropdown-item" to="/cliente">Mi Rutas</RouterLink>
                            </li>
                            <li v-else>
                                <RouterLink class="dropdown-item" to="/login">Iniciar Sesión</RouterLink>
                            </li>
                            <li v-if="userAuth">
                                <a class="dropdown-item text-danger" @click="logOut">Cerrar Sesión</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
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