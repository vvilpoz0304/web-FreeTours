<script setup>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';


const props = defineProps({
    userAuth: Object,
    didClientThisRoute: Boolean,
    thisRouteID: Number
})


const userID = props.userAuth.id || null;  // Obtenemos el id en caso de estar logueado

const valorations = ref([])
const newValoration = ref({
    user_id: '',
    ruta_id: '',
    estrellas: '',
    comentario: ''
});
function addValoration() {
    newValoration.value.user_id = userID;
    newValoration.value.ruta_id = props.thisRouteID;
    newValoration.value.estrellas = rating.value;

    fetch('http://localhost/freetours/api.php/valoraciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newValoration.value)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(() => {
            Swal.fire({
                title: "Valoración registrada.",
                text: "¡Gracias por su valoración!",
                icon: "success"
            });
            alreadyRated.value = true;
            newValoration.value.comentario = ''; // Limpiar comentario después de enviar
            valorationsThisRoute(); // Cargar valoraciones después de enviar
        })
        .catch(error => {
            console.error('Error al crear la valoración:', error);
        });
}

// Conseguimos las valoraciones de esa ruta para obtener los comentarios posteriormente
function valorationsThisRoute() {
    const rutaId = props.thisRouteID
    fetch(`http://localhost/freetours/api.php/valoraciones?ruta_id=${rutaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            valorations.value = data;
            alreadyRated.value = valorations.value.some(val => val.cliente_id == userID);

            if (alreadyRated.value) {
                const userRating = valorations.value.find(val => val.cliente_id == userID);
                rating.value = userRating.puntuacion;
            } else {
                rating.value = null; // Se asigna correctamente sin crear un nuevo ref()
            }
        })
        .catch(error => {
            console.error(`Error al obtener las valoraciones para la ruta ${rutaId}:`, error);
        });
}
valorationsThisRoute();

///////////////////////////
/// Rating de estrellas ///
///////////////////////////

const alreadyRated = ref(false);
const rating = ref(null);
const mouseHoverRating = ref(null);
const totalStars = 5;

const currentRatingText = computed(() => // Mediante la propiedad computed miramos cada vez que se haga click en una estrella cambie el texto
    rating.value ? `¡Has seleccionado ${rating.value} estrellas!` : "No has seleccionado ninguna valoración."

);

const mouseHoverRatingText = computed(() =>
    mouseHoverRating.value ? `Click para valorar ${mouseHoverRating.value} estrellas` : "No has seleccionado ninguna valoración."
);

const setRating = (newRating) => {
    if (!alreadyRated.value) { // Controlamos que si ya se ha valorado anteriormente no pueda cambiar el valor;
        rating.value = newRating;
    }
};

</script>
<template>
    <section class="container mt-2 shadow rounded">
        <div class="comment-section">
            <h3>Comentarios</h3>
            <!-- Formulario para agregar comentarios -->
            <div class="comment-form d-flex flex-column align-items-center" v-if="didClientThisRoute">
            </div>
            <div v-if="!alreadyRated">
                <div class="d-flex flex-column align-items-center">
                    <div class="star-rating">
                        <!-- Escribimos mediante un v-for las 5 estrellas y dependiendo de su estado las cambiamos de una manera u otra-->
                        <span v-for="star in totalStars" :key="star" class="star"
                            :class="{ filled: star <= (mouseHoverRating || rating) }" @click="setRating(star)">
                            ★
                        </span>
                    </div>
                    <div class="rating-text">{{ currentRatingText }}</div>
                    <!-- Escribimos el texto mediante la interpolacion -->
                    <div>
                        <textarea v-model="newValoration.comentario" @keyup.enter="addValoration"
                            placeholder="Escribe un comentario..." class="comment-input" />
                        <button @click="addValoration" class="comment-btn">Añadir </button>
                    </div>
                </div>
            </div>
            <div v-else>
                <p class="text-center">¡Ya has valorado esta ruta! :D</p>
            </div>
            <!-- Lista de comentarios -->
            <ul class="comment-list">
                <li v-for="comment in valorations" :key="comment.valoracion_id" class="comment-item">
                    <div class="container shadow comment rounded">
                        <p v-if="comment.cliente_id == userID" class="small">{{ comment.cliente_nombre }} (Tu
                            comentario)<span class="badge text-bg-secondary ms-3 small">{{ comment.puntuacion }}
                                ⭐</span></p>
                        <p v-else class="small">{{ comment.cliente_nombre }}<span
                                class="badge text-bg-secondary ms-3 small">{{ comment.puntuacion }} ⭐</span></p>
                        <p class="fs-5">{{ comment.comentario }}</p>
                        <p class="small">{{ }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>
<style scoped>
.comment-section {
    margin: 20px auto;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background: #fff;
}

h3 {
    text-align: center;
    margin-bottom: 15px;
}

.comment-form {
    display: flex;
    gap: 10px;
}

.comment-input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.comment-btn {
    padding: 8px 12px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.comment-btn:hover {
    background: #0056b3;
}

.comment-list {
    list-style: none;
    padding: 0;
    margin-top: 15px;
}

.comment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
}
.comment{
    background-color: rgb(240, 240, 240);
    border: 1px solid gray;
    padding: 1em;
}
.delete-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
}

.star-rating {
    display: flex;
    gap: 5px;
    font-size: 30px;
    cursor: pointer;
}

.star {
    color: gray;
    transition: color 0.3s;
}

.star.filled {
    color: gold !important;
}

.rating-text {
    margin-top: 10px;
    font-weight: bold;
}
</style>
