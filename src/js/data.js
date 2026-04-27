// Loads data.json once and exposes the games list.
let _games = null;

export async function loadData() {
  if (_games) return _games;
  const res = await fetch("src/data/data.json");
  if (!res.ok) throw new Error("Failed to load data.json");
  const json = await res.json();
  _games = json.games;
  return _games;
}

export function getGames() {
  return _games || [];
}
