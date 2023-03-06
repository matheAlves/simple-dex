import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TypeCard({ type }) {
  const typesColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };

  return ( 
    <View style={[styles.card, { backgroundColor: typesColors[type] }]}>
      <Text style={styles.cardText}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 10,
    margin: 1.5,
  },
  cardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize"
  },
});
