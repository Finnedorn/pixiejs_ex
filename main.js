import "./style.scss";
import {
  Application,
  Sprite,
  Assets,
  Container,
  TilingSprite,
  Texture,
} from "pixi.js";

// apro il canvas di gioco
const app = new Application();
await app.init({
  width: 500,
  height: 500,
  background: "#1099bb",
});
const wrapper = document.getElementById("game-wrapper");
wrapper.appendChild(app.canvas);

// aggiungo un'immagine di background
const backgroundTexture = await Assets.load("img/ocean-bg.png");
const background = new Sprite(backgroundTexture);
background.x = app.screen.width / 2;
background.y = app.screen.height / 2;
background.width = app.screen.width * 2;
background.height = app.screen.height * 2;
background.pivot.x = background.width / 2;
background.pivot.y = background.height / 2;
app.stage.addChild(background);

// setto l'animazione di rotazione
app.ticker.add(() => {
  background.rotation += 1 / 1000;
});

// aggiungo una seconda immagine di background con opacità
const backgroundTextureSec = await Assets.load("img/ocean-bg.png");
const backgroundAlpha = new Sprite(backgroundTextureSec);
backgroundAlpha.x = app.screen.width / 3;
backgroundAlpha.y = app.screen.height / 3;
backgroundAlpha.width = app.screen.width * 2;
backgroundAlpha.height = app.screen.height * 2;
backgroundAlpha.pivot.x = backgroundAlpha.width / 2;
backgroundAlpha.pivot.y = backgroundAlpha.height / 2;
backgroundAlpha.alpha = 0.1;
app.stage.addChild(backgroundAlpha);

// setto l'animazione di rotazione nel verso opposto
app.ticker.add(() => {
  backgroundAlpha.rotation -= 3 / 10000;
});

// creo il container entro il quale inserirò le icone degli psyduck
const container = new Container();
container.x = 30;
container.y = 35;
container.scale.set(250 / 400);
app.stage.addChild(container);


// creo il pulsante di play
const btnPng = await Assets.load("/img/start-button.png");
const btn = new Sprite(btnPng);
btn.x = 350;
btn.y = 300;
btn.anchor.set(0.5);
container.addChild(btn);
btn.interactive = true;
btn.buttonMode = true;
let scaleDirection = 1;
let scaleSpeed = 0.001;
let maxScale = 1.01;
let minScale = 0.95;

// creo la funzione di animazione del pulsante di play (pulse)
function animatePulse() {
  btn.scale.x += scaleSpeed * scaleDirection;
  btn.scale.y += scaleSpeed * scaleDirection;

  if (btn.scale.x >= maxScale || btn.scale.x <= minScale) {
    scaleDirection *= -1;
  }

  requestAnimationFrame(animatePulse);
}
animatePulse();

// aggiungo il counter, quando raggiungerà il valore 0 il gioco finirà
let counter = 0;
// aggiungo una variabile, quando passerà a true il gioco finirà
let victory = false;

// funzione che rimuove il pulsante di play e fa partire il gioco
btn.on("pointerdown", async () => {
  // richiamo le tab di descrizione dall'HTML 
  const message = document.getElementById("explain-tab-default");
  const messageSuccess = document.getElementById("explain-tab-success");
  // resetto la tab di descrizione
  message.classList.remove("d-none");
  // resetto la tab di successo
  messageSuccess.classList.add("d-none");
  // resetto il valore della variabile di vittoria
  victory = false;
  // rimuovo il pulsante
  container.removeChild(btn);

  // creo una rng per estrarre la quanti e quali Psyduck verranno creati
  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  const rngSprite = randomIntFromInterval(5, 10);
  // associo alla variabile counter il valore del rng
  counter = rngSprite;

  // ciclo tante volte quante il counter
  for (let i = 0; i < rngSprite; i++) {

    // estraggo un'icona di psyduck casuale dalla cartella e creo uno sprite di quell'icona
    const rngPsy = randomIntFromInterval(1, 3);
    const texture = await Assets.load(`/img/psyduck_attitutdes_0${rngPsy}.png`);
    const psy = new Sprite(texture);
    psy.x = (i % 4) * 180;
    psy.y = Math.floor(i / 3) * 180;
    psy.interactive = true;
    psy.buttonMode = true;

    // aggiungo un evento al click dell'icona
    psy.on("pointerdown", async () => {
      // effettuo l'animazione di fadeout
      await fadeOut(psy);
      // rimuovo l'icona
      container.removeChild(psy);
      // decremento il valore del counter
      counter--;
      // monitoro il counter in console
      console.log(counter);

      // quando il counter arriverà a 0, il gioco finirà
      if (counter === 0) {
        // la variabile di vittoria passa a true
        victory = true;
        // nascondo la tab di descrizione e rivelo la tab col messaggio di vittoria
        message.classList.add("d-none");
        messageSuccess.classList.remove("d-none");
        // mostro di nuovo il pulsante di play
        container.addChild(btn); 
      }
    });

    container.addChild(psy);
  }
});

// setto la funzione per l'animazione di fadeout delle icone di Psyduck
function fadeOut(sprite, speed = 0.05) {
  return new Promise((resolve) => {
      function animate() {
          sprite.alpha -= speed;
          if (sprite.alpha <= 0) {
              sprite.alpha = 0;
              container.removeChild(sprite);
              resolve();
          } else {
              requestAnimationFrame(animate);
          }
      }
      animate();
  });
}