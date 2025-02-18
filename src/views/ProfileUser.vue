<script setup>

</script>

<template>
 <!-- Pestañas para el cliente-->
 <div v-if="userAuth && rol == 'cliente'" class="container">
        <!-- Pestañas del administrador -->
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                    type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Rutas
                    Reservadas</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
                    type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Rutas
                    Realizadas</button>
            </li>
        </ul>
        <div class="tab-content" id="myTabContent">
            <!--Contenido de la ventana de Gestion de Usuarios-->
            <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab"
                tabindex="0">
                <ul>
                    <li>Rutas reservadas</li>
                </ul>
            </div>
            <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
                Rutas Realizadas
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>