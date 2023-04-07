import { Pokemon } from "./pokemonModel.js";

export const pokeApi = {};

export async function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  if (pokeDetail.height) {
    let typeHeight = "cm";
    let height = pokeDetail.height / 10;
    height >= 1 ? (typeHeight = "m") : typeHeight;
    pokemon.height = `${height.toFixed(2)} ${typeHeight}`;
  }

  if (pokeDetail.weight) {
    pokemon.weight = `${pokeDetail.weight / 10}kg`;
  }

  if (pokeDetail.abilities) {
    pokemon.abilities = pokeDetail.abilities.map(
      (abilitySlot) => abilitySlot.ability.name
    );
  }

  try {
    const response = await fetch(pokeDetail.species.url);
    const resp = await response.json();

    if (resp.habitat) {
      pokemon.habitat = resp.habitat.name;
    }

    if (resp.gender_rate !== -1) {
      let female = (resp.gender_rate / 8) * 100;
      pokemon.gender.male = `${100 - female}%`;
      pokemon.gender.female = `${female}%`;
    }else{
      pokemon.gender.genderless = true
    }

    if (resp.egg_groups) {
      pokemon.eggGroups = resp.egg_groups.map((eggGroup) => eggGroup.name);
    }

    if (resp.hatch_counter !== undefined) {
      pokemon.eggCycle = 255 * (resp.hatch_counter + 1);
    }
  } catch (err) {
    console.error(err);
  }

  if (pokeDetail.stats) {
    for (const statSlot of pokeDetail.stats) {
      switch (statSlot.stat.name) {
        case "hp":
          pokemon.baseStats.hp = statSlot.base_stat;
          break;
        case "attack":
          pokemon.baseStats.attack = statSlot.base_stat;
          break;
        case "defense":
          pokemon.baseStats.defense = statSlot.base_stat;
          break;
        case "special-attack":
          pokemon.baseStats.specialAttack = statSlot.base_stat;
          break;
        case "special-defense":
          pokemon.baseStats.specialDefense = statSlot.base_stat;
          break;
        case "speed":
          pokemon.baseStats.speed = statSlot.base_stat;
          break;
      }
    }
  }

  pokeDetail["sprites"]["versions"]["generation-v"]["black-white"]["animated"]
    .front_default
    ? (pokemon.photo =
      pokeDetail["sprites"]["versions"]["generation-v"]["black-white"][
        "animated"
      ].front_default)
    : (pokemon.photo = pokeDetail.sprites.front_default);

  pokeDetail.sprites.other.dream_world.front_default
    ? (pokemon.photo2 = pokeDetail.sprites.other.dream_world.front_default)
    : (pokemon.photo2 = pokeDetail.sprites.front_default);

  return pokemon;
}

pokeApi.getPokemonDetail = async (pokemon) => {
  const response = await fetch(pokemon.url);
  const pokeDetail = await response.json();
  return convertPokeApiDetailToPokemon(pokeDetail);
};

pokeApi.getPokemons = async (offset = 0, limit = 12) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  const response = await fetch(url)
  .catch(error => {
    console.log("Não foi possível carregar os pokémons: ", error)
  })
  const jsonBody = await response.json();
  const pokemons = jsonBody.results;
  
  
  const detailRequests = pokemons.map(pokeApi.getPokemonDetail);
  const pokemonsDetails = await Promise.all(detailRequests);
  return pokemonsDetails;
  
};
