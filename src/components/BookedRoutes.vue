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
    <div class="card mb-3 w-75 h-auto pe-5 d-flex justify-content-center w-100" style="max-width: 75em"
        v-for="booking in clientBooking" :key="booking.id">
        <div class="column d-flex align-items-center">
            <div class="col-md-2">
                <img :src="booking.ruta_foto" alt="Imagen de la ruta" class="img-fluid rounded"
                    style="object-fit: cover;" />
            </div>
            <div class="col-md-5">
                <div class="card-body">
                    <h2 class="card-title font-weight-bold d-flex align-items-center">
                        <RouterLink :userAuth="userAuth"
                            :to="{ name: 'InformacionRuta', params: { ruta_id: booking.ruta_id } }">
                            {{ booking.ruta_titulo }}
                        </RouterLink><span class="badge text-bg-secondary ms-4 fs-6 bg-success"> {{ booking.valoracion
                            }} ⭐</span>
                    </h2>
                    <div class="d-flex flex-row">
                        <p class="card-text">
                            <strong>Fecha:</strong> {{ booking.ruta_fecha }}. | <strong>Hora:</strong> {{
                                booking.ruta_hora }} <br>
                            <img src="/images/pin.png">{{ booking.ruta_localidad }}<br>
                            <strong>Descripcion:</strong> {{ (booking.ruta_descripcion).slice(0,100) }}...
                        </p>
                    </div>
                    <p class="card-text">
                        <small class="text-body-secondary"> </small>
                    </p>
                </div>
            </div>
            <div class="btn-group me-2" role="group" aria-label="Botones para usuarios">
                <p>Núm. Asistentes: {{ booking.num_personas }}</p>
                <button type="button" class="p-0.5 m-2" id="modifyAssist"
                    @click="modifyNumAssist(booking.num_personas, booking.reserva_id, booking.usuario_email, booking.ruta_id)">Modificar
                    Asistentes</button>
                <button type="button" class="p-0.5 m-2" id="cancelBooking"
                    @click="deleteBooking(booking.reserva_id)">Cancelar reserva</button>
            </div>
        </div>
    </div>

</template>
<style scoped>
/* Estilo de los botones*/
#modifyAssist {
    border: 0;
    background-color: lightgreen;
}

#cancelBooking {
    border: 0;
    background-color: rgb(255, 68, 68);
}
</style>