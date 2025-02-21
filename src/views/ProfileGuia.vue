<script setup>
import { ref } from "vue";


//En caso de acceder sin estar logueado te redirige a Login;
const props = defineProps({
    userAuth: Object
});

if (!props.userAuth) {
    router.push("/login");
}

let rol = ref(JSON.parse(localStorage.getItem("session")).rol)
</script>

<template>
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Rutas Asignadas</button>
        </li>
    </ul>
    <div v-if="userAuth && rol == 'guia'" class="container">
        <div class="tab-content" id="myTabContent">
            <!--Contenido de la ventana de Gestion de Usuarios-->
            <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab"
                tabindex="0">
                <ul>
                    <li>Rutas asignadas</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped></style>