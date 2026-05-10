import { gsap } from "./gsap.js";

// Console transitions + pikachu grid update.
const SCREEN_POSITIONS = {
  "Game_boy": { top: "15%", left: "41%", right: "41%", bottom: "55%", spriteSize: 12 },
  "Game_boy_color": { top: "11%", left: "41%", right: "41%", bottom: "60%", spriteSize: 12 },
  "Game_boy_advance": { top: "22%", left: "30%", right: "30%", bottom: "33%", spriteSize: 18 },
  "Nintendo_DS": { top: "8%", left: "36%", right: "36%", bottom: "8%", spriteSize: 14 },
  "Nintendo_3DS": { top: "8%", left: "36%", right: "36%", bottom: "8%", spriteSize: 16 },
  "Switch": { top: "20%", left: "20%", right: "20%", bottom: "20%", spriteSize: 30 },
};

let prevConsole = null;
let prevGameConsole = null; 

export function updateConsole(game, games, gameIndex, scrollProgress, showChen) {
  const img = document.getElementById("console-img");
  const banner = document.getElementById("game-banner");
  const bannerGen = document.getElementById("game-banner-gen");
  const bannerTitle = document.getElementById("game-banner-title");
  const grid = document.getElementById("pikachu-grid");
  const chen = document.getElementById("chen-bubble");
  const overlay = document.getElementById("screen-overlay");
  const pos = SCREEN_POSITIONS[game.console] ?? SCREEN_POSITIONS["Game_boy"];

  bannerGen.textContent = game.generation;
  bannerTitle.textContent = game.version_group;

  const consoleImg = document.getElementById("console-img");
  const imgW = consoleImg.offsetWidth;
  const imgH = consoleImg.offsetHeight;

  const topPx = (parseFloat(pos.top) / 100) * imgH;
  const leftPx = (parseFloat(pos.left) / 100) * imgW;
  const rightPx = (parseFloat(pos.right) / 100) * imgW;
  const bottomPx = (parseFloat(pos.bottom) / 100) * imgH;
  overlay.style.top = topPx + "px";
  overlay.style.left = leftPx + "px";
  overlay.style.width = (imgW - leftPx - rightPx) + "px";
  overlay.style.height = (imgH - topPx - bottomPx) + "px";
  overlay.style.right = "auto";
  overlay.style.bottom = "auto";

  if (prevConsole !== game.console) {
    if (prevConsole !== null) {
      pixelTransition(img, `/src/assets/consoles/${game.console}.png`);
    } else {
      img.src = `/src/assets/consoles/${game.console}.png`;
    }
    prevConsole = game.console;
    repositionPikachus(grid, pos.spriteSize);
  }

  const previousCount = games
  .slice(0, gameIndex + 1)
  .reduce((sum, g) => sum + Math.floor(g.new_pokemon_count / 10), 0);

  const currentGameCount = Math.floor(game.new_pokemon_count / 10);
  const visibleCurrent = Math.floor(scrollProgress * (currentGameCount + 1));

  const totalPikachuCount = previousCount + Math.min(currentGameCount, visibleCurrent);

  if (showChen) {
    chen.classList.remove("hidden");
    grid.classList.add("hidden");
  } else {
    chen.classList.add("hidden");
    grid.classList.remove("hidden");
    renderPikachus(grid, game.pikachuSpriteUrl, totalPikachuCount, pos.spriteSize);
  }
}

 function pixelTransition(img, newSrc) {
  const DURATION = 0.8;

  const run = () => {
    const w = img.offsetWidth, h = img.offsetHeight;
    if (!w || !h) return;

    const currentImg = new Image();
    currentImg.src = img.src;

    img.style.opacity = "0";
    img.style.transition = "none";

    const rect = img.getBoundingClientRect();

    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    Object.assign(canvas.style, {
      position: "fixed",
      top: rect.top + "px",
      left: rect.left + "px",
      width: w + "px", height: h + "px",
      pointerEvents: "none",
      imageRendering: "pixelated",
      zIndex: "9999",
    });
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    const offscreen = document.createElement("canvas");
    offscreen.width = w; offscreen.height = h;
    const off = offscreen.getContext("2d");
    off.imageSmoothingEnabled = false;

    const newImg = new Image();
    newImg.src = newSrc;

    newImg.onload = () => {
      gsap.to({ progress: 0 }, {
        progress: 1,
        duration: DURATION,
        ease: "none",
        onUpdate: function () {
          const p = this.targets()[0].progress;
          const bell = 1 - Math.sin(p * Math.PI);
          const res = Math.max(0.02, bell);
          const sw = Math.max(1, Math.floor(w * res));
          const sh = Math.max(1, Math.floor(h * res));

          const source = p < 0.5 ? currentImg : newImg;

          
          off.clearRect(0, 0, w, h);
          off.drawImage(source, 0, 0, sw, sh);

          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(offscreen, 0, 0, sw, sh, 0, 0, w, h);
        },
        onComplete: () => {
          canvas.remove();
          img.src = newSrc;
          img.style.transition = "";
          img.style.opacity = "1";
        }
      });
    };
  };

  if (img.complete && img.naturalWidth) {
    run();
  } else {
    img.addEventListener("load", run, { once: true });
  }
}

