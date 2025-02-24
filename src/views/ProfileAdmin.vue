<script setup>
// Importamos todo lo necesario;
import router from '@/router';
import { onMounted, ref, computed } from 'vue';
import { Modal } from "bootstrap";
import L from 'leaflet'; // Importamos Leaflet para poder utilizarlo en la creacion de rutas ;
import 'leaflet/dist/leaflet.css'; // Estilo de LeafLet 
import { OpenStreetMapProvider } from 'leaflet-geosearch'; // API de LeafLet
import Swal from 'sweetalert2'; // Importamos SweetAlert2 para mostrar mensajes de confirmacion https://sweetalert2.github.io/;

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


///////////////////////////
/// GESTION DE USUARIOS ///
///////////////////////////

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

onMounted(getData); // Utilizamos onMounted para que cargue los datos una vez se haya cargado los componentes;

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
const selectedUser = ref(null); // Variable del usuario seleccionado que declaramos para manejarlo mediante el modal
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

////////////////////////////////
// Paginacion de los usuarios //
////////////////////////////////
let currentPage = ref(1);
let usersPerPage = 6;
let totalPages = computed(() => Math.ceil(users.value.length / usersPerPage)); // Calculamos el numero de paginas totales, lo hacemos computed para que se actulice automaticamente cuando el numero de usuarios cambie

let paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * usersPerPage; // Calculamos el inicio de los registros de la pagina
    const end = start + usersPerPage; // Al numero inicial le sumamos los 10 registros que queremos mostrar
    return users.value.slice(start, end); // Devolvemos los registros que queremos mostrar
})

function nextPage() {
    if (currentPage.value < Math.ceil(users.value.length / usersPerPage)) { // Comprobamos que no estemos en la utlima pagina
        currentPage.value++;
    }
}
function previousPage() {
    if (currentPage.value > 1) { // Comprobamos que no estamos en la primera pagina;
        currentPage.value--;
    }
}


///////////////////////////
//// CREACION DE RUTAS ////
///////////////////////////

// Mapa
let map = null;
let marker = null;

function showMap() {
    map = L.map('map').setView([40.4168, -3.7038], 13); // Coords de Madrid por defecto
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click', function (e) { // En caso de hacer click en el mapa
        if (marker) {
            map.removeLayer(marker); // En caso de ya haber un marcador, lo eliminamos
        }
        marker = L.marker(e.latlng).addTo(map); // Añadimos el nuevo marcador al mapa
        formCreator.value.latitud = e.latlng.lat; // Redeclaramos la longitud y longitud seleccionada en el mapa
        formCreator.value.longitud = e.latlng.lng;
    })
}

onMounted(() => {
    showMap(); // Mostramos el mapa una vez se haya montado el componente;
});

// Funcion para buscar una localizacion en el mapa;
async function searchLocation(location) {
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: location }); // Llamamos a la funcion "OpenStreetMapProvider" de Leaflet con el metodo "search" pasandole la query "location" que son los datos obtenidos del formulario;

    if (results && results.length > 0) { // Comprobamos que haya habido resultados y que sean válidos
        const { x, y } = results[0];
        map.setView([y, x], 13);
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker([y, x]).addTo(map);
        formCreator.value.latitud = y;
        formCreator.value.longitud = x;
    }
}

let formCreator = ref({
    titulo: '',
    localidad: '',
    longitud: '',
    latitud: '',
    descripcion: '',
    fecha: '',
    hora: '',
    foto: '',
    guia_id: ''
});

// Funcion para crear una ruta
function createRoute() {
    fetch('http://localhost/freetours/api.php/rutas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formCreator.value)
    })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));

    Swal.fire({
        title: "¡Ruta creada!",
        text: `La ruta en ${formCreator.value.titulo} ha sido creada correctamente.`,
        icon: "success"
    });

    // Limpiamos los campos del formulario;
    formCreator.value.titulo = '';
    formCreator.value.localidad = '';
    formCreator.value.longitud = '';
    formCreator.value.latitud = '';
    formCreator.value.descripcion = '';
    formCreator.value.fecha = '';
    formCreator.value.hora = '';
    formCreator.value.foto = '';
    formCreator.value.guia_id = '';
}

// Validamos que los campos obligatorios esten rellenos;
let valid = ref(false);

function validForm() {
    // if(formCreator.value.longitud.length != 0 || formCreator.value.latitud.length != 0 ||
    // !isNaN(formCreator.value.longitud) || !isNaN(formCreator.value.latitud)){
    //     map.setView([formCreator.value.latitud, formCreator.value.longitud], 13);
    // }
    validDate()
    if (formCreator.value.titulo.length == 0 || formCreator.value.localidad.length == 0 ||
        formCreator.value.longitud.length == 0 || formCreator.value.latitud.length == 0 ||
        isNaN(formCreator.value.longitud) || isNaN(formCreator.value.latitud) ||
        formCreator.value.fecha.length == 0 || formCreator.value.hora.length == 0 ||
        formCreator.value.foto.length == 0 || !invalidDate.value) {
        valid.value = false;
    } else {
        valid.value = true;
    }
}

