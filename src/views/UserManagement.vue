<script setup>
    // Declaramos la URL para la API para mostrar todos los usuarios
    const API = "http://localhost/freetours/api.php"
    let users = [];
    // Conseguimos un array con los usuarios mediante un fecth;

    function getData(){
        fetch(API + "/usuarios").then((response) => {
            if(!response.ok){
                console.log("No tengo ni idea, definitivamente");
            } return response.json();
        }).then((data) => console.log(data));
    }
    getData();
</script>
<template>
    <h1>Wuaaa</h1>
    <ul>
        <li v-for="">

        </li>
    </ul>
</template>
<style scoped>

</style>