const searchInput = document.querySelector("#search-input");
const ideaInput = document.querySelector("#idea-input");
const ideaForm = document.querySelector("#idea-form");
const ideasList = document.querySelector("#ideas-list");
const ideasCount = document.querySelector("#ideas-count");
const resultLabel = document.querySelector("#result-label");
const emptyState = document.querySelector("#empty-state");
const favoritesFilter = document.querySelector("#favorites-filter");
const sideFavorites = document.querySelector("#side-favorites");
let favoritesOnly = false;

function updateView() {
  const query = searchInput.value.trim().toLocaleLowerCase("ru-RU");
  const cards = [...ideasList.querySelectorAll(".idea-card")];
  let visibleCount = 0;
  cards.forEach((card) => {
    const title = (card.dataset.title || "").toLocaleLowerCase("ru-RU");
    const matchesQuery = title.includes(query);
    const isFavorite = card.querySelector(".favorite-button").getAttribute("aria-pressed") === "true";
    const visible = matchesQuery && (!favoritesOnly || isFavorite);
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  const favoriteCount = ideasList.querySelectorAll('.favorite-button[aria-pressed="true"]').length;
  ideasCount.textContent = String(cards.length);
  sideFavorites.textContent = String(favoriteCount);
  resultLabel.textContent = `${visibleCount} ${visibleCount === 1 ? "карточка" : "карточек"}`;
  emptyState.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", updateView);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    searchInput.value = "";
    updateView();
  }
});

ideaForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = ideaInput.value.trim();
  if (!title) {
    ideaInput.focus();
    return;
  }

  const card = document.createElement("article");
  card.className = "idea-card lavender";
  card.dataset.title = title;

  const top = document.createElement("div");
  top.className = "card-top";
  const category = document.createElement("span");
  category.className = "category";
  category.textContent = "НОВАЯ ИДЕЯ";
  const favorite = document.createElement("button");
  favorite.className = "favorite-button";
  favorite.type = "button";
  favorite.textContent = "☆";
  favorite.setAttribute("aria-label", "Добавить в избранное");
  favorite.setAttribute("aria-pressed", "false");
  top.append(category, favorite);

  const heading = document.createElement("h3");
  heading.textContent = title;
  const description = document.createElement("p");
  description.textContent = "Новая идея добавлена на вашу доску. Дополните её деталями, когда будете готовы.";
  const footer = document.createElement("div");
  footer.className = "card-footer";
  const icon = document.createElement("span");
  icon.className = "card-icon";
  icon.textContent = "✧";
  const note = document.createElement("span");
  note.textContent = "Только что добавлено";
  footer.append(icon, note);
  card.append(top, heading, description, footer);
  ideasList.append(card);
  ideaInput.value = "";
  updateView();
});

ideasList.addEventListener("click", (event) => {
  const button = event.target.closest(".favorite-button");
  if (!button) return;
  const wasFavorite = button.getAttribute("aria-pressed") === "true";
  button.setAttribute("aria-pressed", String(!wasFavorite));
  button.textContent = wasFavorite ? "☆" : "★";
  button.setAttribute("aria-label", wasFavorite ? "Добавить в избранное" : "Убрать из избранного");
  updateView();
});

favoritesFilter.addEventListener("click", () => {
  favoritesOnly = !favoritesOnly;
  favoritesFilter.setAttribute("aria-pressed", String(favoritesOnly));
  favoritesFilter.textContent = favoritesOnly ? "★ Показать все идеи" : "☆ Только избранное";
  updateView();
});

updateView();