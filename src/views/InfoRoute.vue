<script setup>
import router from '@/router';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Modal } from "bootstrap";
import CommentSection from '@/components/CommentSection.vue';
import Swal from 'sweetalert2';


const route = useRoute() // Obtenemos el id de la ruta actual;
//console.log(route.params.ruta_id);

// Averiguamos si el cliente está logueado o no;
const props = defineProps({
    userAuth: Object
});

// Conseguimos su email para poder conseguir las reservas anteriores al dia de hoy, es decir, las rutas que ha realizado
const email = props.userAuth?.email || null; // Evita error si userAuth es null 
const userID = props.userAuth?.id || null;  // Obtenemos el id en caso de estar logueado
const thisRouteID = route.params.ruta_id;
const clientBooking = ref([]);
//const assignedGuide = ref('');

// Creamos 2 variables que asignaremos un numero random para rellenar la informacion;
let price = Math.floor(Math.random() * 50) + 20;
let duration = (Math.floor(Math.random() * 3) + 1) + " horas y " + (Math.floor(Math.random() * 60) + 1) + " minutos"

const didClientThisRoute = ref(false) // Variable para comprobar si el usuario ya ha hecho esta fecha
const alreadyBooked = ref(false)  // Variable para saber si el usuario ya ha reservado esta ruta o no

// Conseguimos todas las reservas del usuario logueado y las filtramos por las anteriores al dia de hoy para saber las rutas que ha realizado
function getBooking(clientEmail) {
    if (!clientEmail) return; // Si no hay email, no hacer la petición

    fetch(`http://localhost/freetours/api.php/reservas?email=${clientEmail}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            let today = new Date();
            today.setHours(0, 0, 0, 0); // Para comparar solo fechas sin la hora

            // Obtener todas las reservas anteriores al día de hoy
            clientBooking.value = data.filter(booking => {
                let bookingDate = new Date(booking.ruta_fecha);
                return bookingDate < today; // Filtrar solo reservas pasadas
            });

            // Verificar si el cliente ha realizado esa ruta
            didClientThisRoute.value = clientBooking.value.some(booking =>
                booking.ruta_id == thisRouteID && booking.cliente_id == userID
            );
            console.log(didClientThisRoute.value)


            // Permitir reservar solo si no tiene una reserva futura
            alreadyBooked.value = data.some(booking =>
                booking.ruta_id == thisRouteID && booking.cliente_id == userID && new Date(booking.ruta_fecha) >= today
            );
        })
        .catch(error => console.error('Error:', error));


}
// Obtenemos toda la informacion de la ruta actual;
const infoRoute = ref([])

function getInfoRoute(rutaId) {
    fetch(`http://localhost/freetours/api.php/rutas?id=${rutaId}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            infoRoute.value = data
        })
        .catch(error => console.error('Error:', error));
}
getInfoRoute(thisRouteID)

// Obtenemos tambien las valoraciones de la ruta;
const routeRating = ref([]);

