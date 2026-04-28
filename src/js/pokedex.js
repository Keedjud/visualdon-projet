// Pokédex: drag, open/close, intro fly animation, content update.
import { gsap, ScrollTrigger } from "./gsap.js";
import { drawLifespan } from "./charts.js";

let _games = [];
let _activeIndex = 0;
let _isOpen = false;
let _hasNotif = false;

const drag = { x: 0, y: 0, sx: 0, sy: 0, dragging: false };

export function initPokedex(games) {
  _games = games;

  const icon = document.getElementById("pokedex-icon");
  const close = document.getElementById("pokedex-close");
  const header = document.getElementById("pokedex-header");
  const footer = document.getElementById("pokedex-footer");

  icon.addEventListener("click", openPokedex);
  close.addEventListener("click", closePokedex);

  [header, footer].forEach(handle => {
    handle.addEventListener("pointerdown", onPointerDown);
    handle.addEventListener("pointermove", onPointerMove);
    handle.addEventListener("pointerup", onPointerUp);
    handle.addEventListener("pointercancel", onPointerUp);
  });

  // Intro: pop animation + fly to bottom-left
  setupIntroAnimation();
}

function setupIntroAnimation() {
  const intro = document.getElementById("pokedex-intro");
  const hero = document.getElementById("pokedex-hero");
  if (!intro || !hero) return;

  // Pop in at center
  ScrollTrigger.create({
    trigger: intro,
    start: "top 80%",
    once: true,
    onEnter: () => {
      gsap.fromTo(
        hero,
        { scale: 0, rotate: -180, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.9, ease: "back.out(2)" }
      );
    },
  });

  // Fade out smoothly when leaving the intro section
  ScrollTrigger.create({
    trigger: intro,
    start: "bottom 75%",
    end: "bottom 25%",
    onEnter: () => {
      gsap.to(hero, {
        opacity: 0,
        scale: 0.7,
        y: -20,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => showIconPop(),
      });
    },
    onLeaveBack: () => {
      hideIcon();
      gsap.to(hero, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    },
  });
}

function showIconPop() {
  const icon = document.getElementById("pokedex-icon");
  icon.classList.add("visible");
  gsap.fromTo(
    icon,
    { scale: 0, rotate: -90, opacity: 0 },
    { scale: 1, rotate: 0, opacity: 1, duration: 0.6, ease: "back.out(2.2)", clearProps: "transform" }
  );
}

function hideIcon() {
  const icon = document.getElementById("pokedex-icon");
  gsap.to(icon, {
    scale: 0, opacity: 0, duration: 0.3, ease: "power2.in",
    onComplete: () => {
      icon.classList.remove("visible");
      gsap.set(icon, { clearProps: "transform,opacity" });
    }
  });
}

function setIconVisible(v) {
  document.getElementById("pokedex-icon").classList.toggle("visible", v);
}

export function setActiveGame(i) {
  _activeIndex = i;
  if (_isOpen) renderContent();
}

export function setNotification(on) {
  _hasNotif = on;
  document.getElementById("pokedex-notif").classList.toggle("show", on);
}

function openPokedex() {
  if (_isOpen) return;
  setNotification(false);
  _isOpen = true;
  const panel = document.getElementById("pokedex-panel");
  panel.hidden = false;
  renderContent();

  const w = panel.offsetWidth;
  const h = panel.offsetHeight;
  drag.x = (window.innerWidth - w) / 2;
  drag.y = (window.innerHeight - h) / 2;
  panel.style.transform = `translate(${drag.x}px, ${drag.y}px)`;
  gsap.fromTo(panel,
    { scale: 0.2, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }
  );
}

function closePokedex() {
  const panel = document.getElementById("pokedex-panel");
  gsap.to(panel, {
    scale: 0.2, opacity: 0, duration: 0.3, ease: "power2.in",
    onComplete: () => { panel.hidden = true; _isOpen = false; }
  });
}

function onPointerDown(e) {
  const panel = document.getElementById("pokedex-panel");
  if (!panel) return;
  drag.dragging = true;
  drag.sx = e.clientX - drag.x;
  drag.sy = e.clientY - drag.y;
  e.target.setPointerCapture(e.pointerId);
}
function onPointerMove(e) {
  if (!drag.dragging) return;
  const panel = document.getElementById("pokedex-panel");
  const w = panel.offsetWidth, h = panel.offsetHeight;
  let x = e.clientX - drag.sx, y = e.clientY - drag.sy;
  x = Math.max(8, Math.min(window.innerWidth - w - 8, x));
  y = Math.max(8, Math.min(window.innerHeight - h - 8, y));
  drag.x = x; drag.y = y;
  panel.style.transform = `translate(${x}px, ${y}px)`;
}
function onPointerUp(e) {
  drag.dragging = false;
  try { e.target.releasePointerCapture(e.pointerId); } catch {}
}

function renderContent() {
  const game = _games[_activeIndex] || _games[0];
  if (!game) return;
  document.getElementById("pokedex-gen").textContent = `Gen ${game.generation}`;
  document.getElementById("pokedex-sprite").src = game.pikachuSpriteUrl;
  document.getElementById("pokedex-game-title").textContent = game.version_group;
  document.getElementById("pokedex-console").textContent = game.console;
  document.getElementById("f-region").textContent = game.region;
  document.getElementById("f-date").textContent = new Date(game.release_date).toLocaleDateString("fr-FR");
  document.getElementById("f-new").textContent = `+${game.new_pokemon_count}`;
  document.getElementById("f-battle").textContent = `+${Number(game.battle_forms_count) || 0}`;
  document.getElementById("f-regional").textContent = `+${Number(game.regional_forms_count) || 0}`;
  document.getElementById("f-total").textContent = String(game.total_pokemon ?? game.new_pokemon_count);
  const mech = document.getElementById("mechanic-box");
  if (game.gameplay_mechanics) {
    mech.classList.remove("hidden");
    document.getElementById("f-mechanic").textContent = game.gameplay_mechanics;
  } else {
    mech.classList.add("hidden");
  }
  drawLifespan(_games, _activeIndex);
}
