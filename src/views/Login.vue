<script setup>
// Codigo hecho en React: https://github.com/martinacostadev/login-bear

// Importamos el ref y el watch de vue y ademas importamos los array de imagenes del archivo "images.js"
// el funcionamiento se basa en seleccionar una imagen del array que contiene los frames de las imagenes en base64
import { ref, watch } from "vue";
import { images, bearPasswordImage } from "./images.js";
import router from "@/router";

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
let formLogin = ref({email: emailLog, password: ''});


// Conseguimos los datos del registro;
let emailSign = ref("")
let nameSign = ref("");
let passSign = ref("");
let confirmPass = ref("");

// Controlamos si ya tiene una cuenta existente o no para mostrar un formulario u otro;
let showLogin = ref(true);

    function alternateLogin(){
        showLogin.value = !showLogin.value
    }
//Controlamos si ya hay una sesion iniciada;



// Creamos la funcion de inicio de Sesion;

const emit = defineEmits(["sessionStarted"])
const error = ref('');
const API = "http://localhost/freetours/api.php"

async function iniciarSesion() {
    try {
        const response = await fetch(API + "/usuarios");
        const users = await response.json();
        
        console.log(users)
        const userFound = users.find(
            (e) => e.email === formLogin.value.email && e.contraseña === formLogin.value.password
        );
//        const usuario = users.map( e => ({email: e.email, pass: e.contraseña}))
        //userFound = {nombre: userFound.nombre, email: userFound.email, rol: userFound.rol}
        console.log(userFound);
        
        if (userFound) {
            localStorage.setItem("session", JSON.stringify(userFound));

            emit("sessionStarted",
                {nombre: userFound.nombre,
                rol: userFound.rol})
            error.value = '';

            router.push("/home")
        } else {
            error.value = 'Usuario o contraseña incorrectos';
        }
    } catch (err) {
        error.value = 'Error al cargar los datos';
    }
}

</script>

<template>
    <div id="containerForms">
        <div class="formLogin" v-if="showLogin">
            <h1>¡Bienvenido!</h1>
            <img className="logo" alt="logo" :src="image"/>
            <p v-if="error" class="text-danger mt-2">{{ error }}</p>
            <label for="emailLog">Email: </label>
            <input name="emailLog" type="text" placeholder="E-mail" v-model="emailLog" />
            <label for="password">Password</label>
            <input v-model="formLogin.password" name="password" type="password" placeholder="At least 8 characters" @focus="handlePasswordFocus"
                @blur="handlePasswordBlur" />
            <button @click="iniciarSesion"> Log In</button>
            <p>Don't have an account yet? <a href="" @click.prevent="alternateLogin()"> Sign in</a></p>
            
        </div>
        <div class="formSignUp" v-else>
            <h1>¡Registrate ahora!</h1>
            <img className="logo" alt="logo" src="../assets/images/osoGinUp.png"/>
            <label for="Name">*Name:</label>
            <input v-model="nameSign" type="text" name="name" placeholder="Name">
            <label for="email">*Email: </label>
            <input v-model="emailSign" name="email" type="text" placeholder="E-mail" />
            <label for="password">*Password:</label>
            <input v-model="passSign" name="password" type="password" placeholder="At least 8 characters"/>
            <input v-model="confirmPass" name="password" type="password" placeholder="Repeat your password"/>
            <button >Sign Up</button>
            <p>Have an account? <a href="" @click.prevent="alternateLogin()"> Log in</a></p>
        </div>
    </div>
</template>

<style scoped>
#containerForms{
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.formLogin, .formSignUp{
    font-family: sans-serif;
    text-align: center;
    display: flex;
    flex-direction: column;
    width: 20em;
    margin: 2em 5em;
    font-size: 1.2em;
    border: 1px solid black;
    padding: 2em;

  }
  .logo {
    max-width: 9em;
    display: block;
    margin: 0 auto 30px;
  }
  label{
    text-align: left;
  }
  input {
    height: 1.5em;
    margin-bottom: 1em;
    font-size: .9em;
  }
  button{
    border: 0px;
    margin-bottom: 1em;
  }
 
</style>