function getRating(rutaId) {
    fetch(`http://localhost/freetours/api.php/valoraciones?ruta_id=${rutaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            routeRating.value = data;
        })
        .catch(error => {
            console.error(`Error al obtener las valoraciones para la ruta ${rutaId}:`, error);
        });
}

const newBooking = ref({
    email: email,
    ruta_id: thisRouteID,
    num_personas: ''
});

// Instanciamos el modal 
let modalNewBooking = null;

// Cargar el modal al montar el componente
onMounted(() => {
    modalNewBooking = new Modal(document.getElementById("newBookingModal"));
});

function openModal() {
    modalNewBooking.show(); // Mostramos el modal
}

function addBooking() {
    fetch('http://localhost/freetours/api.php/reservas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBooking.value)
    })
        .then(response => response.json())
        .then(Swal.fire({
            title: "¡Reserva registrada!",
            text: "Recuerda que puedes cancelarla o modificarla en cualquier momento.",
            imageUrl: "/images/reservaNueva.png",
            imageWidth: 150,
            imageHeight: 150,
        }))
        .catch(error => console.error('Error:', error));

        alreadyBooked.value = true;
        modalNewBooking.hide();
}

onMounted(() => {
    getBooking(email)
    getInfoRoute(thisRouteID);
    getRating(thisRouteID);
});
</script>

<template>
    <main class="container d-flex flex-column flex-md-row justify-content-between mt-4 shadow-lg p-4 rounded">
        <!-- Sección principal -->
        <div v-if="infoRoute" class="content w-100 w-md-75">
            <!-- Imagen de fondo con título -->
            <div class="h-auto d-flex flex-column align-items-center justify-content-center text-white rounded"
                :style="{
                    backgroundImage: `url(${infoRoute.foto})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '20em'
                }">
                <h1 class="fw-bold text-shadow text-center">{{ infoRoute.titulo }}</h1>
            </div>

            <!-- Descripción -->
            <p class="mt-4 fs-5">
                <strong class="fs-4">Fecha:</strong> {{ infoRoute?.fecha }} | 
                <strong class="fs-4">Hora:</strong> {{ infoRoute?.hora }}
            </p>
            <p class="mt-2 fs-5">
                <strong class="fs-4">Descripción:</strong> {{ infoRoute?.descripcion }}
            </p>
        </div>

        <!-- Barra lateral (aside) -->
        <aside v-if="infoRoute" class="sidebar p-3 shadow rounded w-45 w-md-35 h-auto d-flex flex-column mt-4 mt-md-0">
            <h2 class="fw-bold">Detalles de la ruta:</h2>
            <ul class="list-unstyled">
                <li class="mb-3"><strong>Duración:</strong> {{ duration }}</li>
                <li class="mb-3"><strong>Precio:</strong> {{ price }}€</li>
                <li class="mb-3"><strong>Asistentes:</strong> {{ infoRoute?.asistentes }}</li>
                <li class="mb-3"><strong>¿Más información?</strong> ¡Contáctenos!</li>
            </ul>

            <div v-if="didClientThisRoute">
                <p class="text-danger">¡Esta ruta ya ha expirado!</p>
            </div>
            <button v-else-if="userAuth && !alreadyBooked" @click="openModal()" class="btn btn-success">
                ¡Reserva ya!
            </button>
            <div v-else-if="alreadyBooked">
                <p class="text-primary">¡Ya tienes una reserva hecha!</p>
                <RouterLink to="/cliente" class="btn btn-outline-primary">Ver mis reservas</RouterLink>
            </div>
            <div v-else>
                <p>Inicie sesión o regístrese para reservar</p>
                <RouterLink to="/login" class="btn btn-outline-secondary">Iniciar Sesión</RouterLink>
            </div>
        </aside>

        <!-- Mensaje de carga mientras se obtienen los datos -->
        <div v-else class="text-center mt-5 w-100">
            <p class="text-muted">Cargando información de la ruta...</p>
        </div>
    </main>

    <CommentSection :userAuth="userAuth" :didClientThisRoute="didClientThisRoute" :thisRouteID="thisRouteID" />

    <!-- Modal para realizar la reserva -->
    <div class="modal fade" id="newBookingModal" tabindex="-1" aria-labelledby="newBookingModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="newBookingModalLabel">Realizar Reserva</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <p>Seleccione el número de asistentes (máx. 8 personas):</p>
                    <input v-model="newBooking.num_personas" type="number" class="form-control"
                        placeholder="Número de personas" min="1" max="8">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary"
                        :disabled="newBooking.num_personas == '' || newBooking.num_personas <= 0 || newBooking.num_personas > 8"
                        @click="addBooking()">Reservar</button>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
/* Sombra en el texto para mejor legibilidad */
.text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Diseño de la barra lateral */
.sidebar {
    background-color: #f8f9fa;
    /* Color claro */
    top: 20px;
    /* Se mantiene visible al hacer scroll */
    height: fit-content;
}
</style>