//Comprobamos que la fecha introducida sea válida
let invalidDate = ref(true);

function validDate() {
    let today = new Date();
    let date = new Date(formCreator.value.fecha);

    if (date.getTime() < today.getTime()) { // La fecha introducida no puede ser anterior al dia de hoy;
        invalidDate.value = false;
    } else {
        invalidDate.value = true;
        const year = date.getFullYear();
        const month = (date.getMonth() < 10 ? '0' : '') + date.getMonth() + 1; // En caso de que el mes sea un digito, le añadimos un 0 delante para evitar errores;
        const day = (date.getDate() < 10 ? '0' : '') + date.getDate(); // Hacemos lo mismo con el dia

        date = `${year}-${month}-${day}`
        console.log(date)
    }
}

// Funcion para obtener los guias disponibles;
const guideAvailable = ref([]);


function getGuidesAvailable(fecha) {
    fetch(`http://localhost/freetours/api.php/asignaciones?fecha=${fecha}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => guideAvailable.value = data)
        .catch(error => console.error('Error:', error));
}


///////////////////////////////
/// ADMINISTRACION DE RUTAS ///
///////////////////////////////

let routes = ref([]);
// Conseguimos todas las rutas disponibles;

async function getRoutes() {
    try {
        fetch('http://localhost/freetours/api.php/rutas')
            .then(response => response.json())
            .then(data => routes.value = data);
    } catch (error) {
        alert(`Error al obtener datos: ${error.message}`);
    }
}
onMounted(getRoutes);

function deleteRoute(rutaId, rutaTitulo) {

    Swal.fire({
        title: "¿Está seguro de que quiere eliminar está ruta?",
        text: "Una vez eliminada, no podrá recuperarla.",
        imageUrl: "/images/cancelRouteIcon.png", // Carga la imagen
        imageWidth: 150, // Ajusta el tamaño
        imageHeight: 150,
        showCancelButton: true,
        confirmButtonColor: "red",
        cancelButtonColor: "gray",
        confirmButtonText: "Eliminar"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Ruta eliminada correctamente",
                text: "La ruta " + rutaTitulo + " ha sido eliminada correctamente.",
                icon: "success"
            });
            fetch(`http://localhost/freetours/api.php/rutas?id=${rutaId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => getRoutes())
                .catch(error => console.error('Error:', error));
        }
    });
}

