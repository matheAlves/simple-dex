import { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { Matchups } from "../components/Weaknesses";

const POKE_API_BASE_URL = "https://pokeapi.co/api/v2";
const POKE_SPRITE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const POKE_INFO_URL = "https://pokeapi.co/api/v2/pokemon-species/";

export default function Details({ navigation, route }) {
  const { pokemon, types } = route.params;
  
  const pokemonId = pokemon.url.split("/")[6];
  const pokemonImageUri = `${POKE_SPRITE_BASE_URL}${pokemonId}.png`;

  useEffect(() => {
    navigation.setOptions({
      title: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
    });
  })
  return (
    <View style={styles.detailsContainer}>
      <Matchups DefTypes={types} />
      <Image source={{ uri: pokemonImageUri }} style={styles.detailsImage} />
      <Text style={styles.detailsText}># {pokemonId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f2f9"
  },
  detailsImage: {
    width: 300,
    height: 300,
    marginBottom: 16,
        shadowColor: '#171717',
    shadowOffset: {width: 3, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  detailsText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "capitalize",
  },
});
