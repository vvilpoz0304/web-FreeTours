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
const newValoration = {
    user_id: '', // ID del usuario que realiza la valoración
    ruta_id: '', // ID de la ruta valorada
    estrellas: '', // Puntuación de 1 a 5
    comentario: '' //Este campo es opcional
};

function addValoration() {
    newValoration.user_id = userID;
    newValoration.ruta_id = props.thisRouteID;
    newValoration.estrellas = rating.value;

    fetch('http://localhost/freetours/api.php/valoraciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newValoration)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(
            Swal.fire({
                title: "Valoracion registrada.",
                text: "¡Gracias por su valoracion!",
                icon: "success"
            })
        )
        .catch(error => {
            console.error('Error al crear la valoración:', error);
        });
}

///////////////////////////
/// Rating de estrellas ///
///////////////////////////
const rating = ref(null);
const mouseHoverRating = ref(null);
const totalStars = 5;

const currentRatingText = computed(() =>
    rating.value ? `¡Has seleccionado ${rating.value} estrellas!` : "No has seleccionado ninguna valoración."

);

const mouseHoverRatingText = computed(() =>
    mouseHoverRating.value ? `Click para valorar ${mouseHoverRating.value} estrellas` : "No has seleccionado ninguna valoración."
);

const setRating = (newRating) => {
    rating.value = newRating;
};

</script>
<template>
    <div class="container mt-2 shadow rounded">
        <div class="comment-section">
            <h3>Comentarios</h3>
            <!-- Formulario para agregar comentarios -->
            <div class="d-flex flex-column align-items-center">
                <div class="star-rating">
                    <!-- Escribimos mediante un v-for las 5 estrellas y dependiendo de su estado las cambiamos de una manera u otra-->
                    <span v-for="star in totalStars" :key="star" class="star"
                        :class="{ filled: star <= (mouseHoverRating || rating) }" @click="setRating(star)">
                        ★
                    </span>
                </div>
                <div class="rating-text">{{ currentRatingText }}</div>
            </div>
            <div class="comment-form" v-if="!didClientThisRoute">
                <textarea v-model="newValoration.comentario" @keyup.enter="addValoration"
                    placeholder="Escribe un comentario..." class="comment-input" />
                <button @click="addValoration" class="comment-btn">Añadir </button>
            </div>

            <!-- Lista de comentarios -->
            <ul class="comment-list">
                <li v-for="comment in comments" :key="comment.id" class="comment-item">
                    <p>{{ comment.text }}</p>
                    <button @click="deleteComment(comment.id)" class="delete-btn">❌</button>
                </li>
            </ul>
        </div>
    </div>
</template>
<style scoped>
.comment-section {
    max-width: 500px;
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
    border-bottom: 1px solid #eee;
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
