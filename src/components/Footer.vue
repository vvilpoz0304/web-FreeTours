<template>
  <footer class="footer">
    <div>
      <p>Información de Contacto:</p>
      <ul>
        <li>Correo</li>
        <li>Telefono</li>
        <li>Ubicacion</li>
      </ul>
    </div>
    <div>
      <p id="iconos">
        <a href=""><img src="../assets/images/instagram.png" alt="Instagram"></a>
        <a href=""><img src="../assets/images/twitter.png" alt="X"></a>
        <a href=""><img src="../assets/images/tiktok.png" alt="TikTok"></a>
      </p>
      <p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><span property="dct:title">Web
          Freetours 2ºDaw</span> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName"
          href="https://github.com/valentinVilla05">Valentin Villa</a> is licensed under <a
          href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1" target="_blank"
          rel="license noopener noreferrer" style="display:inline-block;">CC BY-SA 4.0</a></p>
    </div>
    <div>
      <p> <a href="#">Terminos y Condiciones </a></p>
      <p> <a href="#">Preguntas Frecuentes </a></p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: rgb(125, 179, 125);
  color: white;
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
}

.footer div {
  margin: 1em 2em 0em 2em;
}
#iconos a{
  margin: 0em 1em 0em 1em;
}
</style>