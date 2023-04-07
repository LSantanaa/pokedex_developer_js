import { pokeApi } from "./pokeApi.js";

export default function renderPokeList() {
  const pokemonList = document.getElementById("pokemonList");
  const loadMoreButton = document.getElementById("loadMoreButton");

  const maxRecords = 1279;
  const limit = 12;
  let offset =0;

  function convertPokemonToLi(pokemon) {
    
    let soma = 0;
    for(let key in pokemon.baseStats){
      soma += pokemon.baseStats[key]
    }

    let gender = '';

    if(pokemon.gender.genderless){
      gender = 'genderless'
    }else{
      gender =  `<img
    src="./assets/img/gender-male.svg"
    alt="icon_male"
    />${pokemon.gender.male}
    <img
    src="./assets/img/gender-female.svg"
    alt="icon_female"
    />${pokemon.gender.female}`
    }


    const li = document.createElement("li");
    li.classList.add("pokemon", pokemon.type);
    li.setAttribute("dataset", pokemon.number);
    li.innerHTML = `
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
        `;
    li.addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.classList.add('modalContainer', `poke${pokemon.number}`, `visible`);
      modal.innerHTML = `
          <div class="modal pokemonDetail">
          <div class="pokeSpecie ${pokemon.type}">
          <button class="closeModal">X</button>
          <div class="pokemon">
            <div class="identification">
              <span class="name">${pokemon.name}</span>
              <span class="number">#${pokemon.number}</span>
            </div>
            <div class="detail">
              <ol class="types">
              ${pokemon.types
                .map((type) => `<li class="type ${type}">${type}</li>`)
                .join("")}
              </ol>
              <div class="pokeContainer">
                <img src="${pokemon.photo2}" alt="${pokemon.name}" />
              </div>
            </div>
          </div>
          <div class="menu">
            <ul>
              <li>
                <a href="#" class="active" data-target="aboutTable">About</a>
              </li>
              <li>
                <a href="#" data-target="baseStatsTable">Base Stats</a>
              </li>
            </ul>
          </div>
          <div id="aboutTable" class="section">
            <table>
              <tr>
                <td>Habitat</td>
                <td>${pokemon.habitat}</td>
              </tr>
              <tr>
                <td>Height</td>
                <td>${pokemon.height}</td>
              </tr>
              <tr>
                <td>Weight</td>
                <td>${pokemon.weight}</td>
              </tr>
              <tr>
                <td>Abilities</td>
                <td>${pokemon.abilities.slice().join(", ")}</td>
              </tr>
              <th>Breeding</th>
              <tr>
                <td>Gender</td>
                <td>
                  ${gender}
                </td>
              </tr>
              <tr>
                <td>Egg Groups</td>
                <td>${pokemon.eggGroups.slice().join(", ")}</td>
              </tr>
              <tr>
                <td>Egg Cycle</td>
                <td>${pokemon.eggCycle} steps</td>
              </tr>
            </table>
          </div>
          <div id="baseStatsTable" class="section">
            <table>
              <tr>
                <td>HP</td>
                <td>${pokemon.baseStats.hp}</td>
                <td>
                  <progress max="255" value="${
                    pokemon.baseStats.hp
                  }"></progress>
                </td>
              </tr>
              <tr>
                <td>Attack</td>
                <td>${pokemon.baseStats.attack}</td>
                <td>
                  <progress max="255" value="${
                    pokemon.baseStats.attack
                  }"></progress>
                </td>
              </tr>
              <tr>
                <td>Defense</td>
                <td>${pokemon.baseStats.defense}</td>
                <td>
                  <progress max="255" value="${
                    pokemon.baseStats.defense
                  }"></progress>
                </td>
              </tr>
              <tr>
                <td>Sp. Atk</td>
                <td>${pokemon.baseStats.specialAttack}</td>
                <td>
                  <progress max="255" value="${
                    pokemon.baseStats.specialAttack
                  }"></progress>
                </td>
              </tr>
              <tr>
                <td>Sp. Def</td>
                <td>${pokemon.baseStats.specialDefense}</td>
                <td>
                  <progress max="255" value="${
                    pokemon.baseStats.specialDefense
                  }"></progress>
                </td>
              </tr>
              <tr>
                <td>Speed</td>
                <td>${pokemon.baseStats.speed}</td>
                <td>
                  <progress max="255" value="${
                    pokemon.baseStats.speed
                  }"></progress>
                </td>
              </tr>
              <tr>
                <td>Total</td>
                <td>${soma}</td>
                <td>
                  <progress max="600" value="${soma}"></progress>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
          `;
          pokemonList.appendChild(modal)
          const closeButton = modal.querySelector(".closeModal");

          closeButton.addEventListener("click", () => {
            modal.remove()
          });

          function toggleActive(e) {
            const opt = document.querySelectorAll(".menu a");
            
            opt.forEach((link) => {
              e.preventDefault()
              link.classList.remove("active");
            });
            e.currentTarget.classList.add("active");
          
            const target = e.currentTarget.dataset.target;
            const sections = document.querySelectorAll(".section");
          
            sections.forEach((section) => {
              if (section.id === target) {
                section.style.display = "block";
              } else {
                section.style.display = "none";
              }
            });
          }
          
          const opt = document.querySelectorAll(".menu a");
          opt.forEach((link) => {
            link.addEventListener("click", toggleActive);
          });
    })
    return li;
  }

  function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit)
    .then((pokemons = []) => {
     
      const newHtml = pokemons.map(convertPokemonToLi);
     
      newHtml.forEach(LiElement =>{
        pokemonList.appendChild(LiElement)
      })
      
    }).catch(error => {
      const sectionContent = document.querySelector('.content')
      const p = document.createElement('p')
      p.innerText = 'Parece que estamos com um problema, verifique sua internet e tente recarregar a página, caso o erro persista, entre em contato pelo Linkedin'
      sectionContent.appendChild(p)
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

}
