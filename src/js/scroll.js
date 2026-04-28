// ScrollTrigger orchestration: builds game sections + tutorial triggers.
import { drawSales, drawScores, highlightChart } from "./charts.js";
import { updateConsole } from "./transitions.js";
import { setActiveGame, setNotification } from "./pokedex.js";

const TUTORIALS = [
  { id: "sales", text: "Regarde en HAUT de l'écran : ce graphique montre les ventes cumulées de chaque jeu, en millions d'unités. Plus la courbe monte, plus la licence cartonne." },
  { id: "scores", text: "À DROITE, tu verras un duel : à gauche le Metascore (la critique professionnelle), à droite le Userscore (les joueurs). Quand les deux barres divergent... ça raconte une histoire." },
  { id: "console", text: "AU CENTRE, il s'agit de la console sur laquelle le jeu est sorti. De plus, elle montrera des pikachus qui représentera le nombre de pokémons total sortis." },
  { id: "pokedex", text: "N'oublie pas que tu peux ouvrir la Pokédex, qui te donnera plus d'infos croustillantes sur chaque jeu !" },
];

let _games = [];
let _activeIndex = 0;
let _sectionProgress = 0;
let _showChen = false;

export function initScroll(games) {
  _games = games;
  buildGameSections();
  setupTutorialTriggers();
  setupGameTriggers();

  // Initial paint
  drawSales(_games, 0);
  drawScores(_games, 0);
  updateConsole(_games[0], 0, true);
  _showChen = true;
}

function buildGameSections() {
  const container = document.getElementById("game-sections");
  container.innerHTML = "";
  _games.forEach((game, i) => {
    const sec = document.createElement("section");
    sec.className = "game-section";
    sec.id = `game-section-${i}`;
    game.anecdotes.forEach(a => {
      const card = document.createElement("div");
      card.className = `anecdote anecdote--${a.side}`;
      card.innerHTML = `
        <p class="gen-label">${escapeHtml(game.genName)}</p>
        <h3>${escapeHtml(a.title)}</h3>
        <p>${escapeHtml(a.text)}</p>
      `;
      sec.appendChild(card);
    });
    container.appendChild(sec);
  });
}

function setupTutorialTriggers() {
  const overlay = document.getElementById("prof-overlay");
  const bubble = document.getElementById("prof-bubble");
  const sections = document.querySelectorAll(".tuto-section");

  sections.forEach(sec => {
    const id = sec.dataset.tuto;
    const tuto = TUTORIALS.find(t => t.id === id);
    ScrollTrigger.create({
      trigger: sec,
      start: "top center",
      end: "bottom center",
      onEnter: () => activate(),
      onEnterBack: () => activate(),
      onLeave: () => deactivate(),
      onLeaveBack: () => deactivate(),
    });

    function activate() {
      bubble.textContent = tuto.text;
      overlay.classList.add("show");
      highlightChart(id);
    }
    function deactivate() {
      overlay.classList.remove("show");
      highlightChart(null);
    }
  });
}

function setupGameTriggers() {
  _games.forEach((_, i) => {
    ScrollTrigger.create({
      trigger: `#game-section-${i}`,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
      setActive(i, "forward");
      setNotification(true);
      if (i > 0) _showChen = false;
      },
      onEnterBack: () => {
      setActive(i, "backward");
      if (i === 0) _showChen = true;
      },
    });
    ScrollTrigger.create({
      trigger: `#game-section-${i}`,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        _sectionProgress = self.progress;
        const game = _games[_activeIndex];
        updateConsole(game, _sectionProgress, _showChen && _activeIndex === 0 && _sectionProgress < 0.25);
      },
    });
  });
}

function setActive(i, direction = "forward") {
  if (_activeIndex === i) return;
  _activeIndex = i;
  setActiveGame(i);
  drawSales(_games, i, direction);
  drawScores(_games, i);
  updateConsole(_games[i], _sectionProgress, false);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
