<script setup>
import { onMounted, ref, computed } from 'vue';
import Swal from 'sweetalert2'; // Importamos SweetAlert2 para mostrar mensajes de confirmacion https://sweetalert2.github.io/;

const props = defineProps({
  userAuth: Object
});


let routes = ref([]); // Las rutas que se van a mostrar
let allRoutes = ref([]);  // Para almacenar todas las rutas

// Al principio coinseguimos todas las rutass disponibles;
function getRoutesAvailable() {
  fetch('http://localhost/freetours/api.php/rutas', {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      allRoutes.value = data
      let today = new Date();

      routes.value = allRoutes.value.filter(route => {
        let routeDate = new Date(route.fecha);
        return routeDate >= today;
      })
    })
    .catch(error => console.error('Error:', error));
}

let dateFiltered = ref(''); // Variable para guardar la fecha indicada;

// Utilizamos la libreria SweetAlert2 para ahorrarnos hacer el modal y conseguir la fecha deseada;
async function openFilter() {
  const { value: selectedDate } = await Swal.fire({
    title: "Seleccione la fecha deseada",
    input: "date",
    inputPlaceholder: dateFiltered.value ? dateFiltered.value : '',
    didOpen: () => {
      const today = (new Date()).toISOString();
      Swal.getInput().min = today.split("T")[0];
    }
  });
  if (selectedDate) {
    dateFiltered.value = selectedDate; // Guardamos la fecha
    getRoutesByDate(dateFiltered.value); // Llamamos a la funcion para filtrar las rutas;
  } else{
    getRoutesAvailable()
  }
}
// Funcion para filtrar las rutas por la fecha indicada
function getRoutesByDate(date) {
  fetch('http://localhost/freetours/api.php/rutas', {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      routes.value = data;

      routes.value = allRoutes.value.filter(route => {
        return route.fecha == dateFiltered.value;
      })
    })
    .catch(error => console.error('Error:', error));
}

const routeName = ref('');

// Tambien hacemos una funcion para filtrar las rutas por nombre
function getRoutesByName() {
  if (routeName.value.length > 0) {
    let today = new Date();
    routes.value = allRoutes.value.filter(route => {
      let routeDate = new Date(route.fecha);
      return route.titulo.toLowerCase().includes(routeName.value.toLowerCase())
        && routeDate > today;
    });
  } else {
    getRoutesAvailable();
  }




}

onMounted(() => {
  getRoutesAvailable();
});

////////////////////////////////
///  Paginacion de las rutas ///
////////////////////////////////
let currentPage = ref(1);
let routesperpage = 4;
let totalPages = computed(() => Math.ceil(routes.value.length / routesperpage)); // Calculamos el numero de paginas totales, lo hacemos computed para que se actulice automaticamente cuando el numero de usuarios cambie

let paginatedRoutes = computed(() => {
  const start = (currentPage.value - 1) * routesperpage; // Calculamos el inicio de los registros de la pagina
  const end = start + routesperpage; // Al numero inicial le sumamos los 10 registros que queremos mostrar
  return routes.value.slice(start, end); // Devolvemos los registros que queremos mostrar
})

function nextPage() {
  if (currentPage.value < Math.ceil(routes.value.length / routesperpage)) { // Comprobamos que no estemos en la utlima pagina
    currentPage.value++;
  }
}
function previousPage() {
  if (currentPage.value > 1) { // Comprobamos que no estamos en la primera pagina;
    currentPage.value--;
  }
}
</script>

<template>
  <!-- Buscador -->
  <section class="fondo-buscador d-flex flex-column justify-content-center align-items-center py-4">
    <div class="container formBuscador">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="input-group shadow">
            <input type="text" class="form-control" v-model="routeName" @input="getRoutesByName"
              placeholder="Ejemplo: Ruta Histórica..." />
            <button type="button" class="btn" @click="openFilter()"><img src="/images/filtro.png"></button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Título -->
  <div class="container text-center my-5">
    <h1 class="fw-bold">Explora cualquier rincón del mundo con Yogui-ri</h1>
  </div>

  <!-- Lista de rutas -->
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10"> <!-- Contenedor para centrar la lista -->
        <section v-if="paginatedRoutes.length > 0">
          <div v-for="route in paginatedRoutes" :key="route.id">
            <div class="card mb-4 shadow-lg">
              <div class="row g-0">
                <!-- Imagen -->
                <div class="col-md-3 d-flex align-items-center">
                  <div class="image-container">
                    <img :src="route.foto" class="img-fluid rounded-start object-fit-cover imgRoute"
                      alt="Imagen de la ruta" />
                  </div>
                </div>

                <!-- Detalles -->
                <div class="col-md-6">
                  <div class="card-body">
                    <h2 class="card-title d-flex align-items-center">
                      <RouterLink :userAuth="userAuth" :to="{ name: 'InformacionRuta', params: { ruta_id: route.id } }"
                        class="text-decoration-none">
                        {{ route.titulo }}
                      </RouterLink>
                    </h2>

                    <p class="card-text mb-2">
                      <strong>Fecha:</strong> {{ route.fecha }} |
                      <strong>Hora:</strong> {{ route.hora }} <br>
                      <img src="/images/pin.png" class="w-10"> {{ route.localidad }}
                    </p>
                    <p class="card-text text-muted">
                      {{ (route.descripcion).slice(0, 100) }}...
                    </p>
                  </div>
                </div>

                <!-- Botón Reservar -->
                <div class="col-md-3 d-flex align-items-center justify-content-center">
                  <RouterLink class="btn btn-success btn-lg px-4"
                    :to="{ name: 'InformacionRuta', params: { ruta_id: route.id } }">
                    Reservar
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Paginación -->
          <nav aria-label="Paginacion de rutas">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="previousPage">Previous</a>
              </li>
              <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
              </li>
            </ul>
          </nav>
        </section>

        <!-- Mensaje si no hay rutas -->
        <section v-else class="d-flex flex-column align-items-center">
          <img src="/images/noData.png" width="250px">
          <p style="color: red;">No se ha encontrado ninguna ruta con estos datos :(</p>
        </section>
      </div>
    </div>
  </div>

</template>
<style scoped>
.fondo-buscador {
  background-image: url("/images/fondoBuscador.avif");
  background-size: cover;
  height: 40vh;
}

.formBuscador {
  background-color: rgba(181, 251, 153, 0.7);
}

.image-container {
  width: 100%;
  height: 200px;
  /* Ajusta el tamaño fijo que deseas para la imagen */
  overflow: hidden;
}

.imgRoute {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/*
#formBusqueda {
  /*flex: 1; 
}
*/
</style>
