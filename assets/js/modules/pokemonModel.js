export class Pokemon {
    number;
    name;
    type;
    types = [];
    photo;
    species;
    height;
    weight;
    abilities = [];
    gender = {};
    eggGroups = [];
    eggCycle;
    baseStats = {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0
    };
  }