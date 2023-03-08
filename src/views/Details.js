import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
  Button,
  Switch,
  Modal,
  Pressable,
} from "react-native";
import Weaknesses from "../components/Weaknesses";
import TypeCard from "../components/TypeCard";
import Loading from "../components/Loading";
import Evilicons from "@expo/vector-icons/EvilIcons";

export default function Details({ navigation, route }) {
  const { pokemon } = route.params;
  const [types, setTypes] = useState([]);
  const [flavorText, setFlavorText] = useState(null);
  const [shiny, setShiny] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const POKE_SPRITE_BASE_URL = shiny
    ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/"
    : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
  const POKE_INFO_URL = "https://pokeapi.co/api/v2/pokemon/";
  const POKE_SPECIES_INFO_URL = "https://pokeapi.co/api/v2/pokemon-species/";

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
        const text = data.flavor_text_entries[0].flavor_text
          .split("\f")
          .map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index !== data.flavor_text_entries[0].flavor_text.length - 1
                ? "\n"
                : ""}
            </React.Fragment>
          ));

        setFlavorText(text);
      })
      .catch((error) => console.log(error));

    const title = `#${pokemonId} ${
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    }`;

    navigation.setOptions({
      title,
      headerRight: () => (
        <Button
          onPress={() => setModalVisible((prev) => setModalVisible(!prev))}
          title="Info"
        />
      ),
    });
  }, []);

  const toggleSwitch = () => setShiny((prev) => !prev);

  if (!types.length || !flavorText) {
    return <Loading />;
  }

  return (
    <View style={styles.detailsContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={styles.buttonClose}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Evilicons name="close-o" size={30} />
            </Pressable>
            <Text style={styles.modalText}>{flavorText}</Text>
          </View>
        </View>
      </Modal>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.innerView}>
          <Weaknesses type1={types[0]} type2={types[1]} />
          <Image
            source={{ uri: pokemonImageUri }}
            style={
              Platform.isPad ? styles.detailsImagePad : styles.detailsImageIos
            }
          />
          <View style={styles.bottomContainer}>
            <View style={styles.bottomTypesContainer}>
              {types.map((t) => (
                <TypeCard type={t} />
              ))}
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Shiny </Text>
              <Switch onValueChange={toggleSwitch} value={shiny} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    alignItems: "center",
    width: "100%",
  },
  detailsImagePad: {
    width: 550,
    height: 550,
    marginBottom: 16,
    shadowColor: "#171717",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flex: 0.5,
  },
  detailsImageIos: {
    width: 300,
    height: 300,
    marginBottom: 16,
    shadowColor: "#171717",
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  innerView: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  bottomTypesContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    padding: 0,
    flex: 0.9,
    justifyContent: "center",
  },
  switchContainer: {
    right: 5,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    color: "gray",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 10,
    width: "95%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 25,
    paddingBottom: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "50%",
  },
  modalText: {
    fontSize: 16,
    width: "100%",
    textAlign: "center",
  },
  buttonClose: {
    padding: 5,
    position: "absolute",
    right: 0,
  },
});
