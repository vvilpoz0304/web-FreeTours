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
                return bookingDate >= today; // Filtrar solo reservas futuras
            });
            console.log(clientBooking.value);
        })
        .catch(error => console.error('Error:', error));
}


getBooking(email); // Cargamos las reservas del cliente;

// Funcion para eliminar una reserva;
function deleteBooking(reservaId) {
    Swal.fire({
        title: "¿Está seguro de que quiere anular la reserva?",
        text: "No podrá recuperar la reserva una vez eliminada.",
        imageUrl: "images/cancelarReserva.png",
        imageWidth: 200, // Ajusta el tamaño
        imageHeight: 200,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => { // Si el usuario confirma la eliminacion de la reserva;
        if (result.isConfirmed) {
            fetch(`http://localhost/freetours/api.php/reservas?id=${reservaId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(getBooking(email))
                .catch(error => console.error('Error:', error));
            Swal.fire({
                title: "Reserva eliminada",
                text: "La reserva ha sido eliminada.",
                icon: "success"
            });
        }
    });
}
const newBooking = {
    email: '',
    ruta_id: '',
    num_personas: ''
}
async function modifyNumAssist(num, reservaID, emailCliente, rutaID) {
    const inputValue = num; // Asignamos el valor a "inputValue" que hara de valor por defecto en el input;
    const { value: numAssistant } = await Swal.fire({
        title: "Introduzca el nuevo número de asistentes",
        input: "number",
        inputLabel: "Máximo de 8 asistentes",
        inputValue,
        inputAttributes: { // Le establecemos un minimo y un maximo de asistentes;
            min: '1',
            max: '8',
        },
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return "¡Debe introducir un número!";
            }
        }
    });
    if (numAssistant) {
        // Eliminamos la reserva anterior;
        const deleteResponse = await fetch(`http://localhost/freetours/api.php/reservas?id=${reservaID}`, {
            method: 'DELETE',
        });

        const deleteData = await deleteResponse.json();

        newBooking.email = emailCliente;
        newBooking.ruta_id = rutaID;
        newBooking.num_personas = numAssistant;

        console.log(newBooking);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Creamos una nueva reserva con el nuevo numero de asistentes;
        const createResponse = await fetch('http://localhost/freetours/api.php/reservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBooking)
        });

        const createData = await createResponse.json();
        Swal.fire(`Nuevo número de asistentes: ${numAssistant}`);

        getBooking(emailCliente); // Recargamos las reservas del cliente;
    }
}

</script>
<template>
    <div class="container">
      <div class="card mb-3 p-3 shadow w-100" v-for="booking in clientBooking" :key="booking.id">
        <div class="row g-3 align-items-center">
          <!-- Imagen -->
          <div class="col-4 col-md-2">
            <img :src="booking.ruta_foto" alt="Imagen de la ruta" 
              class="img-fluid rounded w-100 img-ruta" />
          </div>
  
          <!-- Información de la reserva -->
          <div class="col-8 col-md-6">
            <div class="card-body">
              <h5 class="card-title fw-bold d-flex align-items-center">
                <RouterLink :userAuth="userAuth" :to="{ name: 'InformacionRuta', params: { ruta_id: booking.ruta_id } }">
                  {{ booking.ruta_titulo }}
                </RouterLink>
                <span class="badge text-bg-success ms-2"> {{ booking.valoracion }} ⭐</span>
              </h5>
  
              <p class="card-text">
                <strong>Fecha:</strong> {{ booking.ruta_fecha }} | <strong>Hora:</strong> {{ booking.ruta_hora }} <br>
                <img src="/images/pin.png" width="15" height="15"> {{ booking.ruta_localidad }} <br>
                <strong>Descripción:</strong> {{ booking.ruta_descripcion.slice(0, 100) }}...
              </p>
            </div>
          </div>
  
          <!-- Botones y número de asistentes -->
          <div class="col-12 col-md-4 d-flex flex-column align-items-md-end align-items-center">
            <p class="mb-2">Núm. Asistentes: <strong>{{ booking.num_personas }}</strong></p>
            <div class="d-flex flex-wrap gap-2 w-100 justify-content-center justify-content-md-end">
              <button class="btn btn-success flex-fill" 
                @click="modifyNumAssist(booking.num_personas, booking.reserva_id, booking.usuario_email, booking.ruta_id)">
                Modificar Asistentes
              </button>
              <button class="btn btn-danger flex-fill" @click="deleteBooking(booking.reserva_id)">
                Cancelar reserva
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
  
<style scoped>
/* Hacer las imágenes más grandes */
.img-ruta {
    max-height: 120px; /* Aumentado de 80px a 120px */
    width: 100%;
    object-fit: cover;
}
</style>
