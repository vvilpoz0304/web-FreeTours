<script setup>
import router from '@/router';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute() // Obtenemos el id de la ruta actual;
//console.log(route.params.ruta_id);

// Averiguamos si el cliente está logueado o no;
const props = defineProps({
    userAuth: Object
});

let email = props.userAuth.email; // Conseguimos su email para poder conseguir las reservas anteriores al dia de hoy, es decir, las rutas que ha realizado
const thisRouteID = route.params.ruta_id;
const userID = props.userAuth.id;
const clientBooking = ref([]);

const didClientThisRoute = ref(false)


console.log(thisRouteID, userID)

// Conseguimos todas las reservas del usuario logueado y las filtramos por las anteriores al dia de hoy para saber las rutas que ha realizado
function getBooking(clientEmail) {
    fetch(`http://localhost/freetours/api.php/reservas?email=${clientEmail}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            let today = new Date();
            today.setHours(0, 0, 0, 0); // Para comparar solo fechas sin la hora

            clientBooking.value = data.filter(booking => {
                let bookingDate = new Date(booking.ruta_fecha);
                return bookingDate < today; // Filtrar solo reservas pasadas
            });

            // Verificar si el cliente ha realizado esa ruta;
            didClientThisRoute.value = clientBooking.value.some(ruta =>
                ruta.ruta_id == thisRouteID && ruta.cliente_id == userID
            );

        })
        .catch(error => console.error('Error:', error));


}
getBooking(email)

// Obtenemos toda la informacion de la ruta actual;
const infoRoute = ref([])

function getInfoRoute(rutaId) {
    fetch(`http://localhost/freetours/api.php/rutas?id=${rutaId}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            infoRoute.value = data
            console.log(infoRoute.value)
        })
        .catch(error => console.error('Error:', error));
}
getInfoRoute(thisRouteID)

// Obtenemos tambien las valoraciones de la ruta;
const routeRating = ref([]);

function getRating(rutaId) {
    fetch(`http://localhost/api.php/valoraciones?ruta_id=${rutaId}`)
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

getRating(thisRouteID);
</script>

<template>
    <main>
        <div>
            <h1>Información de la ruta</h1>
            <p>Aqui van los datos </p>
        </div>
        <aside>
            <h2>Detalles de la ruta</h2>
            <p>En esta sección se mostrarán los detalles de la ruta seleccionada.</p>
        </aside>
    </main>
</template>

<style scoped></style>