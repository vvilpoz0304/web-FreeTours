<script setup>
// Importamos todo lo necesario;
import { onMounted, ref, computed, watch } from 'vue';
import L from 'leaflet'; // Importamos Leaflet para poder utilizarlo en la creacion de rutas ;
import 'leaflet/dist/leaflet.css'; // Estilo de LeafLet 
import { OpenStreetMapProvider } from 'leaflet-geosearch'; // API de LeafLet
import Swal from 'sweetalert2'; // Importamos SweetAlert2 para mostrar mensajes de confirmacion https://sweetalert2.github.io/;

///////////////////////////
//// CREACION DE RUTAS ////
///////////////////////////

// Mapa
let map = null;
let marker = null;

function showMap() {
    map = L.map('map').setView([40.4168, -3.7038], 13); // Coords de Madrid por defecto
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click', function (e) { // En caso de hacer click en el mapa
        if (marker) {
            map.removeLayer(marker); // En caso de ya haber un marcador, lo eliminamos
        }
        marker = L.marker(e.latlng).addTo(map); // Añadimos el nuevo marcador al mapa
        formCreator.value.latitud = e.latlng.lat; // Redeclaramos la longitud y longitud seleccionada en el mapa
        formCreator.value.longitud = e.latlng.lng;
    });
    map.invalidateSize();

}

onMounted(() => {
    showMap(); // Mostramos el mapa una vez se haya montado el componente;
});

// Funcion para buscar una localizacion en el mapa;
async function searchLocation(location) {
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: location }); // Llamamos a la funcion "OpenStreetMapProvider" de Leaflet con el metodo "search" pasandole la query "location" que son los datos obtenidos del formulario;

    if (results && results.length > 0) { // Comprobamos que haya habido resultados y que sean válidos
        const { x, y } = results[0];
        map.setView([y, x], 13);
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker([y, x]).addTo(map);
        formCreator.value.latitud = y;
        formCreator.value.longitud = x;
    }
}

let formCreator = ref({
    titulo: '',
    localidad: '',
    longitud: '',
    latitud: '',
    descripcion: '',
    fecha: '',
    hora: '',
    foto: '',
    guia_id: ''
});

// Funcion para crear una ruta
function createRoute() {
    fetch('http://localhost/freetours/api.php/rutas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formCreator.value)
    })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
    let timerInterval; // Declaramos el intervalo de tiempo para el mensaje de confirmacion;
    Swal.fire({
        title: "¡Ruta creada!",
        text: `La ruta en ${formCreator.value.titulo} ha sido creada correctamente.`,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    });
    invalidDate.value = true;

    // Limpiamos los campos del formulario;
    formCreator.value.titulo = '';
    formCreator.value.localidad = '';
    formCreator.value.longitud = '';
    formCreator.value.latitud = '';
    formCreator.value.descripcion = '';
    formCreator.value.fecha = '';
    formCreator.value.hora = '';
    formCreator.value.foto = '';
    formCreator.value.guia_id = '';

    getRoutes(); // Actualizamos las rutas;
}

// Validamos que los campos obligatorios esten rellenos;
let valid = ref(false);

function validForm() {
    // if(formCreator.value.longitud.length != 0 || formCreator.value.latitud.length != 0 ||
    // !isNaN(formCreator.value.longitud) || !isNaN(formCreator.value.latitud)){
    //     map.setView([formCreator.value.latitud, formCreator.value.longitud], 13);
    // }
    validDate()
    if (formCreator.value.titulo.length == 0 || formCreator.value.localidad.length == 0 ||
        formCreator.value.longitud.length == 0 || formCreator.value.latitud.length == 0 ||
        isNaN(formCreator.value.longitud) || isNaN(formCreator.value.latitud) ||
        formCreator.value.fecha.length == 0 || formCreator.value.hora.length == 0 ||
        formCreator.value.foto.length == 0 || !invalidDate.value) {
        valid.value = false;
    } else {
        valid.value = true;
    }
}

//Comprobamos que la fecha introducida sea válida
let invalidDate = ref(true);

function validDate() {
    let today = new Date();
    let date = new Date(formCreator.value.fecha);

    if (today.getTime() > date.getTime() || formCreator.value.hora < today.getTime()) { // La fecha introducida no puede ser anterior al dia de hoy;
        invalidDate.value = false;
    } else {
        invalidDate.value = true;
    }
}


