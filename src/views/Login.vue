<script setup>
// Codigo de la "animacion" hecho en React: https://github.com/martinacostadev/login-bear

// Importamos el ref y el watch de vue y ademas importamos los array de imagenes del archivo "images.js"
// el funcionamiento se basa en seleccionar una imagen del array que contiene los frames de las imagenes en base64
import { ref, watch } from "vue";
import { images, bearPasswordImage } from "./images.js";
import router from "@/router";
import Swal from 'sweetalert2'; // Importamos SweetAlert2 para mostrar mensajes de confirmacion https://sweetalert2.github.io/;


// Declaramos las varaibles de la imagen y el input del email
const emailLog = ref("");
const image = ref(images[0]);

// Esta función se encarga de medir la longitud del email e irá establciendo la imagen necesaria;
const handleEmail = () => {
    image.value =
        emailLog.value.length >= 20
            ? images[images.length - 1]
            : images[emailLog.value.length];
};

// Esta funcion se encarga de hacer la "transicion", se hace mediante cambair el frame de la foto con timeOuts;
const handlePasswordFocus = () => {
    setTimeout(() => {
        image.value = bearPasswordImage[0];
    }, 150);
    setTimeout(() => {
        image.value = bearPasswordImage[1];
    }, 300);
};

// Esta funcion funciona de la misma manera destapandose los ojos
const handlePasswordBlur = () => {
    setTimeout(() => {
        image.value = bearPasswordImage[0];
    }, 300);
    setTimeout(() => {
        handleEmail();
    }, 600);
};

// Usamos "watch()" para reaccionar a los cambios en el email;
watch(emailLog, handleEmail);


// Conseguimos los datos del LogIn
// emailLog lo hemos conseguido anteriormente
let formLogin = ref({ email: emailLog, password: '' });

// Controlamos si ya tiene una cuenta existente o no para mostrar un formulario u otro;
let showLogin = ref(true);

function alternateLogin() {
    showLogin.value = !showLogin.value
}


// Creamos la funcion de inicio de Sesion;
const emit = defineEmits(["sessionStarted"]) // Declaramos el emit de sesion iniciada
const error = ref(''); // Mensaje de error en la contraseña
const API = "http://localhost/freetours/api.php" // Declaramos la API

async function logIn() { // Funcion que comprueba si los datos introducidos corresponden a algun cliente y en caso afirmativo crea el emit con el usuario que ha iniciado sesion
    try {
        const response = await fetch(API + "/usuarios");
        const users = await response.json();

        console.log(users)
        const userFound = users.find(
            (e) => e.email === formLogin.value.email && e.contraseña === formLogin.value.password
        );

        if (userFound) {
            localStorage.setItem("session", JSON.stringify(userFound));

            emit("sessionStarted",
                {
                    id: userFound.id,
                    nombre: userFound.nombre,
                    email: userFound.email,
                    rol: userFound.rol
                })
            error.value = '';

            router.push("/") // Redirige a la vista "home"
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: `Inicio de sesión correcto, Bienvendio ${userFound.nombre}`
            });
        } else {
            error.value = 'Usuario o contraseña incorrectos';
        }
    } catch (err) {
        error.value = 'Error al cargar los datos';
    }
}

// Conseguimos los datos del registro;
const formSign = ref({
    nombre: '',
    email: '',
    contraseña: ''
})
const confirmPass = ref('');



// Declaramos los mensajes de error;
let errName = ref(false);
let errEmailNotValid = ref(false);
let errEmailRep = ref(false);
let errPass = ref(false);
let errConfPass = ref(false);

const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#?!$%^&*\-+_]).{8,}$/;


function validateSignIn() {
    formSign.value.nombre.length > 0 ? errName.value = false : errName.value = true;
    emailRegEx.test(formSign.value.email) == true ? errEmailNotValid.value = false : errEmailNotValid.value = true;
    notRepeatEmail();
    formSign.value.contraseña.length >= 8 && passwordRegex.test(formSign.value.contraseña) ? errPass.value = false : errPass.value = true;
    confirmPass.value == formSign.value.contraseña ? errConfPass.value = false : errConfPass.value = true;

    if (!errName.value && !errEmailNotValid.value && !errEmailRep.value && !errPass.value && !errEmailNotValid.value && !errConfPass.value) {
        signIn();
        formSign.value.nombre = '';
        formSign.value.email = '';
        formSign.value.contraseña = '';
        confirmPass.value = '';
        alternateLogin();
    }

}

