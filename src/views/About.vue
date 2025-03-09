<script setup>
import { onMounted, ref } from "vue";
import Rellax from "rellax"; // Importamos la librería para el efecto

onMounted(() => {
    new Rellax(".parallax", { speed: -3 }); // Ajusta la velocidad del efecto
});

const comments = ref([]);

function getComments() {
    fetch('http://localhost/freetours/api.php/valoraciones')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => comments.value = data)
        .catch(error => {
            console.error('Error al obtener las valoraciones:', error);
        })
}
getComments();

const medio = ref(null);
const play = ref("\u25BA"); // ▶ (Play)


const accionPlay = () => {
    if (!medio.value.paused && !medio.value.ended) {
        medio.value.pause();
        play.value = "\u25BA"; // ▶ (Play)
        document.body.style.backgroundColor = "#fff";
    } else {
        medio.value.play();
        play.value = "||"; // Pausa
        document.body.style.backgroundColor = "lightgrey";
    }
};

const accionReiniciar = () => {
    medio.value.currentTime = 0;
    medio.value.play();
    play.value = "||";
};

const accionRetrasar = () => {
    medio.value.currentTime = Math.max(0, medio.value.currentTime - 10);
};

const accionAdelantar = () => {
    if (medio.value.currentTime + 10 >= medio.value.duration) {
        medio.value.currentTime = medio.value.duration;
        play.value = "\u25BA"; // ▶ (Play)
    } else {
        medio.value.currentTime += 10;
    }
};

const accionSilenciar = () => {
    medio.value.muted = !medio.value.muted;
};

const accionMasVolumen = () => {
    medio.value.volume = Math.min(1, medio.value.volume + 0.1);
};

const accionMenosVolumen = () => {
    medio.value.volume = Math.max(0, medio.value.volume - 0.1);
};
</script>

<template>
    <div>
        <!-- Sección Parallax -->
        <div class="parallax d-flex justify-content-center align-items-center text-white">
            <h1 class="display-3 fw-bold text-shadow">Sobre Yogui-ri</h1>
        </div>

        <!-- Sección "Quienes Somos" con Glassmorphism -->
        <div class="container my-5 firstContainer p-5 rounded shadow-lg">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <h2 class="fw-bold">¿Quiénes Somos?</h2>
                    <p>En Yogui-ri, creemos que viajar es mucho más que visitar lugares; es vivir
                        experiencias auténticas, descubrir la historia de cada rincón y conectar con la cultura local.
                        Somos un equipo de guías apasionados que ofrecemos free tours inolvidables para que explores la
                        ciudad de una manera única, divertida y accesible.

                        Nuestros recorridos están diseñados para todos los viajeros, desde aquellos que buscan conocer
                        los monumentos más emblemáticos hasta quienes desean perderse en calles llenas de historia y
                        secretos.

                        Acompáñanos en esta aventura y descubre la magia de la naturaleza y la historia con nosotros.
                        ¡Tu próximo viaje comienza aquí!</p>
                </div>
                <div class="col-md-6">
                    <div id="carouselExample" class="carousel slide shadow-lg rounded overflow-hidden">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img src="/images/fotoRuta1.jpeg" class="d-block w-100 rounded" alt="...">
                            </div>
                            <div class="carousel-item">
                                <img src="/images/fotoRuta2.jpeg" class="d-block w-100 rounded" alt="...">
                            </div>
                            <div class="carousel-item">
                                <img src="/images/fotoRuta3.jpeg" class="d-block w-100 rounded" alt="...">
                            </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample"
                            data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExample"
                            data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sección de Contenido -->
        <section class="content-section py-5">
            <div class="container">
                <h2 class="text-center fw-bold">Nuestros clientes están satisfechos con nuestros tours</h2>
                <div class="row">
                    <div v-for="comment in comments.slice(0, 6)" :key="comment.valoracion_id" class="col-md-4 mb-4">
                        <div class="card shadow-lg border-0 content-card p-4">
                            <h4 class="fw-bold">{{ comment.cliente_nombre }}</h4>
                            <p>{{ comment.comentario }}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <!-- Sección de Video -->
                    <div class="d-flex flex-column align-items-center shadow rounded">
                        <video ref="medio" controls class="w-50">
                            <source src="/images/video.mp4" type="video/mp4" />
                            <source src="/images/video.webm" type="video/webm" />
                        </video>
                        <div class="d-flex botones">
                            <button @click="accionSilenciar">&#128263;</button>
                            <button @click="accionMenosVolumen">&#128265;</button>
                            <button @click="accionRetrasar">&#9194;</button>
                            <button @click="accionPlay">{{ play }}</button>
                            <button @click="accionReiniciar">&#128260;</button>
                            <button @click="accionAdelantar">&#9193;</button>
                            <button @click="accionMasVolumen">&#128266;</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Otra Sección Parallax -->
        <div class="parallax d-flex justify-content-center align-items-center text-white">
            <h1 class="display-3 fw-bold text-shadow">¡Scroll para ver más!</h1>
        </div>
    </div>
</template>

<style scoped>
/* Fondo Parallax */
.parallax {
    position: relative;
    background-image: url("/images/parallax.jpeg");
    height: 50vh;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Superposición para mejorar legibilidad */
.parallax::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
}

.parallax h1 {
    position: relative;
    z-index: 2;
}

/* Sombra en el texto */
.text-shadow {
    text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.6);
}

/* Glassmorphism para secciones */
.firstContainer {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 30px;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Sección de contenido */
.content-section {
    background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
    min-height: 60vh;
}

/* Tarjetas con efecto de elevación */
.content-card {
    background: white;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.content-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Carousel estilos */
.carousel img {
    transition: transform 0.3s ease-in-out;
}

.carousel img:hover {
    transform: scale(1.05);
}

.botones button {
    border: none;
    padding: 2em 2em;
}

.botones button:hover {
    background-color: lightgray;
}
</style>
