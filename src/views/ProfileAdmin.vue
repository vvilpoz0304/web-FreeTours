<script setup>
// Importamos todo lo necesario;
import router from '@/router';
import { ref  } from 'vue';
import UserManagement from '@/components/UserManagement.vue';
import RouteCreator from '@/components/RouteCreator.vue';
import RoutesManagement from '@/components/RoutesManagement.vue';

//En caso de acceder sin estar logueado te redirige a Login;
const props = defineProps({
    userAuth: Object
});

if (!props.userAuth) {
    router.push("/login");
}

//Comprobamos el rol del usuario logueado;
let rol = ref(JSON.parse(localStorage.getItem("session")).rol)

rol.value != 'admin' ? router.push(`/${rol.value}`) : null;

</script>
<template>
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                type="button" role="tab" aria-controls="home-tab-pane" onchange aria-selected="true">Gestion de
                Usuarios</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
                type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Creacion de
                Rutas</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane"
                type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Administracion de
                Rutas</button>
        </li>
    </ul>
    <!-- Añadimos las pestañas mediante bootstrap.-->
    <div v-if="userAuth && rol == 'admin'" class="container main">
        <!-- Pestañas del administrador -->
        <div class="tab-content" id="myTabContent">
            <!--Contenido de la ventana de Gestion de Usuarios-->
            <div class="tab-pane fade show active table-responsive w-100 border shadow" id="home-tab-pane"
                role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                <UserManagement :userAuth="session"></UserManagement>
            </div>
            <!--Contenido de la ventana de la Creacion de Rutas-->
            <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                <RouteCreator :userAuth="session"></RouteCreator>
            </div>
            <!--Contenido de la ventana de la cancelacion de rutas-->
            <div class="tab-pane fade routesList show w-75" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab"
                tabindex="0">
                <RoutesManagement :userAuth="session"></RoutesManagement>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>