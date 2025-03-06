<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import router from '@/router';


//En caso de acceder sin estar logueado te redirige a Login;
const props = defineProps({
    userAuth: Object
});

if (!props.userAuth) {
    router.push("/login");
}

// Comprobamos el rol del usuario logueado;
let rol = props.userAuth?.rol || null;

if (!rol) {
    router.push('/login');
} else if (rol !== 'guia') {
    router.push(`/${rol}`);
}


let idLogged = props.userAuth?.id || null;

const nextRoutesAssigned = ref([]);

function getAssignations(idLogged) {
    fetch(`http://localhost/freetours/api.php/asignaciones?guia_id=${idLogged}`, {
        method: "GET",
    })
        .then(response => response.json())
        .then(data => {
            nextRoutesAssigned.value = data.filter(route => {
                const routeDate = new Date(route.ruta_fecha);
                const currentDate = new Date();

                // Elimina horas, minutos y segundos para comparar solo la fecha
                currentDate.setHours(0, 0, 0, 0);
                routeDate.setHours(0, 0, 0, 0);

                return routeDate >= currentDate;
            });
        })
        .catch(error => console.error("Error:", error));
}
getAssignations(idLogged);

const clientsList = ref([]);
let modalInstanceList = null;  // Declaramos una variable para instanciar el modal

// Cargar el modal al montar el componente
onMounted(() => {
    modalInstanceList = new Modal(document.getElementById("clientsList"));
});

function openModalList(route) {
    clientsList.value = route.reservas;
    console.log(clientsList.value);
    modalInstanceList.show(); // Mostramos el modal
}
</script>
<template>
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">
                Rutas Asignadas
            </button>
        </li>
    </ul>

    <div v-if="userAuth && userAuth.rol === 'guia'" class="container mt-4">
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab"
                tabindex="0">
                <main class="d-flex justify-content-center align-items-center">
                    <!-- Acordeón -->
                    <div class="accordion w-100 h-auto" id="accordionExample">
                        <h1 class="fw-bold">Rutas próximas</h1>
                        <div v-for="route in nextRoutesAssigned" :key="route.ruta_id"
                            class="d-flex align-items-center mb-2 p-2 bg-white shadow-sm rounded">

                            <div @click="openModalList(route)">
                                <!-- Imagen de perfil -->
                                <img src="/images/profile.png" alt="Perfil" class="profile-img me-3">
                                <p>{{ route.reservas?.num_personas || 0 }} Asistentes</p>
                            </div>
                            <!-- Contenedor del acordeón -->
                            <div class="accordion-item flex-grow-1 shadow-sm border bg-white rounded hover-shadow">

                                <!-- Título del acordeón -->
                                <h3 class="accordion-header">
                                    <button class="accordion-button collapsed d-flex align-items-center p-0 border-0"
                                        type="button" data-bs-toggle="collapse"
                                        :data-bs-target="'#collapse-' + route.ruta_id" aria-expanded="false"
                                        :aria-controls="'collapse-' + route.ruta_id">

                                        <!-- Contenedor de imagen y texto -->
                                        <div class="d-flex align-items-center w-100">
                                            <img :src="route.ruta_foto" alt="Imagen de la ruta"
                                                class="route-img img-fluid fixed-img rounded-end">
                                            <strong class="ms-3 fs-4">{{ route.ruta_titulo }}</strong>
                                        </div>
                                    </button>
                                </h3>

                                <!-- Contenido colapsable -->
                                <div :id="'collapse-' + route.ruta_id" class="accordion-collapse collapse"
                                    data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        <p><strong>Fecha:</strong> {{ route.ruta_fecha }} | <strong>Hora:</strong> {{
                                            route.ruta_hora }}</p>
                                        <p><img src="/images/pin.png" class="me-2">{{ route.ruta_localidad }}</p>
                                        <p><strong>Descripción:</strong> {{ route.ruta_descripcion }}</p>
                                    </div>
                                </div>
                            </div>
                        </div> <!-- Fin de cada item del acordeón -->
                    </div> <!-- Fin del acordeón -->
                </main>
            </div>
        </div>
    </div>

    <!-- Modal de lista de clientes -->
    <div class="modal fade" id="clientsList" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="clientsListModalLabel">Lista de Clientes</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Contenido del modal -->
                    <p v-if="clientsList.length > 0" v-for="client in clientsList">
                        Nombre: {{ client.cliente.nombre }}
                    </p>
                    <div v-else>
                        <img src="/images/noData.png" alt="No hay datos" class="img-fluid">
                        <p>Aún no hay ninguna reserva para esta ruta :(</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.fixed-img {
    width: 200px;
    height: 150px;
    object-fit: cover;
}

.accordion-item {
    max-width: 30em;
    /* Ajusta el tamaño según tu necesidad */
    display: flex;
    flex-direction: column;
}

.accordion-body {
    flex-grow: 1;
    /* Hace que el contenido se distribuya de forma uniforme */
}

.accordion-button::after {
    margin: 0em 1em;
}

.accordion-button::after {
    background-image: url("/images/inf.png") !important;
    /*Sustituyo la flecha del acordeon por el icono de informacion */
}

/* Efecto de elevacion de las tarjetas */
.hover-shadow {
    transition: all 0.4s ease-in-out;
    /* Aplica el efecto al poner y quitar el raton */
}

.hover-shadow:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
    transform: translateY(-5px);
    /* Eleva la tarjeta */
}
</style>