function notRepeatEmail() {
    fetch('http://localhost/freetours/api.php/usuarios', {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data =>
            errEmailRep.value = data.some(user => user.email == formSign.value.email)
        )
        .catch(error => console.error('Error:', error));
}

async function signIn() {
    const newUser = {
        nombre: formSign.value.nombre,
        email: formSign.value.email,
        contraseña: formSign.value.contraseña
    }
    const response = await fetch(API + "/usuarios", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
        .then(response => response.json())
        .then(data => Swal.fire({
            title: "¡Usuario Registrado!",
            text: "Registro realizado correctamente, ¡Bienvenido!",
            icon: "success"
        }))
        .catch (error => console.error("Error " + error));


}

</script>

<template>
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
      <div class="row w-100">
        <!-- Formulario de Iniciar Sesión -->
        <div v-if="showLogin" class="col-md-6 mx-auto">
          <div class="card shadow-lg border-0 p-4">
            <h2 class="text-center fw-bold mb-4">¡Bienvenido!</h2>
            <img class="logo img-fluid mx-auto d-block mb-3" :src="image" alt="Logo" />
            <p v-if="error" class="text-danger text-center">{{ error }}</p>
  
            <div class="mb-3">
              <label for="emailLog" class="form-label">Email:</label>
              <input name="emailLog" type="email" class="form-control" placeholder="Correo electrónico" v-model="emailLog" />
            </div>
  
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña:</label>
              <input v-model="formLogin.password" name="password" type="password" class="form-control"
                placeholder="Al menos 8 caracteres" @focus="handlePasswordFocus" @blur="handlePasswordBlur" />
            </div>
  
            <button @click="logIn" class="btn btn-primary w-100">Iniciar Sesión</button>
            <p class="text-center mt-3">
              ¿Aún no tienes una cuenta? 
              <a href="#" @click.prevent="alternateLogin()" class="text-decoration-none">Registrarse</a>
            </p>
          </div>
        </div>
  
        <!-- Formulario de Registro -->
        <div v-else class="col-md-6 mx-auto">
          <div class="card shadow-lg border-0 p-4">
            <h2 class="text-center fw-bold mb-4">¡Regístrate ahora!</h2>
            <img class="logo img-fluid mx-auto d-block mb-3" src="/images/osoGinUp.png" alt="Logo" />
  
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre:</label>
              <input v-model="formSign.nombre" type="text" class="form-control" placeholder="Nombre de usuario" />
              <p v-if="errName" class="text-danger mt-1">¡El nombre no puede estar vacío!</p>
            </div>
  
            <div class="mb-3">
              <label for="email" class="form-label">Email:</label>
              <input v-model="formSign.email" type="email" class="form-control" placeholder="Correo electrónico" />
              <p v-if="errEmailNotValid" class="text-danger mt-1">Email no válido</p>
              <p v-if="errEmailRep" class="text-danger mt-1">Este email ya está registrado.</p>
            </div>
  
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña:</label>
              <input v-model="formSign.contraseña" type="password" class="form-control"
                placeholder="Debe incluir mayúsculas, minúsculas, números y símbolos" />
              <p v-if="errPass" class="text-danger mt-1">
                La contraseña debe tener mínimo 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.
              </p>
            </div>
  
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirmar Contraseña:</label>
              <input v-model="confirmPass" type="password" class="form-control" placeholder="Repite tu contraseña" />
              <p v-if="errConfPass" class="text-danger mt-1">Las contraseñas no coinciden.</p>
            </div>
  
            <button @click="validateSignIn()" class="btn btn-success w-100">Registrarse</button>
            <p class="text-center mt-3">
              ¿Ya tienes una cuenta? 
              <a href="#" @click.prevent="alternateLogin()" class="text-decoration-none">Iniciar Sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Ajuste del fondo y centrado */
  .container {
    background: #f8f9fa;
  }
  
  /* Logo */
  .logo {
    max-width: 120px;
  }
  
  /* Tarjeta */
  .card {
    max-width: 450px;
    margin: auto;
    padding: 20px;
  }
  </style>
  