// Funcion para obtener los guias disponibles;
const guideAvailable = ref([]);

function getGuidesAvailable(fecha) {
    fetch(`http://localhost/freetours/api.php/asignaciones?fecha=${fecha}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => guideAvailable.value = data)
        .catch(error => console.error('Error:', error));
}

</script>
<template>
    <form class="p-4 border rounded shadow bg-light">
        <div class="row mb-3 g-3">
            <div class="col-md-6">
                <label for="titulo" class="form-label" aria-label="titulo">Título de la ruta:*</label>
                <input type="text" id="titulo" name="titulo" class="form-control" placeholder="Título de la ruta"
                    v-model="formCreator.titulo" @input="validForm()">
            </div>
            <div class="col-md-6">
                <label for="localidad" class="form-label" aria-label="Localidad">Localidad:*</label>
                <input type="text" id="localidad" name="localidad" class="form-control" placeholder="Localización"
                    v-model="formCreator.localidad" @input="validForm()">
            </div>
        </div>

        <div class="row mb-3 g-3">
            <div class="col-md-6">
                <label for="longitud" class="form-label" aria-label="Longitud" @input="validForm()">Longitud:*</label>
                <input type="text" id="longitud" name="longitud" class="form-control" placeholder="Longitud"
                    v-model="formCreator.longitud" @input="validForm()">
            </div>
            <div class="col-md-6">
                <label for="latitud" class="form-label" aria-label="Latitud">Latitud:*</label>
                <input type="text" id="latitud" name="latitud" class="form-control" placeholder="Latitud"
                    v-model="formCreator.latitud" @input="validForm()">
            </div>
        </div>

        <div class="mb-3">
            <label for="direccion" class="form-label" aria-label="Direccion">Buscar dirección:</label>
            <input name="direccion" @change="searchLocation($event.target.value)" placeholder="Buscar dirección"
                class="form-control" />
            <div id="map" class="mt-2 border rounded"></div>
        </div>

        <div class="row mb-3 g-3">
            <div class="col-md-6">
                <label for="fecha" class="form-label" aria-label="Fecha">Fecha:*</label>
                <input type="date" id="fecha" name="fecha" class="form-control" v-model="formCreator.fecha"
                    @input="validForm()" @change="getGuidesAvailable(formCreator.fecha)">
                <p v-if="!invalidDate">La fecha debe ser posterior al día de hoy.</p>
            </div>
            <div class="col-md-6">
                <label for="hora" class="form-label" aria-label="Hora">Hora:*</label>
                <input type="time" id="hora" name="hora" class="form-control" v-model="formCreator.hora"
                    @input="validForm()">
            </div>
        </div>

        <div class="row mb-3 g-3">
            <div class="col-md-12">
                <label for="guia" class="form-label" aria-label="Guia">Asignar Guía:</label>
                <select id="guia" name="guia" class="form-control" v-model="formCreator.guia_id"
                    title="Guias disponibles en la fecha seleccionada">
                    <option value="">Seleccionar guia:</option>
                    <option v-for="guide in guideAvailable" :key="guide.id" :value="guide.id">
                        Guía con ID: {{ guide.id }}
                    </option>
                    <option value="">No asignar Guia</option>
                </select>
            </div>
        </div>

        <div class="mb-3">
            <label for="foto" class="form-label" aria-label="Imagen">Inserte la URL de la imagen de la
                ruta:*</label>
            <input type="text" id="foto" name="foto" class="form-control" placeholder="URL de la imagen"
                v-model="formCreator.foto" @input="validForm()">
            <label for="desc" class="form-label" aria-label="Descripcion">Descripción:</label>
            <textarea id="desc" name="desc" class="form-control" rows="4" placeholder="Descripción de la ruta"
                v-model="formCreator.descripcion"></textarea>
        </div>

        <div class="text-center">
            <button type="submit" class="btn w-50" @click.prevent="createRoute()" :disabled="!valid" id="createButton"
                title="Enviar formulario">Enviar</button>
        </div>
    </form>
</template>

<style scoped>
.main {
    margin-top: 2em;
    border-radius: 5px;
}

#createButton {
    background-color: #7ac58a;
    border: none;
}

#map {
    height: 35em !important;
    width: 100% !important;
}

.routesList {
    width: 100% !important;
}

.infoRoute {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    border-radius: 5px;
    /* Permite que los elementos se acomoden en pantallas pequeñas */
    padding: 1rem;
}
</style>