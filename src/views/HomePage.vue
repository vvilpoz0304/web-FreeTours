<script setup>

</script>
<template>
  <section class="fondo-buscador d-flex flex-column justify-content-center align-items-center">
    <div id="formBusqueda">
      <label for="buscador">Busca la ruta deseada:</label>
      <input type="text" name="buscador">
    </div>
  </section>
  <div class="listaRutas">
    
  </div>
</template>

<style scoped>
.fondo-buscador{
  background-image: url("/images/fondoBuscador.avif");
  background-size: cover;
  height: 40vh;
}
#formBusqueda{
  flex: 1;
}
</style>
