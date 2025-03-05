<script setup>
import { ref } from 'vue';
import router from '@/router';
import RutasReservadas from '@/components/BookedRoutes.vue';
import PastRoutes from '@/components/PastRoutes.vue';
// En caso de acceder sin estar logueado te redirige a Login;
const props = defineProps({
    userAuth: Object
});

if (!props.userAuth) {
    router.push("/login");
}

let rol = ref(JSON.parse(localStorage.getItem("session")).rol);
let email = props.userAuth.email;


</script>

<template>
    <!-- Pestañas para el cliente-->
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Rutas
                Reservadas</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
                type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Rutas
                Realizadas</button>
        </li>
    </ul>
    <div v-if="userAuth && rol == 'cliente'" class="container">
        <div class="tab-content" id="myTabContent">
            <!--Contenido de la ventana de Gestion de Usuarios-->
            <div class="tab-pane fade show active w-75" id="home-tab-pane"
                role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                <RutasReservadas :userAuth="userAuth"></RutasReservadas>
            </div>
            <div class="tab-pane fade w-75" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                <PastRoutes :userAuth="userAuth"></PastRoutes>
            </div>
        </div>
    </div>
</template>

<style scoped></style>