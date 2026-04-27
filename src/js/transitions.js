// Console transitions + pikachu grid update.

let prevConsole = null;

export function updateConsole(game, scrollProgress, showChen) {
  const img = document.getElementById("console-img");
  const banner = document.getElementById("game-banner");
  const bannerGen = document.getElementById("game-banner-gen");
  const bannerTitle = document.getElementById("game-banner-title");
  const grid = document.getElementById("pikachu-grid");
  const chen = document.getElementById("chen-bubble");

  bannerGen.textContent = game.generation;
  bannerTitle.textContent = game.version_group;

  // Console swap with pixelisation
  if (prevConsole !== game.console) {
    if (prevConsole !== null) {
      const tl = gsap.timeline({
        onComplete: () => img.classList.remove("pixelating"),
      });
      img.classList.add("pixelating");
      tl.to(img, { scale: 0.9, opacity: 0, duration: 0.4 })
        .call(() => { img.src = `assets/consoles/${game.console}.png`; })
        .set(img, { scale: 0.7, opacity: 0 })
        .to(img, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.4)" });
    } else {
      img.src = `assets/consoles/${game.console}.png`;
    }
    prevConsole = game.console;
  }

  // Pikachu grid (1 sprite = 10 pokémon)
  const totalP = Math.floor(game.new_pokemon_count / 10);
  const newP = Math.floor(game.new_pokemon_count / 10);
  const previous = totalP - newP;
  const visibleNew = Math.min(newP, Math.floor(scrollProgress * (newP + 1)));
  const visible = previous + visibleNew;

  // Show / hide chen
  if (showChen) {
    chen.classList.remove("hidden");
    grid.classList.add("hidden");
  } else {
    chen.classList.add("hidden");
    grid.classList.remove("hidden");
    renderPikachus(grid, game.pikachuSpriteUrl, visible);
  }
}

function renderPikachus(grid, src, count) {
  const sameSrc = grid.dataset.src === src;
  const currentCount = Number(grid.dataset.count) || 0;

  // Nothing changed: skip
  if (sameSrc && currentCount === count) return;

  if (sameSrc) {
    // Same sprite: only add or remove the diff, never touch existing ones
    if (count > currentCount) {
      const frag = document.createDocumentFragment();
      for (let i = currentCount; i < count; i++) {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.loading = "lazy";
        img.classList.add("pikachu-new");
        frag.appendChild(img);
      }
      grid.appendChild(frag);
    } else {
      // remove extras from the end
      while (grid.children.length > count) {
        grid.removeChild(grid.lastChild);
      }
    }
  } else {
    // Sprite changed (new generation): full re-render
    grid.innerHTML = "";
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      frag.appendChild(img);
    }
    grid.appendChild(frag);
  }

  grid.dataset.src = src;
  grid.dataset.count = String(count);
}
