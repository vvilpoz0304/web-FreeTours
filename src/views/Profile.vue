<script setup>
// Importamos todo lo necesario;
import router from '@/router';
import { onMounted, ref } from 'vue';

//En caso de acceder sin estar logueado te redirige a Login;
const props = defineProps({
    userAuth: Object
});

console.log(props.userAuth);

if(!props.userAuth){
    router.push("/login");
}

//Comprobamos el rol del usuario logueado;
let rol = ref(JSON.parse(localStorage.getItem("session")).rol)

// Declaramos la URL para la API para mostrar todos los usuarios
const API = "http://localhost/freetours/api.php"
let users = ref([]);

// Conseguimos un array con los usuarios mediante un fetch;
async function getData() {
    try {
        const response = await fetch(API + "/usuarios");

        if (!response.ok) {
            throw new Error("No tengo ni idea de lo que estoy haciendo;");
        }

        users.value = await response.json(); // Guardamos los datos en la variable global
    } catch (error) {
        alert(`Error al obtener datos: ${error.message}`);
    }
}

onMounted(getData); // Utilizamos onMounted para que cargue los datos una vez se haya caragdo los componentes;

// Función para actualizar el Rol de un usuario;

function updateRol(id, rol){
    fetch(`http://localhost/freetours/api.php/usuarios?id=${id}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({rol: rol})
})
.then(response => response.json())
.then(data => console.log('Respuesta:', data))
.catch(error => console.error('Error:', error));

}

// Funcion para eliminar un usuario
function deleteUser(id){
    fetch(`http://localhost/freetours/api.php/usuarios?id=${id}`, {
    method: 'DELETE',
})
.then(getData())
.catch(error => console.error('Error:', error));

}

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
            <div class="tab-pane fade show active table-responsive w-75 border" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab"
                tabindex="0">
                <table class="table table-bordered">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Administrar</th>
                    </tr>
                    <tr v-for="(user) in users" :key=user.id>
                        <td>{{ user.id }}</td>
                        <td>{{ user.nombre }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <select v-model="user.rol" @change="updateRol(user.id, user.rol)" name="rol" id="userRol">
                                <option value="admin">Admin</option>
                                <option value="guia">Guia Turistico</option>
                                <option value="cliente">Cliente</option>
                            </select>
                        </td>
                        <td><button @click="deleteUser(user.id)">Eliminar Usuario</button></td>
                    </tr>
                </table>
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
    #myTabContent{
        margin: 2em 2em;
        display: flex;
        justify-content: center;
    }
</style>