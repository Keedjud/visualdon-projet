// Bootstrap: load data, register GSAP plugin, init modules.
import "./gsap.js";
import { loadData } from "./data.js";
import { initPokedex } from "./pokedex.js";
import { initScroll } from "./scroll.js";

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const games = await loadData();
    initPokedex(games);
    initScroll(games);
  } catch (err) {
    console.error("Init failed:", err);
  }
});
