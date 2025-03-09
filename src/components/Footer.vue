<template>
  <footer class="footer">
    <div class="contacto">
      <ul>
        <li>valentinvillapozo2005@gmail.com</li>
        <li>Teléfono</li>
        <li>Pº de la Estacion, 44, Jaén</li>
      </ul>
    </div>

    <div class="licencia">
      <p>
        <span property="dct:title">Web Freetours 2ºDaw</span> by
        <a rel="cc:attributionURL dct:creator" property="cc:attributionName"
          href="https://github.com/valentinVilla05">Valentin Villa</a> is licensed under
        <a href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1" target="_blank"
          rel="license noopener noreferrer">CC BY-SA 4.0</a>
      </p>
    </div>

    <div class="social">
      <p class="iconos me-3 d-flex">
        <a href="#"><img src="/images/instagram.png" alt="Instagram"></a>
        <a href="#"><img src="/images/twitter.png" alt="X"></a>
        <a href="#"><img src="/images/tiktok.png" alt="TikTok"></a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #51ab5b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem; /* Menos altura */
  text-align: center;
  width: 100%;
}

.contacto {
  flex: 1;
  text-align: left;
}

.licencia {
  flex: 1;
  text-align: center;
}

.social {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Iconos más pegados a la derecha */
}

.iconos a {
  margin: 0.2em 0;
  display: block;
}

.iconos img {
  height: auto;
}
</style>
