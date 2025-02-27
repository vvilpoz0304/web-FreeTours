<script setup>
// Importamos todo lo necesario;
import router from '@/router';
import { onMounted, ref, computed, watch } from 'vue';
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
let modalInstanceUser = null;  // Declaramos una variable para instanciar el modal

// Cargar el modal al montar el componente
onMounted(() => {
    modalInstanceUser = new Modal(document.getElementById("deleteModal"));
});

// Abrir el modal y asignar el usuario seleccionado
function openModal(user) {
    selectedUser.value = user;
    modalInstanceUser.show(); // Mostramos el modal
}

// Funcion para eliminar un usuario
function deleteUser(id) {
    fetch(`http://localhost/freetours/api.php/usuarios?id=${id}`, {
        method: 'DELETE',
    })
        .then(() => getData()) // Llamar getData() solo cuando DELETE haya finalizado
        .catch(error => console.error('Error:', error));
    modalInstanceUser.hide();
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
    let timerInterval; // Declaramos el intervalo de tiempo para el mensaje de confirmacion;
    Swal.fire({
        title: "¡Ruta creada!",
        text: `La ruta en ${formCreator.value.titulo} ha sido creada correctamente.`,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    });
    invalidDate.value = true;

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

    getRoutes(); // Actualizamos las rutas;
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

    if (today.getTime() > date.getTime() || formCreator.value.hora < today.getTime()) { // La fecha introducida no puede ser anterior al dia de hoy;
        invalidDate.value = false;
    } else {
        invalidDate.value = true;
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

// Funcion para eliminar una ruta;
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
            let timerInterval;
            Swal.fire({
                title: "Ruta eliminada correctamente",
                text: "La ruta " + rutaTitulo + " ha sido eliminada correctamente.",
                icon: "success",
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
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

// Declaramos e instanciamos el modal para la duplicacion de rutas;
let modalInstanceDuplicate = null;
let selectedRoute = ref(null)
onMounted(() => {
    modalInstanceDuplicate = new Modal(document.getElementById("modalduplicate"));
});


const newRouteDuplicated = ref({
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

const invalidDateDuplicated = ref(false);

function validDateDuplicate() {
    let today = new Date();
    today.setHours(0, 0, 0, 0); // Asegurar que today no tenga horas

    let date = new Date(newRouteDuplicated.value.fecha);

    // Verificamos si la fecha es anterior a hoy o si la hora es nula/vacía
    if (date < today || !newRouteDuplicated.value.hora || newRouteDuplicated.value.hora.trim() === '' || newRouteDuplicated.value.hora == undefined) {
        invalidDateDuplicated.value = true;
    } else {
        invalidDateDuplicated.value = false;
    }
}

// Duplicar ruta
function openModalDuplication(route) {
    selectedRoute.value = route;
    modalInstanceDuplicate.show();
}
onMounted(() => {
    const modalElement = document.getElementById("modalduplicate");

    if (modalElement) {
        modalElement.addEventListener("hidden.bs.modal", () => {
            newRouteDuplicated.value.fecha = "";
            newRouteDuplicated.value.hora = "";
            newRouteDuplicated.value.guia_id = "";
            invalidDateDuplicated.value = false;
        });
    }
});


function duplicateRoute(route) {
    // Asignamos los valores de la ruta seleccionada a la nueva ruta que se va a duplicar;
    newRouteDuplicated.value.titulo = route.titulo;
    newRouteDuplicated.value.localidad = route.localidad;
    newRouteDuplicated.value.longitud = route.longitud;
    newRouteDuplicated.value.latitud = route.latitud;
    newRouteDuplicated.value.descripcion = route.descripcion;
    newRouteDuplicated.value.foto = route.foto;

    let timerInterval;
    fetch('http://localhost/freetours/api.php/rutas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRouteDuplicated.value)
    })
        .then(response => response.json())
        .then(data => Swal.fire({
            title: "¡Ruta duplicada!",
            text: "La ruta ha sido duplicada correctamente.",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerInterval = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }))
        .catch(error => Swal.fire({
            icon: "error",
            title: "Ha ocurrido un error",
            text: "No ha sido posible duplicar la ruta. Por favor, inténtelo de nuevo.",
            //footer: '<a href="#">Why do I have this issue?</a>'
        })
        );
    getRoutes();
    modalInstanceDuplicate.hide();
}

let modalInstanceAssign = null;
let selectedRouteAssign = ref(null);

const asignacionData = ref({
    ruta_id: "",
    guia_id: ""
});

onMounted(() => {
    const modalElement = document.getElementById("modalassign");
    modalInstanceAssign = new Modal(modalElement);

    // Limpiar formulario cuando se cierre el modal
    modalElement.addEventListener("hidden.bs.modal", () => {
        asignacionData.value.ruta_id = "";
        asignacionData.value.guia_id = "";
    });
});

// Abre el modal y obtiene los guías disponibles
function openModalAssign(route) {
    asignacionData.value.ruta_id = route.id;

    if (route.fecha) {
        getGuidesAvailable(route.fecha);
    } else {
        console.warn("Fecha no válida para obtener guías disponibles.");
    }

    modalInstanceAssign.show();
}

// Crea la asignación y cierra el modal
function createGuideAssignation() {
    fetch("http://localhost/freetours/api.php/asignaciones", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(asignacionData.value)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Asignación creada:", data);
            getRoutes(); // Actualizar rutas después de la asignación
            modalInstanceAssign.hide(); // Cerrar modal después de guardar
        })
        .catch(error => console.error("Error:", error));
}

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
                                        <h6 class="card-title"><img src="/images/pin.png">{{ route.localidad }}, Fecha:
                                            {{ route.fecha }}</h6>
                                        <h6 class="card-title">Guia: {{ route.guia_nombre }}</h6>
                                        <p class="card-text">
                                            {{ route.descripcion }}
                                        </p>
                                    </div>
                                    <div class="btn-group mt-3">
                                        <button class="manageRoutesButton" id="duplicateRoute"
                                            @click="openModalDuplication(route)">Duplicar
                                            ruta</button>
                                        <button type="button" class="manageRoutesButton" id="asignRoute"
                                            @click="openModalAssign(route)">Asignar
                                            Guía</button>
                                        <button class="manageRoutesButton"
                                            @click="deleteRoute(route.id, route.titulo, route.guia_id)"
                                            id="cancelRoute">Cancelar Ruta</button>
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

    <!-- Modal de duplicacion de rutas -->
    <div class="modal fade" id="modalduplicate" tabindex="-1" aria-labelledby="duplicateModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content p-3">
                <div class="modal-header">
                    <h5 class="modal-title" id="duplicateModal">Duplicado de Rutas</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body text-center">
                    <div class="d-flex justify-content-center mb-4">
                        <img src="/images/duplicadoRutas.png" width="150px" height="150px">
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label for="fecha" class="form-label" aria-label="Fecha">Fecha:*</label>
                            <input type="date" id="fecha" name="fecha" class="form-control"
                                v-model="newRouteDuplicated.fecha"
                                @change="getGuidesAvailable(newRouteDuplicated.fecha), validDateDuplicate()">
                        </div>
                        <div class="col-md-6">
                            <label for="hora" class="form-label" aria-label="Hora">Hora:*</label>
                            <input type="time" id="hora" name="hora" class="form-control"
                                v-model="newRouteDuplicated.hora" @change="validDateDuplicate()">
                        </div>
                    </div>

                    <p v-if="invalidDateDuplicated" class="text-danger text-center">
                        La fecha debe ser posterior al día de hoy. Introducir hora obligatoria.
                    </p>

                    <div class="col-md-12 mb-3">
                        <label for="guia" class="form-label" aria-label="Guia">Asignar Guía:</label>
                        <select id="guia" name="guia" class="form-control"
                            title="Guias disponibles en la fecha seleccionada" v-model="newRouteDuplicated.guia_id">
                            <option v-for="guide in guideAvailable" :key="guide.id" :value="guide.id"
                                :disabled="invalidDateDuplicated">
                                Guía con ID: {{ guide.id }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" :disabled="invalidDateDuplicated"
                        @click="duplicateRoute(selectedRoute)">
                        Duplicar
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal de Asignacion de Guias -->
    <div class="modal fade" tabindex="-1" id="modalassign" aria-labelledby="modalAssignLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content p-3">
                <div class="modal-header">
                    <h5 class="modal-title">Asigne un guía:</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body text-center">
                    <div class="d-flex justify-content-center mb-4">
                        <img src="/images/asignacion.png" alt="Asignación" width="150px" height="150px">
                    </div>

                    <div class="mb-3">
                        <label for="guia" class="form-label">Asignar Guía:</label>
                        <select id="guia" name="guia" class="form-control"
                            title="Guias disponibles en la fecha seleccionada" v-model="asignacionData.guia_id">
                            <option v-for="guide in guideAvailable" :key="guide.id" :value="guide.id">
                                Guía con ID: {{ guide.id }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" @click="createGuideAssignation()">Guardar cambios</button>
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
    flex-wrap: wrap;
    border-radius: 5px;
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