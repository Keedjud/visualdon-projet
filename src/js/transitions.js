import { gsap } from "./gsap.js";

// Console transitions + pikachu grid update.
const SCREEN_POSITIONS = {
  "Game_boy":          { top: "32%", left: "42%", right: "42%", bottom: "68%", spriteSize: 12 },
  "Game_boy_color":    { top: "0%", left: "42%", right: "42%", bottom: "50%", spriteSize: 12 },
  "Game_boy_advance":  { top: "0%", left: "35%", right: "35%", bottom: "10%", spriteSize: 18 },
  "Nintendo_DS":       { top: "0%", left: "37%", right: "37%", bottom: "50%", spriteSize: 14 },
  "Nintendo_3DS":      { top: "0%", left: "33%", right: "33%", bottom: "50%", spriteSize: 16 },
  "Switch":            { top: "0%", left: "15%", right: "15%", bottom: "0%", spriteSize: 30 },
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

  bannerGen.textContent = game.generation;
  bannerTitle.textContent = game.version_group;

  const pos = SCREEN_POSITIONS[game.console] ?? SCREEN_POSITIONS["Game_boy"];
  overlay.style.top = pos.top;
  overlay.style.left = pos.left;
  overlay.style.right = pos.right;
  overlay.style.bottom = pos.bottom;

  // Console swap with pixelisation
  if (prevConsole !== game.console) {
    if (prevConsole !== null) {
      pixelTransition(img, `/src/assets/consoles/${game.console}.png`);
    } else {
      img.src = `/src/assets/consoles/${game.console}.png`;
    }
    prevConsole = game.console;
  }

  const totalPikachuCount = games
  .slice(0, gameIndex + 1)
  .reduce((sum, g) => sum + Math.floor(g.new_pokemon_count / 20), 0);

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

    // Canvas intermédiaire pour le resize propre
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

          // Dessine en petite taille sur offscreen
          // Dessine en petite taille sur offscreen
          off.clearRect(0, 0, w, h);
          off.drawImage(source, 0, 0, sw, sh);

          // Étire toujours à pleine taille (w × h) — pas de rétrécissement
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

  // Si le sprite change, met à jour tous les imgs existants
  if (!sameSrc) {
    Array.from(grid.children).forEach(img => img.src = src);
    grid.dataset.src = src;
  }

  if (currentCount === count) return;

  const SPRITE_SIZE = spriteSize;
  const MIN_DIST = spriteSize * 1.5;
  const w = grid.offsetWidth || 280;
  const h = grid.offsetHeight || 200;
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
