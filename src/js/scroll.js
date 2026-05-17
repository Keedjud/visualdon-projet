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
let _maxIndex = 0;
let _sectionProgress = 0;
let _showChen = false;

export function initScroll(games) {
  _games = games;
  _maxIndex = 0;
  buildGameSections();
  setupTutorialTriggers();
  setupGameTriggers();
  setupOutroMusic();

  drawSales(_games, 0, _maxIndex, "forward", handleScoreClick);
  drawScores(_games, 0, _maxIndex, handleScoreClick);
}

function setupOutroMusic() {
  const audio = document.getElementById("outro-music");
  
  ScrollTrigger.create({
    trigger: ".section--outro",
    start: "top center",
    onEnter: () => {
      audio.volume = 0;
      audio.play();
      gsap.to(audio, { volume: 1, duration: 2, ease: "power2.out" });
    },
    onLeaveBack: () => {
      gsap.to(audio, { 
        volume: 0, 
        duration: 1, 
        ease: "power2.in",
        onComplete: () => audio.pause()
      });
    },
  });
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
  let _currentTypingInterval = null;

 sections.forEach(sec => {
    const id = sec.dataset.tuto;
    const tuto = TUTORIALS.find(t => t.id === id);

    // Trigger 1 : agrandit la console
    ScrollTrigger.create({
      trigger: sec,
      start: "top center",
      end: "bottom center",
      onEnter: () => setConsoleScale(3),
      onEnterBack: () => setConsoleScale(3),
      onLeave: () => setConsoleScale(1),
      onLeaveBack: () => setConsoleScale(1),
    });

    // Trigger 2 : professor apparaît
    ScrollTrigger.create({
      trigger: sec,
      start: "center center",
      onEnter: () => {
        // Arrête tout interval en cours
        clearInterval(_currentTypingInterval);
        
        overlay.classList.add("show");
        bubble.textContent = "";
        highlightChart(id);
        
        const words = tuto.text.split(" ");
        let i = 0;
        _currentTypingInterval = setInterval(() => {
          bubble.textContent = words.slice(0, i + 1).join(" ");
          i++;
          if (i >= words.length) clearInterval(_currentTypingInterval);
        }, 120);
      },
      onEnterBack: () => {
        clearInterval(_currentTypingInterval); // ← arrête aussi au désscroll
        overlay.classList.add("show");
        bubble.textContent = tuto.text;
        highlightChart(id);
      },
      onLeaveBack: () => {
        clearInterval(_currentTypingInterval);
        overlay.classList.remove("show");
        bubble.textContent = "";
        highlightChart(null);
      },
    });
});

  ScrollTrigger.create({
    trigger: "#tutorials",
    start: "bottom center",
    onEnter: () => {
      overlay.classList.remove("show");
      bubble.textContent = "";
      highlightChart(null);
      setConsoleScale(1);
    },
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
      start: "top center", 
      end: "bottom center", 
      scrub: true,
      onUpdate: (self) => {
        _sectionProgress = self.progress;
        const game = _games[_activeIndex];
        updateConsole(game, _games, _activeIndex, _sectionProgress, false);
      },
    });
  });
}

function setActive(i, direction = "forward") {
  if (_activeIndex === i) return;
  const isNew = i > _maxIndex;
  if (isNew) _maxIndex = i;
  _activeIndex = i;
  setActiveGame(i, _maxIndex);
  drawSales(_games, i, _maxIndex, isNew ? "forward" : "static", handleScoreClick);
  drawScores(_games, i, _maxIndex, handleScoreClick);
  updateConsole(_games[i], _games, i, 0, false);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}