function renderPikachus(grid, src, count, spriteSize = 20) {
  const currentCount = Number(grid.dataset.count) || 0;
  const sameSrc = grid.dataset.src === src;

  if (!sameSrc) {
    Array.from(grid.children).forEach(img => {
      img.src = src;
      img.style.width = spriteSize + "px";
    });
    grid.dataset.src = src;
  }

  if (currentCount === count) return;

  if (count < currentCount) {
    while (grid.children.length > count) {
      grid.removeChild(grid.lastChild);
    }
    const positions = JSON.parse(grid.dataset.positions || "[]");
    grid.dataset.positions = JSON.stringify(positions.slice(0, count));
    grid.dataset.count = String(count);
    return;
  }

  const SPRITE_SIZE = spriteSize;
  const MIN_DIST = spriteSize * 1.5;
  const overlay = grid.closest(".screen-overlay") || grid.parentElement;
  const w = overlay.offsetWidth || 280;
  const h = overlay.offsetHeight || 200;
  const positions = JSON.parse(grid.dataset.positions || "[]");

  const frag = document.createDocumentFragment();

  for (let i = currentCount; i < count; i++) {
    let x, y, attempts = 0, ok = false;

    while (attempts < 200 && !ok) {
      x = Math.random() * (w - SPRITE_SIZE);
      y = Math.random() * (h - SPRITE_SIZE);
      ok = positions.every(p => Math.hypot(p.x - x, p.y - y) >= MIN_DIST);
      attempts++;
    }

    positions.push({ x, y });

    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.loading = "lazy";
    img.style.left = x + "px";
    img.style.top = y + "px";
    img.style.width = spriteSize + "px";
    img.classList.add("pikachu-new");
    frag.appendChild(img);


    animatePikachu(img, w, h, spriteSize);

    const updateAnimation = () => {
    const animations = ["wobbleTop", "wobbleLeft", "wobbleRight"];
    const randomWobble = animations[Math.floor(Math.random() * animations.length)];
    const duration = (0.4 + Math.random() * 0.4).toFixed(2);
    
    img.style.animation = `${randomWobble} ${duration}s ease-in-out infinite`;
    };

    updateAnimation();

    const scheduleNextChange = () => {
      const nextChange = Math.random() * 3000 + 2000; 
      setTimeout(() => {
        updateAnimation();
        scheduleNextChange();
      }, nextChange);
    };

    scheduleNextChange();
    frag.appendChild(img);
  }

  grid.appendChild(frag);
  grid.dataset.count = String(count);
  grid.dataset.positions = JSON.stringify(positions);
}

function repositionPikachus(grid, spriteSize = 20) {
  const imgs = Array.from(grid.children);
  if (imgs.length === 0) return;

  const w = grid.offsetWidth || 280;
  const h = grid.offsetHeight || 200;
  const MIN_DIST = spriteSize * 1.5;
  const positions = [];

  imgs.forEach(img => {
    let x, y, attempts = 0, ok = false;

    gsap.killTweensOf(img);
    animatePikachu(img, w, h, spriteSize);

    while (attempts < 200 && !ok) {
      x = Math.random() * (w - spriteSize);
      y = Math.random() * (h - spriteSize);
      ok = positions.every(p => Math.hypot(p.x - x, p.y - y) >= MIN_DIST);
      attempts++;
    }

    positions.push({ x, y });
    img.style.left = x + "px";
    img.style.top = y + "px";
    img.style.width = spriteSize + "px";
  });

  grid.dataset.positions = JSON.stringify(positions);
}

function animatePikachu(img, w, h, spriteSize) {
  const moveToNew = () => {
    const x = Math.random() * (w - spriteSize);
    const y = Math.random() * (h - spriteSize);
    const duration = 1.5 + Math.random() * 2.5; 

    gsap.to(img, {
      left: x + "px",
      top: y + "px",
      duration,
      ease: "sine.inOut",
      onComplete: moveToNew,
    });
  };

  gsap.delayedCall(Math.random() * 2, moveToNew);
}

export function setConsoleScale(scale) {
  const img = document.getElementById("console-img");
  gsap.to(img, { 
    scale, 
    y: scale > 1 ? 250 : 0,
  });
}
