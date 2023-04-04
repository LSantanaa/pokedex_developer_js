import { pokeApi } from "./pokeApi.js";
import { convertPokeApiDetailToPokemon } from "./pokeApi.js";

export default function renderPokeList() {
  const pokemonList = document.getElementById("pokemonList");
  const loadMoreButton = document.getElementById("loadMoreButton");

  const maxRecords = 1000;
  const limit = 1;
  let offset = 0;

  function convertPokemonToLi(pokemon) {
    return `
      <li class="pokemon ${pokemon.type}" dataset="${pokemon.number}">
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>

        <div class="detail">
          <ol class="types">
            ${pokemon.types
              .map((type) => `<li class="type ${type}">${type}</li>`)
              .join("")}
          </ol>

          <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
      </li>
    `;
  }

  function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
      const newHtml = pokemons.map(convertPokemonToLi).join("");
      pokemonList.innerHTML += newHtml;
    
      const newElements = Array.from(pokemonList.children).slice(
        -pokemons.length
      );
      addClickListenersToElements(newElements);
    });
  }

  function addClickListenersToElements(elements) {
    elements.forEach((pokemon) => {
      pokemon.addEventListener("click", () => {
        const modal = document.querySelector(".modalContainer");
        modal.classList.add("visible");
      });
    });
  }

  loadPokemonItems(offset, limit);

  loadMoreButton.addEventListener("click", () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
      const newLimit = maxRecords - offset;
      loadPokemonItems(offset, newLimit);

      loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
      loadPokemonItems(offset, limit);
    }
  });

  const observer = new MutationObserver((mutations) => {
    const newElements = mutations
      .map((mutation) => Array.from(mutation.addedNodes))
      .flat()
      .filter((node) => node.classList?.contains("pokemon"));
    addClickListenersToElements(newElements);
  });
  observer.observe(pokemonList, { childList: true });
}
