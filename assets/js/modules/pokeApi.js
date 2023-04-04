import { Pokemon } from "./pokemonModel.js";

  export const pokeApi = {};
  
  export function convertPokeApiDetailToPokemon(pokeDetail) {
    
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;
  
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;
  
    pokemon.types = types;
    pokemon.type = type;
  
    if (pokeDetail.species) {
      pokemon.species = pokeDetail.species.name;
    }
  
    if (pokeDetail.height) {
      pokemon.height = `${(pokeDetail.height / 10).toFixed(2)} cm`;
    }
  
    if (pokeDetail.weight) {
      pokemon.weight = `${pokeDetail.weight / 10}kg`;
    }
  
    if (pokeDetail.abilities) {
      pokemon.abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name);
    }
  
   fetch(pokeDetail.species.url)
   .then(response => response.json())
   .then(resp =>{
    if (resp.gender_rate !== undefined) {
        let female = resp.gender_rate / 8 * 100;
        pokemon.gender.male = `${100 - female}%`;
        pokemon.gender.female = `${female}%`
      }
    
      if (resp.egg_groups) {
        pokemon.eggGroups = resp.egg_groups.map((eggGroup) => eggGroup.name);
      }
    
      if (resp.hatch_counter !== undefined) {
        pokemon.eggCycle = Math.round(resp.hatch_counter / 255 * 100);
      }
   })
  
    if (pokeDetail.stats) {
      for (const statSlot of pokeDetail.stats) {
        switch (statSlot.stat.name) {
          case 'hp':
            pokemon.baseStats.hp = statSlot.base_stat;
            break;
          case 'attack':
            pokemon.baseStats.attack = statSlot.base_stat;
            break;
          case 'defense':
            pokemon.baseStats.defense = statSlot.base_stat;
            break;
          case 'special-attack':
            pokemon.baseStats.specialAttack = statSlot.base_stat;
            break;
          case 'special-defense':
            pokemon.baseStats.specialDefense = statSlot.base_stat;
            break;
          case 'speed':
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
    console.log(pokemon)
    return pokemon;
  }
  
  pokeApi.getPokemonDetail = async (pokemon) => {
    const response = await fetch(pokemon.url);
    const pokeDetail = await response.json();
    return convertPokeApiDetailToPokemon(pokeDetail);

  };
  
  pokeApi.getPokemons = async (offset = 0, limit = 1) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  
    const response = await fetch(url);
    const jsonBody = await response.json();
    const pokemons = jsonBody.results;
    const detailRequests = pokemons.map(pokeApi.getPokemonDetail);
    const pokemonsDetails = await Promise.all(detailRequests);
    return pokemonsDetails;
  };
  