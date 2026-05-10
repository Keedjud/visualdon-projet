import { gsap, ScrollTrigger } from "./gsap.js";
import { drawSales, drawScores, highlightChart } from "./charts.js";
import { updateConsole, setConsoleScale } from "./transitions.js";
import { setActiveGame, setNotification } from "./pokedex.js";

const TUTORIALS = [
  { id: "sales", text: "Regarde en HAUT de l'écran : ce graphique montre les ventes cumulées de chaque jeu, en millions d'unités. Plus la courbe monte, plus la licence cartonne." },
  { id: "scores", text: "À DROITE, tu verras un duel : à gauche le Metascore (la critique professionnelle), à droite le Userscore (les critiques des joueurs). Si les deux barres divergent, ça promets d'être intéressant." },
  { id: "name", text: "EN BAS, tu trouveras le nom de chaque jeu et sa génération." },
  { id: "console", text: "AU CENTRE, il s'agit de la console sur laquelle le jeu est sorti. De plus, elle montrera des pikachus qui représentera le nombre de pokémons total sortis." },
  { id: "pokedex", text: "N'OUBLIE PAS que tu peux ouvrir le Pokédex qui se trouve en bas à droite de l'écran, qui te donnera plus d'infos croustillantes sur chaque jeu !" },
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

  drawSales(_games, 0);
  drawScores(_games, 0, handleScoreClick);
  updateConsole(_games[0], _games, 0, 0, true);
  _showChen = true;
}

function handleScoreClick(game) {
  const i = Number.isInteger(game?.index) ? game.index : _games.indexOf(game);
  if (i === -1) return;
  const section = document.getElementById(`game-section-${i}`);
  if (section) section.scrollIntoView({ behavior: "smooth", block: "center" });
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
        <p class="gen-label">${escapeHtml(`Génération ${game.generation}`)}</p>
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
  let _activeTutoCount = 0; // ← en dehors du forEach

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
      bubble.textContent = "";
      overlay.classList.add("show");
      highlightChart(id);

      _activeTutoCount++;
      if (_activeTutoCount === 1) setConsoleScale(3);

      const text = tuto.text;
      let i = 0;
      const interval = setInterval(() => {
        bubble.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 30);
      sec._typingInterval = interval;
    }

    function deactivate() {
      clearInterval(sec._typingInterval);
      overlay.classList.remove("show");
      highlightChart(null);

      _activeTutoCount = Math.max(0, _activeTutoCount - 1);
      if (_activeTutoCount === 0) setConsoleScale(1);
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
        updateConsole(game, _games, _activeIndex, _sectionProgress, _showChen && _activeIndex === 0 && _sectionProgress < 0.25);
      },
    });
  });
}

function setActive(i, direction = "forward") {
  if (_activeIndex === i) return;
  _activeIndex = i;
  setActiveGame(i);
  drawSales(_games, i, direction);
  drawScores(_games, i, handleScoreClick);
  updateConsole(_games[i], _games, i, _sectionProgress, false);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}


