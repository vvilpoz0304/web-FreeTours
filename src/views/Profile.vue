<script setup>
// Importamos todo lo necesario;
import router from '@/router';
import { ref } from 'vue';

//En caso de acceder sin estar logueado te redirige a Login;

const props = defineProps({
    userAuth: Object
});

console.log(props.userAuth);

if(!props.userAuth){
    router.push("/login");
}

// Declaramos la URL para la API para mostrar todos los usuarios
const API = "http://localhost/freetours/api.php"
let users = ref([]);

// Conseguimos un array con los usuarios mediante un fecth;
async function getData() {
    try {
        const response = await fetch(API + "/usuarios");

        if (!response.ok) {
            throw new Error("No tengo ni idea de lo que estoy haciendo;");
        }

        users.value = await response.json(); // Guardamos los datos en la variable global
        console.log("Usuarios obtenidos correctamente:", users);
    } catch (error) {
        alert(`Error al obtener datos: ${error.message}`);
    }
}

getData().then(() => {
    users.value = users.value.map(e => ({ Nombre: e.nombre, Email: e.email, Rol: e.rol }));
    console.log(users);
})

let rol = ref(JSON.parse(localStorage.getItem("session")).rol)

</script>
<template>
    <!-- Añadimos las pestañas mediante bootstrap.
    Mostraremos unas u otras dependiendo del rol del usuario registrado
    esto  lo haremos mediante el condional "v-if" -->
    <div v-if="rol==='admin'">
        <!-- Pestañas del administrador -->
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                    type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Gestion de Usuarios</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
                    type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Creacion de Rutas</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane"
                    type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Cancelacion de Rutas</button>
            </li>
        </ul>
        <div class="tab-content" id="myTabContent">
            <!--Contenido de la ventana de Gestion de Usuarios-->
            <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab"
                tabindex="0">
                <ul>
                    <li v-for="user in users">Nombre: {{ user.Nombre }}</li>
                </ul>
            </div>
            <!--Contenido de la ventana de la Creacion de Rutas-->
            <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                Pestaña para la creacion de rutas
            </div>
            <!--Contenido de la ventana de la cancelacion de rutas-->
            <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
                Pestaña para la cancelacion de rutas
            </div>
            <div class="tab-pane fade" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab"
                tabindex="0">...</div>
        </div>
    </div>
    <div v-if="rol==='guia'">
        <!-- Pestañas del administrador -->
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                    type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Rutas Asignadas</button>
            </li>
        </ul>
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
    <div v-if="rol==='cliente'">
        <!-- Pestañas del administrador -->
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                    type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Rutas Reservadas</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
                    type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Rutas Realizadas</button>
            </li>
        </ul>
        <div class="tab-content" id="myTabContent">
            <!--Contenido de la ventana de Gestion de Usuarios-->
            <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab"
                tabindex="0">
                <ul>
                    <li>Rutas reservadas</li>
                </ul>
            </div>
            <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                Rutas Realizadas
            </div>
        </div>
    </div>
</template>

<style scoped>
    button{
        background-color: lightgreen;
        color: black;
    }
    /*
    "aria-selected" es la clase que se le asigna automaticamente a la tab activa
     !!important se usa para sobrescribir los estilos de Bootstrap.
    */
    .nav-tabs .nav-link[aria-selected="true"] {
    background-color: rgb(101, 172, 101) !important;
    color: white !important; 
    font-weight: bold;
}
</style>