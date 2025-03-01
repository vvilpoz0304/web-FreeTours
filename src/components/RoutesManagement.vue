<script setup>
// Importamos todo lo necesario;
import { onMounted, ref, computed, watch } from 'vue';
import { Modal } from "bootstrap";
import Swal from 'sweetalert2'; // Importamos SweetAlert2 para mostrar mensajes de confirmacion https://sweetalert2.github.io/;

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

////////////////////////////////
// Paginacion de los usuarios //
////////////////////////////////
let currentPage = ref(1);
let routesPerPage = 5;
let totalPages = computed(() => Math.ceil(routes.value.length / routesPerPage)); // Calculamos el numero de paginas totales, lo hacemos computed para que se actulice automaticamente cuando el numero de usuarios cambie

let paginatedRoutes = computed(() => {
    const start = (currentPage.value - 1) * routesPerPage; // Calculamos el inicio de los registros de la pagina
    const end = start + routesPerPage; // Al numero inicial le sumamos los 10 registros que queremos mostrar
    return routes.value.slice(start, end); // Devolvemos los registros que queremos mostrar
})

function nextPage() {
    if (currentPage.value < Math.ceil(routes.value.length / routesPerPage)) { // Comprobamos que no estemos en la utlima pagina
        currentPage.value++;
    }
}
function previousPage() {
    if (currentPage.value > 1) { // Comprobamos que no estamos en la primera pagina;
        currentPage.value--;
    }
}

</script>
<template>
    <main class="container rounded shadow p-3">
        <div class="card mb-5 routeCard" v-for="route in paginatedRoutes" :key="route.id">
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
                                @click="deleteRoute(route.id, route.titulo, route.guia_id)" id="cancelRoute">Cancelar
                                Ruta</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nav aria-label="Paginacion de usuarios">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="previousPage">Previous</a>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                    <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
                </li>
            </ul>
        </nav>
    </main>
    
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
                    <button type="button" class="btn btn-primary" @click="createGuideAssignation()">Guardar
                        cambios</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
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