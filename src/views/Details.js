import { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import Weaknesses from "../components/Weaknesses";
import TypeCard from "../components/TypeCard";

const POKE_SPRITE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const POKE_INFO_URL = "https://pokeapi.co/api/v2/pokemon/";
const POKE_SPECIES_INFO_URL = "https://pokeapi.co/api/v2/pokemon-species/";

export default function Details({ navigation, route }) {
  const { pokemon } = route.params;

  const [types, setTypes] = useState([]);
  const [flavorText, setFlavorText] = useState(null);

  const pokemonId = pokemon.url.split("/")[6];
  const pokemonImageUri = `${POKE_SPRITE_BASE_URL}${pokemonId}.png`;

  useEffect(() => {
    fetch(`${POKE_INFO_URL}${pokemon.name}`)
      .then((response) => response.json())
      .then((data) => {
        const types = data.types.map((slot) => slot.type.name);
        setTypes(types);
      })
      .catch((error) => console.log(error));

    fetch(`${POKE_SPECIES_INFO_URL}${pokemon.name}`)
      .then((response) => response.json())
      .then((data) => {
        const flavorText = data.flavor_text_entries[0].flavor_text;
        setFlavorText(flavorText);
      })
      .catch((error) => console.log(error));

    const title = `#${pokemonId} ${
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    }`;

    navigation.setOptions({ title });
  }, []);

  if (!types.length || !flavorText) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.detailsContainer}>
      <Weaknesses type1={types[0]} type2={types[1]} />
      <View style={styles.pokemonInfo}>
        <Image source={{ uri: pokemonImageUri }} style={styles.detailsImage} />
        <View style={styles.typesCardsContainer}>
          {types.map((t) => (
            <TypeCard type={t} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f2f9",
  },
  detailsImage: {
    width: 300,
    height: 300,
    marginBottom: 16,
    shadowColor: "#171717",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  pokemonInfo: {
    fontSize: 24,
    marginBottom: 8,
    alignItems: "center",
  },
  typesCardsContainer: {
    marginTop: -10,
    flexDirection: "row",
    flexWrap: 'wrap'
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
