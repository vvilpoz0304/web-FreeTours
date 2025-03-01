<script setup>
import { ref } from "vue";
import router from '@/router';

// En caso de acceder sin estar logueado te redirige a Login;
const props = defineProps({
    userAuth: Object
});

if (!props.userAuth) {
    router.push("/login");
}

let rol = ref(JSON.parse(localStorage.getItem("session")).rol);

let email = props.userAuth.email;

function getBooking(clientEmail) {
    fetch(`http://localhost/api.php/reservas?email=${clientEmail}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => console.log('Reservas del usuario:', data))
        .catch(error => console.error('Error:', error));

}

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
            <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab"
                tabindex="0">

            </div>
            <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                Rutas Realizadas
            </div>
        </div>
    </div>
</template>

<style scoped></style>