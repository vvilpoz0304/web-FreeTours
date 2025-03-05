<script setup>
import { onMounted, ref } from 'vue';

let routes = ref([]);

function getRoutesAvailable() {
  fetch('http://localhost/freetours/api.php/rutas', {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => routes.value = data)
    .catch(error => console.error('Error:', error));
}

onMounted(() => {
  getRoutesAvailable();
})
</script>
<template>
  <section class="fondo-buscador d-flex flex-column justify-content-center align-items-center">
    <div id="formBusqueda">
      <label for="buscador">Busca la ruta deseada:</label>
      <input type="text" name="buscador" placeholder="Ejemplo: Ruta Historica...">
    </div>
  </section>
  <div class="d-flex flex-column align-items-center">
    <h1>Explora cualquier rincon del mundo con Yogui-ri</h1>
    <div class="card mb-3 w-100 h-auto d-flex justify-content-center" style="max-width: 75em" v-for="route in routes"
      :key="route.id">

      <div class="row g-0 align-items-center">
        <!-- Imagen de la ruta -->
        <div class="col-md-2 d-flex justify-content-center">
          <img :src="route.foto" alt="Imagen de la ruta" class="img-fluid rounded" style="object-fit: cover;" />
        </div>

        <!-- Detalles de la ruta -->
        <div class="col-md-7">
          <div class="card-body">
            <h2 class="card-title fw-bolder d-flex align-items-center">
              <RouterLink :userAuth="userAuth" :to="{ name: 'InformacionRuta', params: { ruta_id: route.id } }">
                {{ route.titulo }}
              </RouterLink>
              <span class="badge text-bg-secondary ms-3 fs-6 bg-success">
                {{ route.valoracion }} ⭐
              </span>
            </h2>

            <p class="card-text mb-3">
              <strong>Fecha:</strong> {{ route.fecha }} |
              <strong>Hora:</strong> {{ route.hora }}
            </p>
            <p class="card-text">
              <strong>Descripción:</strong> {{ (route.descripcion).slice(0, 100) }}...
            </p>
          </div>
        </div>

        <!-- Número de asistentes -->
        <div class="col-md-3 text-center">
          <RouterLink :to="{ name: 'InformacionRuta', params: { ruta_id: route.id } }">Reservar</RouterLink>
        </div>
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

#formBusqueda {
  /*flex: 1; */
}
</style>
