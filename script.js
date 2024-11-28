const eyeTemplate = document.querySelector("#eye-template");
const eyeballContainer = document.querySelector(".eyeball-container");
const maxEyeballs = 10;
let eyeballs;

function instantiateEyeball() {
  const clone = eyeTemplate.content.cloneNode(true);
  eyeballContainer.appendChild(clone);
}

function randomizeEyeValues(eye) {
  const randomDirections = [-1, 1];
  // Set initial size
  const size = `${35 + Math.floor(Math.random() * 75)}px`;
  eye.style.width = size;
  eye.style.height = size;

  // Set initial position
  eye.style.top = `${Math.floor(Math.random() * 85)}%`;
  eye.style.left = `${Math.floor(Math.random() * 85)}%`;

  // Set initial speed
  if (!eye.speedX)
    eye.speedX =
      randomDirections[Math.round(Math.random())] * Math.random() * 2;
  if (!eye.speedY)
    eye.speedY =
      randomDirections[Math.round(Math.random())] * Math.random() * 2;
}

function initializeEyeballs(eyeCount) {
  for (let i = 0; i < eyeCount; i += 1) {
    instantiateEyeball();
  }
  eyeballs = document.querySelectorAll(".eye");

  eyeballs.forEach((eye) => {
    randomizeEyeValues(eye);
  });

  eyeballs.forEach((eye) => {
    eye.addEventListener("pointerdown", (e) => {
      let target;
      if (e.target.classList.contains("eye")) {
        target = e.target;
      } else {
        target = e.target.offsetParent;
      }
      poke(target);
    });
  });
}

function poke(target) {
  target.classList.add("poked");
  target.speedX = 0;
  target.speedY = 0;
  setTimeout(() => target.remove(), 1000);
}

function randomBlink() {
  eyeballs.forEach((eye) => {
    eye.classList.remove("blink");

    if (Math.random() > 0.99) {
      setTimeout(() => {
        eye.classList.add("blink");
      }, 50 + Math.floor(Math.random() * 50));
    }
  });
}

function moveEyeballs() {
  eyeballs.forEach((eye) => {
    const rect = eye.getBoundingClientRect();

    if (rect.x < 0) {
      eye.style.left = "0px";
      eye.speedX = -eye.speedX;
    }

    if (rect.x > window.innerWidth - eye.offsetWidth) {
      eye.style.left = window.innerWidth - eye.offsetWidth + "px";
      eye.speedX = -eye.speedX;
    }

    if (rect.y < 0) {
      eye.style.top = "0px";
      eye.speedY = -eye.speedY;
    }

    if (rect.y > window.innerHeight - eye.offsetHeight) {
      eye.style.top = window.innerHeight - eye.offsetHeight + "px";
      eye.speedY = -eye.speedY;
    }
    eye.style.left = `${rect.x + eye.speedX}px`;
    eye.style.top = `${rect.y + eye.speedY}px`;
  });
  requestAnimationFrame(moveEyeballs);
}

// Clear and regenerate all eyeballs
function refreshEyeballs(eyeCount) {
  eyeballs.forEach((eye) => {
    eye.remove();
  });
  eyeballs = null;
  initializeEyeballs(eyeCount);
}

// Prevent multiple eyeball refreshes during window resizing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
function handleResize() {
  refreshEyeballs(maxEyeballs);
}
window.addEventListener("resize", debounce(handleResize, 250));

initializeEyeballs(maxEyeballs);
moveEyeballs();
setInterval(randomBlink, 250);
