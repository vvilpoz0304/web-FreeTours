<script setup>
import { ref } from "vue";
import Swal from 'sweetalert2'; // Importamos SweetAlert2 para mostrar mensajes de confirmacion https://sweetalert2.github.io/;

const props = defineProps({
    userAuth: Object
});

let email = props.userAuth.email;

const clientBooking = ref([]);

// Obtenermos todas las reservas del cliente logueado;
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
            console.log(clientBooking.value);

        })
        .catch(error => console.error('Error:', error));
}


getBooking(email); // Cargamos las reservas del cliente;


</script>
<template>
    <div class="card mb-3 w-100 h-auto d-flex justify-content-center" style="max-width: 75em"
        v-for="booking in clientBooking" :key="booking.id">

        <div class="row g-0 align-items-center">
            <!-- Imagen de la ruta -->
            <div class="col-md-2 d-flex justify-content-center">
                <img :src="booking.ruta_foto" alt="Imagen de la ruta" class="img-fluid rounded"
                    style="object-fit: cover;" />
            </div>

            <!-- Detalles de la ruta -->
            <div class="col-md-7">
                <div class="card-body">
                    <h2 class="card-title fw-bolder d-flex align-items-center">
                        <RouterLink :userAuth="userAuth" :to="{ name: 'InformacionRuta', params: { ruta_id: booking.ruta_id } }">
                            {{ booking.ruta_titulo }}
                        </RouterLink>
                        <span class="badge text-bg-secondary ms-3 fs-6 bg-success" v-if="booking.valoracion != null">
                            {{ booking.valoracion }} ⭐
                        </span>
                    </h2>

                    <p class="card-text mb-3">
                        <strong>Fecha:</strong> {{ booking.ruta_fecha }} |
                        <strong>Hora:</strong> {{ booking.ruta_hora }}
                    </p>
                    <p class="card-text">
                        <strong>Descripción:</strong> {{(booking.ruta_descripcion).slice(0,100) }}...
                    </p>
                </div>
            </div>

            <!-- Número de asistentes -->
            <div class="col-md-3 text-center">
                <RouterLink :to="{ name: 'InformacionRuta', params: { ruta_id: booking.ruta_id } }" class="btn p-3 m-3 valorar">Valorar Ruta</RouterLink>
            </div>
        </div>
    </div>


</template>
<style scoped>
.valorar{
    background-color: lightgreen;
}
</style>