const searchInput = document.getElementById("searchInput");
const clearButton = document.getElementById("clearButton");
const results = document.getElementById("results");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");

let pokemonList = [];

/*
 * ひらがな・カタカナを同じものとして扱うための正規化
 */
function normalizeText(text) {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u3041-\u3096]/g, (char) => {
      return String.fromCharCode(char.charCodeAt(0) + 0x60);
    })
    .trim();
}

/*
 * JSON読み込み
 */
async function loadPokemon() {
  try {
    const response = await fetch("pokemon.json");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    pokemonList = await response.json();

    renderResults(pokemonList);
  } catch (error) {
    console.error("JSONの読み込みに失敗しました:", error);

    results.innerHTML = `
      <div class="no-results">
        <p>データの読み込みに失敗しました。</p>
      </div>
    `;

    resultCount.textContent = "読み込みエラー";
  }
}

/*
 * 検索
 */
function searchPokemon(keyword) {
  const normalizedKeyword = normalizeText(keyword);

  if (!normalizedKeyword) {
    return pokemonList;
  }

  return pokemonList.filter((pokemon) => {
    const normalizedName = normalizeText(pokemon.name);

    return normalizedName.includes(normalizedKeyword);
  });
}

/*
 * 結果表示
 */
function renderResults(list) {
  results.innerHTML = "";

  resultCount.textContent = `${list.length}件`;

  if (list.length === 0) {
    noResults.classList.remove("hidden");
    return;
  }

  noResults.classList.add("hidden");

  const fragment = document.createDocumentFragment();

  list.forEach((pokemon) => {
    const card = document.createElement("article");
    card.className = "card";

    const number = document.createElement("div");
    number.className = "card-number";
    number.textContent = pokemon.filename.replace(".png", "");

    const name = document.createElement("h2");
    name.className = "card-name";
    name.textContent = pokemon.name;

    const link = document.createElement("a");
    link.className = "card-button";
    link.href = pokemon.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "公式画像を見る";

    card.appendChild(number);
    card.appendChild(name);
    card.appendChild(link);

    fragment.appendChild(card);
  });

  results.appendChild(fragment);
}

/*
 * 検索欄入力
 */
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value;
  const filtered = searchPokemon(keyword);

  renderResults(filtered);
});

/*
 * クリア
 */
clearButton.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();

  renderResults(pokemonList);
});

/*
 * 起動
 */
loadPokemon();
