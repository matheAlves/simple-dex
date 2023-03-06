import { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { SearchBar } from "@rneui/themed";
import Constants from "expo-constants";
import * as Font from 'expo-font';


const POKE_API_BASE_URL = "https://pokeapi.co/api/v2";
const POKE_SPRITE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

export default function Search({ navigation }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchBarVisible, setSearchBarVisible] = useState(true);
  const [prevOffset, setPrevOffset] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  // const [fontsLoaded] = Font.useFonts({
  //   FontName: require('FontName-Regular.ttf'),
  // });

  useEffect(() => {
    fetch(`${POKE_API_BASE_URL}/pokemon?limit=1500`)
      .then((response) => response.json())
      .then((data) => {
        setPokemonList(data.results);
        setFilteredPokemonList(data.results);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const isScrollingUp = currentOffset < prevOffset;
    setPrevOffset(currentOffset);
    if (isScrollingUp) {
      setSearchBarVisible(true);
    } else {
      setSearchBarVisible(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredList = pokemonList.filter((pokemon) =>
      pokemon.name.includes(text.toLowerCase())
    );
    setFilteredPokemonList(filteredList);
  };

  const renderItem = ({ item }) => {
    const pokemonId = item.url.split("/")[6];
    const pokemonImageUri = `${POKE_SPRITE_BASE_URL}${pokemonId}.png`;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate("Details", { pokemon: item })}
      >
        <Image source={{ uri: pokemonImageUri }} style={styles.itemImage} />
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });
  

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateY: searchBarTranslateY }],
          height: searchBarVisible ? 50 : 0,
          overflow: "hidden",
        }}
      >
        <SearchBar
          placeholder="Search by name"
          onChangeText={handleSearch}
          value={searchText}
          platform="ios"
          containerStyle={styles.searchInputContainer}
          inputContainerStyle={styles.searchInput}
        />
      </Animated.View>

      <View style={styles.listContainer}>
        <FlatList
          data={filteredPokemonList}
          renderItem={renderItem}
          keyExtractor={(item) => item.url}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "space-evenly",
          }}
          onScroll={handleScroll}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "17%",
    borderBottomWidth: 0.8,
    borderBottomColor: "#E2E2E2",
  },
  itemImage: {
    width: 107,
    height: 107,
    shadowColor: "#171717",
    shadowOffset: { width: 3.5, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },
  itemText: {
    fontSize: 17,
    fontWeigh: 100,
    textTransform: "capitalize",
    color: "black",
    marginBottom: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight * 0.5,
    backgroundColor: "#f3f2f9",
  },
  searchInputContainer: {
    padding: 10,
    margin: 5,
    backgroundColor: "#f3f2f9",
  },
  searchInput: {
    height: 15,
  },
  listContainer: {
    width: "100%",
  },
});