</script>
<template>
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Gestion de Usuarios</button>
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
                <table class="table table-striped table-hover align-middle" id="userTable">
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
                        <tr v-for="(user) in paginatedUsers" :key="user.id">
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
                            <td v-if="user.rol == 'admin'"><button type="button" disabled class="unavailable">No
                                    disponible</button></td>
                            <td v-else><button type="button" @click="openModal(user)" class="deleteButton"><img
                                        src="/images/papelera.png" alt="papelera"></button></td>
                        </tr>
                    </tbody>
                </table>
                <nav aria-label="Paginacion de usuarios">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <a class="page-link" href="#" @click.prevent="previousPage">Previous</a>
                        </li>
                        <li class="page-item" v-for="page in totalPages" :key="page"
                            :class="{ active: currentPage === page }">
                            <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <!--Contenido de la ventana de la Creacion de Rutas-->
            <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                <form class="p-4 border rounded shadow bg-light">
                    <div class="row mb-3 g-3">
                        <div class="col-md-6">
                            <label for="titulo" class="form-label" aria-label="titulo">Título de la ruta:*</label>
                            <input type="text" id="titulo" name="titulo" class="form-control"
                                placeholder="Título de la ruta" v-model="formCreator.titulo" @input="validForm()">
                        </div>
                        <div class="col-md-6">
                            <label for="localidad" class="form-label" aria-label="Localidad">Localidad:*</label>
                            <input type="text" id="localidad" name="localidad" class="form-control"
                                placeholder="Localización" v-model="formCreator.localidad" @input="validForm()">
                        </div>
                    </div>

                    <div class="row mb-3 g-3">
                        <div class="col-md-6">
                            <label for="longitud" class="form-label" aria-label="Longitud"
                                @input="validForm()">Longitud:*</label>
                            <input type="text" id="longitud" name="longitud" class="form-control" placeholder="Longitud"
                                v-model="formCreator.longitud" @input="validForm()">
                        </div>
                        <div class="col-md-6">
                            <label for="latitud" class="form-label" aria-label="Latitud">Latitud:*</label>
                            <input type="text" id="latitud" name="latitud" class="form-control" placeholder="Latitud"
                                v-model="formCreator.latitud" @input="validForm()">
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="direccion" class="form-label" aria-label="Direccion">Buscar dirección:</label>
                        <input name="direccion" @change="searchLocation($event.target.value)"
                            placeholder="Buscar dirección" class="form-control" />
                        <div id="map" style="height: 25em;" class="mt-2 border rounded"></div>
                    </div>

                    <div class="row mb-3 g-3">
                        <div class="col-md-6">
                            <label for="fecha" class="form-label" aria-label="Fecha">Fecha:*</label>
                            <input type="date" id="fecha" name="fecha" class="form-control" v-model="formCreator.fecha"
                                @input="validForm()" @change="getGuidesAvailable(formCreator.fecha)">
                            <p v-if="!invalidDate">La fecha debe ser posterior al día de hoy.</p>
                        </div>
                        <div class="col-md-6">
                            <label for="hora" class="form-label" aria-label="Hora">Hora:*</label>
                            <input type="time" id="hora" name="hora" class="form-control" v-model="formCreator.hora"
                                @input="validForm()">
                        </div>
                    </div>

                    <div class="row mb-3 g-3">
                        <div class="col-md-12">
                            <label for="guia" class="form-label" aria-label="Guia">Asignar Guía:</label>
                            <select id="guia" name="guia" class="form-control" v-model="formCreator.guia_id"
                                title="Guias disponibles en la fecha seleccionada">
                                <option value="">Seleccionar guia:</option>
                                <option v-for="guide in guideAvailable" :key="guide.id" :value="guide.id">
                                    Guía con ID: {{ guide.id }}
                                </option>
                                <option value="">No asignar Guia</option>
                            </select>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="foto" class="form-label" aria-label="Imagen">Inserte la URL de la imagen de la
                            ruta:*</label>
                        <input type="text" id="foto" name="foto" class="form-control" placeholder="URL de la imagen"
                            v-model="formCreator.foto" @input="validForm()">
                        <label for="desc" class="form-label" aria-label="Descripcion">Descripción:</label>
                        <textarea id="desc" name="desc" class="form-control" rows="4"
                            placeholder="Descripción de la ruta" v-model="formCreator.descripcion"></textarea>
                    </div>

                    <div class="text-center">
                        <button type="submit" class="btn w-50" @click.prevent="createRoute()" :disabled="!valid"
                            id="createButton" title="Enviar formulario">Enviar</button>
                    </div>
                </form>
            </div>
            <!--Contenido de la ventana de la cancelacion de rutas-->
            <div class="tab-pane fade routesList" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab"
                tabindex="0">
                <main class="container rounded shadow p-3">
                    <div class="card mb-5 routeCard" v-for="route in routes" :key="route.id">
                        <div class="row g-2">
                            <div class="col-md-3 image">
                                <img :src="route.foto" class="img-fluid rounded-start imagenRuta" :alt="route.titulo">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body infoRoute">
                                    <div>
                                        <h2 class="card-title">{{ route.titulo }}</h2>
                                        <h6 class="card-title"><img src="/images/pin.png">{{ route.localidad }}</h6>
                                        <h6 class="card-title">Guia: {{ route.guia_nombre }}</h6>
                                        <p class="card-text">
                                            {{ route.descripcion }}
                                        </p>
                                    </div>
                                    <div class="btn-group mt-3">
                                        <button class="manageRoutesButton" id="duplicateRoute">Duplicar ruta</button>
                                        <button type="button" class="manageRoutesButton" id="asignRoute">Asignar Guía</button>
                                        <button class="manageRoutesButton"
                                            @click="deleteRoute(route.id, route.titulo)" id="cancelRoute">Cancelar Ruta</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
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
                    El usuario <b>{{ selectedUser?.nombre }}</b> con el ID: <b>{{ selectedUser?.id }}</b> será eliminado
                    permanentemente.
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
.deleteButton {
    border: none;
    background-color: transparent;
}

.deleteButton img {
    width: 35px;
    transition: ease-in 0.2s;
}

.deleteButton img:hover {
    width: 2.5em;
}

.unavailable {
    border: none;
}

#userTable {
    text-align: center;
    align-items: center;
}

#userTable select {
    border: none;
}

.table-responsive #userTable thead {
    background-color: aqua !important;
    /*No fufa */
}

.table-hover tbody tr:hover td,
.table-hover tbody tr:hover th {
    background-color: rgb(206, 247, 202) !important;
}

.table-hover tbody tr:hover {
    border: 1px solid black;
}

.page-link {
    background-color: #e8ffe9;
    color: black;
}

.page-link:focus {
    background-color: #7ac58a;
}

.page-item.active .page-link {
    border: none;
    background-color: rgb(95, 132, 95);
}

.main {
    margin-top: 2em;
    border-radius: 5px;
}

#createButton {
    background-color: #7ac58a;
    border: none;
}

.routesList {
    width: 100% !important;
}

.infoRoute {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;    border-radius: 5px;
    /* Permite que los elementos se acomoden en pantallas pequeñas */
    padding: 1rem;
}

.imagenRuta {
    width: 100%;
    height: 12em;
    object-fit: cover;
    /* Recorta la imagen sin deformarla */
    border-radius: 10px;
}

.col-md-3 .image {
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.routeCard {
    height: 13em;
    margin: 0.5em 0em;
}

.manageRoutesButton {
    border: none;
    padding: 0.5em 1em;
    cursor: pointer;
    transition: ease-in 0.25s;
}
#cancelRoute {
    background-color: rgb(249, 55, 55);
}
#duplicateRoute {
    background-color: yellow;
}
#asignRoute {
    background-color: #7ac58a;
}
</style>