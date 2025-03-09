<script setup>
import router from "@/router";
import { computed } from "vue";

const emit = defineEmits(["sessionClosed"]);

const props = defineProps({
    userAuth: Object
});

// Computed para el rol del usuario
const rol = computed(() => (props.userAuth ? props.userAuth.rol : null));

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
                <!-- Logo -->
                <img src="/images/logo.png" alt="Logo" class="img-fluid" style="max-width: 60px;">
                <h1 class="mb-0 ms-3">Yogui-ri</h1>
            </div>

            <!-- Menú de Navegación -->
            <nav class="navbar navbar-expand-md navbar-light">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul class="navbar-nav ms-auto text-center">
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/">Home</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/sobreNosotros">Quienes Somos</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/login" v-if="!userAuth">Iniciar Sesión</RouterLink>
                        </li>
                    </ul>

                    <!-- Menú de usuario -->
                    <div class="dropdown ms-3" v-if="userAuth">
                        <button class="btn btn-secondary dropdown-toggle d-flex align-items-center" type="button"
                            id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="/images/perfil.png" alt="Perfil" class="img-fluid me-2" style="max-width: 60px; height: auto;">
                            <span class="visually-hidden">Abrir menú de usuario</span>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
                            <li v-if="rol === 'admin'">
                                <RouterLink class="dropdown-item" to="/admin">Administrar</RouterLink>
                            </li>
                            <li v-else-if="rol === 'guia'">
                                <RouterLink class="dropdown-item" to="/guia">Mi guía</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" to="/cliente">Mis Rutas</RouterLink>
                            </li>
                            <li>
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
/* Estilos generales del header */
header {
    background-color: #6bc472;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    width: 100%;
}

h1 {
    font-size: 1.8rem;
    font-weight: 700;
    white-space: nowrap;
}

/* Ajustes para el Navbar */
.navbar-nav {
    display: flex;
    align-items: center;
    gap: 15px;
}

.navbar-toggler {
    border: none;
}

.nav-link {
    padding: 1.5em 3em;
    border: none !important;
    outline: none !important;
}

#dropdownMenuButton1 {
    border: 0px;
    background-color: #6bc472;
    height: 4em;
}

.nav-link:hover {
    background-color: #54985a;
}

/* Estilos del menú desplegable */
.dropdown-menu {
    font-size: 1.1rem;
    min-width: 180px;
}

.dropdown-item {
    padding: 10px 15px;
}
.dropdown-item:active {
    background-color: lightgray;
    color: black;
}
</style>
