<script setup>
import { onMounted, ref } from "vue";


//En caso de acceder sin estar logueado te redirige a Login;
const props = defineProps({
    userAuth: Object
});

if (!props.userAuth) {
    router.push("/login");
}

let rol = ref(JSON.parse(localStorage.getItem("session")).rol)
let idLogged = props.userAuth.id;

const routesAssigned = ref([]);

function getAssignations(idLogged) {
    fetch(`http://localhost/freetours/api.php/asignaciones?guia_id=${idLogged}`, {
        method: "GET",
    })
        .then(response => response.json())
        .then(data => {
            routesAssigned.value = data;
            console.log(routesAssigned.value);
        })
        .catch(error => console.error("Error:", error));
}

onMounted(() => {
    getAssignations(idLogged);
});
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

                <!-- Acordeón -->
                <div class="accordion" id="accordionExample">

                    <div v-for="route in routesAssigned" :key="route.ruta_id"
                        class="accordion-item shadow-sm mb-1 border top bg-white rounded hover-shadow w-100">

                        <!-- Título del acordeón -->
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed d-flex align-items-center p-0 border-0"
                                type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse-' + route.ruta_id"
                                aria-expanded="false" :aria-controls="'collapse-' + route.ruta_id">

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
                                <p><strong>Localización:</strong> {{ route.ruta_localidad }}</p>
                                <p><strong>Descripción:</strong> {{ route.ruta_descripcion }}</p>
                            </div>
                        </div>

                    </div> <!-- Fin de cada item del acordeón -->

                </div> <!-- Fin del acordeón -->

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
