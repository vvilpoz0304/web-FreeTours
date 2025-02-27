<script setup>
// Codigo de la "animacion" hecho en React: https://github.com/martinacostadev/login-bear

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

// Controlamos si ya tiene una cuenta existente o no para mostrar un formulario u otro;
let showLogin = ref(true);

    function alternateLogin(){
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
//        const usuario = users.map( e => ({email: e.email, pass: e.contraseña}))
        //userFound = {nombre: userFound.nombre, email: userFound.email, rol: userFound.rol}
        
        if (userFound) {
            localStorage.setItem("session", JSON.stringify(userFound));

            emit("sessionStarted",
                {id: userFound.id,
                nombre: userFound.nombre,
                rol: userFound.rol})
            error.value = '';

            router.push("/home") // Redirige a la vista "home"
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

/*

// Declaramos los mensajes de error;
let errName = false;
let errEmailNotValid = false;
let errEmailRep = false;
let errPass = false;
let errConfPass = false;

// Funcion para validar los inputs del registro;

function formSignValidation(){
    let validName = false;
    let validEmail = false;
    let validPass = false;
    let validConfPass = false;

    let regExEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 

    formSign.value.nombre.trim.length > 0 ? validName=true : errName = true; // Validamos que el nombre no esté vacio;
    regExEmail.test(formSign.value.email) && !comprobarEmail(formSign.value.email) ? validEmail=true : errEmailNotValid = true; // Validamos que el email sea válido mediante un regEx y que el email no este ya registrado
    formSign.value.contraseña.length > 8 && formSign.value.contraseña.match(/[0-9]/) ? validConfPass = true : errPass = true;
    confirmPass == formSign.value.contraseña ? validConfPass = true : errConfPass = true;

    if(validName &&  validEmail && validPass && validConfPass){
        signIn();
        console.log("esta bien");
    } else console.log("esta mal");
}
//Funcion para recorrer los usuarios registrados y comprobar de que el usuario introducido en el registro no pertenezca ya a ningun cliente
async function comprobarEmail(email) {
    try {
        const response = await fetch(API + "/usuarios");
        const users = await response.json();
        
        const userExistent = users.find(
            (e) => e.email === email
        );
        
        if (userExistent) {
            errEmailRep = true; // En caso de que ya exista alguien con ese correo, pondrá a true el mensaje de error de que ya existe alguien con ese correo
        } else {
            return false; // En caso de que no, devolverá false para indicar de que no existe nadie con ese usuario
        }
    } catch (err) {
        error.value = 'Error al cargar los datos';
    }
}
*/
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
    .then(data => console.log("Respuesta " + data))
    .catch(error => console.error("Error " + error));

    
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
            <button @click="logIn"> Log In</button>
            <p>Don't have an account yet? <a href="" @click.prevent="alternateLogin()"> Sign in</a></p>
            
        </div>
        <div class="formSignUp" v-else>
            <h1>¡Registrate ahora!</h1>
            <img className="logo" alt="logo" src="../assets/images/osoGinUp.png"/>
            <label for="Name">*Name:</label>
            <input v-model="formSign.nombre" type="text" name="name" placeholder="Name">
            <p v-if="errName" class="text-danger mt-2">¡El nombre de usuario no puede estar vacio!</p>
            <label for="email">*Email: </label>
            <input v-model="formSign.email" name="email" type="email" placeholder="E-mail" />
            <p v-if="errEmailNotValid" class="text-danger mt-2">Email no válido</p>
            <p v-if="errEmailRep" class="text-danger mt-2">Este email ya está registrado.</p>
            <label for="password">*Password:</label>
            <input v-model="formSign.contraseña" name="password" type="password" placeholder="At least 8 characters"/>
            <p v-if="errPass" class="text-danger mt-2">La contraseña debe contener al menos 8 caracteres.</p>
            <input v-model="confirmPass" name="password" type="password" placeholder="Repeat your password"/>
            <p v-if="errConfPass" class="text-danger mt-2">La contraseña no coincide</p>
            <button @click="signIn">Sign Up</button>
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