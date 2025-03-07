<script setup>
import { onMounted } from "vue";
import Rellax from "rellax"; // Importamos la librería para el efecto

onMounted(() => {
    new Rellax(".parallax", { speed: -5 }); // Ajusta la velocidad del efecto
});
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
                    <p>Yogui-ri es una página web que ofrece miles de opciones de rutas turísticas por cualquier rincón
                        del mundo.</p>
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
        <div class="content-section py-5">
            <div class="container">
                <h2 class="text-center fw-bold">Explora Más</h2>
                <p class="text-center text-muted">Desplázate hacia abajo para ver más contenido.</p>
                <div class="row">
                    <div v-for="i in 5" :key="i" class="col-md-4 mb-4">
                        <div class="card shadow-lg border-0 content-card p-4">
                            <h4 class="fw-bold">Artículo {{ i }}</h4>
                            <p>Descubre nuevas experiencias en cada destino.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

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
    height: 40vh;
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
</style>
