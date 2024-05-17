import "./style.scss";
import {
  Application,
  Sprite,
  Assets,
  Container,
  TilingSprite,
  Texture,
} from "pixi.js";

const app = new Application();
await app.init({
  width: 500,
  height: 500,
  background: "#1099bb",
});
const wrapper = document.getElementById("game-wrapper");
wrapper.appendChild(app.canvas);

// // aggiungo un'immagine di background
const backgroundTexture = await Assets.load("img/ocean-bg.png");
const background = new Sprite(backgroundTexture);
background.x = app.screen.width / 2;
background.y = app.screen.height / 2;
background.width = app.screen.width * 2;
background.height = app.screen.height * 2;
background.pivot.x = background.width / 2;
background.pivot.y = background.height / 2;
app.stage.addChild(background);

app.ticker.add(() => {
  background.rotation += 1 / 1000;
});

// // aggiungo un'immagine di background
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

app.ticker.add(() => {
  backgroundAlpha.rotation -= 3 / 10000;
});

const container = new Container();

container.x = 30;
container.y = 35;
container.scale.set(250 / 400);

app.stage.addChild(container);

let counter = 0;
let victory = false;

// Carica il pulsante di avvio
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

function animatePulse() {
  btn.scale.x += scaleSpeed * scaleDirection;
  btn.scale.y += scaleSpeed * scaleDirection;

  if (btn.scale.x >= maxScale || btn.scale.x <= minScale) {
    scaleDirection *= -1;
  }

  requestAnimationFrame(animatePulse);
}

animatePulse();


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

btn.on("pointerdown", async () => {

  const message = document.getElementById("explain-tab-default");
  const messageSuccess = document.getElementById("explain-tab-success");
  message.classList.remove("d-none");
  messageSuccess.classList.add("d-none");

  victory = false;
  container.removeChild(btn);


  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  const rngSprite = randomIntFromInterval(5, 10);
  counter = rngSprite;

  for (let i = 0; i < rngSprite; i++) {
    console.log(counter);

    const rngPsy = randomIntFromInterval(1, 3);
    const texture = await Assets.load(`/img/psyduck_attitutdes_0${rngPsy}.png`);
    const psy = new Sprite(texture);
    psy.x = (i % 4) * 180;
    psy.y = Math.floor(i / 3) * 180;
    psy.interactive = true;
    psy.buttonMode = true;


    psy.on("pointerdown", async () => {
      await fadeOut(psy);
      container.removeChild(psy);
      counter--;
      console.log(counter);

      // Controlla se la vittoria è raggiunta
      if (counter === 0) {
        victory = true;
        console.log("Hai vinto");
        message.classList.add("d-none");
        messageSuccess.classList.remove("d-none");
        container.addChild(btn); // Mostra di nuovo il pulsante
      }
    });

    container.addChild(psy);
  }
});
