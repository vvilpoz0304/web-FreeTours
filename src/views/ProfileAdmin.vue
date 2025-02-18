<script setup>
// Importamos todo lo necesario;
import router from '@/router';
import { onMounted, ref } from 'vue';
import { Modal } from "bootstrap";


//En caso de acceder sin estar logueado te redirige a Login;
const props = defineProps({
    userAuth: Object
});

console.log(props.userAuth);

if (!props.userAuth) {
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
function updateRol(id, rol) {
    fetch(`http://localhost/freetours/api.php/usuarios?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rol: rol })
    })
        .then(response => response.json())
        .then(data => console.log('Respuesta:', data))
        .catch(error => console.error('Error:', error));

}
const selectedUser = ref(null); // Variable del usuario seleccionado que que claramos para manejarlo mediante el modal
let modalInstance = null;  // Declaramos una variable para instanciar el modal

// Cargar el modal al montar el componente
onMounted(() => {
    modalInstance = new Modal(document.getElementById("deleteModal"));
});

// Abrir el modal y asignar el usuario seleccionado
function openModal(user) {
    selectedUser.value = user;
    modalInstance.show(); // Mostramos el modal
}

// Funcion para eliminar un usuario
function deleteUser(id) {
    fetch(`http://localhost/freetours/api.php/usuarios?id=${id}`, {
        method: 'DELETE',
    })
        .then(() => getData()) // Llamar getData() solo cuando DELETE haya finalizado
        .catch(error => console.error('Error:', error));
    modalInstance.hide();
}

</script>
<template>
     <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                    type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Gestion de
                    Usuarios</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
                    type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Creacion de
                    Rutas</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane"
                    type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Cancelacion de
                    Rutas</button>
            </li>
        </ul>
    <!-- Añadimos las pestañas mediante bootstrap.
    Mostraremos unas u otras dependiendo del rol del usuario registrado
    esto  lo haremos mediante el condional "v-if" -->
    <div v-if="userAuth && rol == 'admin'" class="container main">
        <!-- Pestañas del administrador -->
        <div class="tab-content" id="myTabContent">
            <!--Contenido de la ventana de Gestion de Usuarios-->
            <div class="tab-pane fade show active table-responsive w-100 border shadow" id="home-tab-pane" role="tabpanel" 
                aria-labelledby="home-tab" tabindex="0">
                <table class="table table-striped table-hover align-middle">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Administrar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user) in users" :key=user.id>
                            <td>{{ user.id }}</td>
                            <td>{{ user.nombre }}</td>
                            <td>{{ user.email }}</td>
                            <td v-if="user.rol == 'admin'">
                                <p>Admin</p>
                            </td>
                            <td v-else>
                                <select v-model="user.rol" @change="updateRol(user.id, user.rol)" name="rol"
                                    id="userRol">
                                    <option value="guia">Guia Turistico</option>
                                    <option value="cliente">Cliente</option>
                                </select>
                            </td>
                            <td><button type="button" @click="openModal(user)" class="deleteButton"><img src="../assets/images/papelera.png"  alt="papelera"></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!--Contenido de la ventana de la Creacion de Rutas-->
            <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                <form class="container p-4 border rounded shadow">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="titulo" class="form-label">Título de la ruta:</label>
                            <input type="text" id="titulo" name="titulo" class="form-control"
                                placeholder="Título de la ruta">
                        </div>
                        <div class="col-md-6">
                            <label for="localidad" class="form-label">Localidad:</label>
                            <input type="text" id="localidad" name="localidad" class="form-control"
                                placeholder="Localización">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="desc" class="form-label">Descripción:</label>
                        <textarea id="desc" name="desc" class="form-control" rows="3"
                            placeholder="Descripción de la ruta"></textarea>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="precio" class="form-label">Precio:</label>
                            <input type="number" min="0" id="precio" name="precio" class="form-control" placeholder="Precio">
                        </div>
                        <div class="col-md-6">
                            <label for="fecha" class="form-label">Fecha:</label>
                            <input type="date" id="fecha" name="fecha" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label for="foto" class="form-label">Inserte la url de la imagen de la ruta:</label>
                            <input type="text" id="foto" name="foto" class="form-control">
                        </div>
                    </div>

                    <div class="text-center">
                        <button type="submit" class="btn btn-primary" @click.prevent="createRoute()">Enviar</button>
                    </div>
                </form>

            </div>
            <!--Contenido de la ventana de la cancelacion de rutas-->
            <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
                Pestaña para la cancelacion de rutas
            </div>
        </div>
    </div>

    
   


    <!-- Modal de confirmacion de eliminacion de usuario-->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteModalLabel">¿Está seguro que quiere borrar este usuario?</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    El usuario <b>{{ selectedUser?.nombre }}</b> con el ID: <b>{{ selectedUser?.id }}</b> será eliminado permanentemente.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" @click="deleteUser(selectedUser?.id)">Eliminar
                        usuario</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    /*
    "aria-selected" es la clase que se le asigna automaticamente a la tab activa
     !!important se usa para sobrescribir los estilos de Bootstrap.
    */
.nav-link{
    border: 1px solid lightgray !important;
    color: black;
    transition: ease-out 0.2s;
}
.nav-link:hover{
    background-color: lightgray;
    color: black;
    font-weight: bold;
}
.nav-tabs .nav-link[aria-selected="true"] {
    background-color: rgb(101, 172, 101) !important;
    color: white !important;
    font-weight: bold;
}

#myTabContent {
    margin: 2em 2em;
    display: flex;
    justify-content: center;
}
.deleteButton{
    border: none;
    background-color: transparent;
}
.deleteButton img{
    width: 35px;
}

table {
    text-align: center;
    align-items: center;
    
}
table select{
    border: none;
}
.table-hover tbody tr:hover td,
.table-hover tbody tr:hover th {
    background-color: lightgray !important;
}

.main{
    margin-top: 2em;
    border-radius: 5px;
    
}
</style>