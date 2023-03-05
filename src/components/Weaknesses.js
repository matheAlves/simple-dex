import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

export default function Weaknesses({ type1, type2 }) {
  const [weaknesses, setWeaknesses] = useState({});

  const typeChart = {
    normal: { fighting: 2, ghost: 0 },
    fighting: {
      flying: 2,
      rock: 0.5,
      bug: 0.5,
      psychic: 2,
      dark: 0.5,
      fairy: 2,
    },
    flying: {
      rock: 2,
      electric: 2,
      ice: 2,
      grass: 0.5,
      fighting: 0.5,
      ground: 0,
      bug: 0.5,
    },
    poison: {
      fighting: 0.5,
      ground: 2,
      poison: 0.5,
      bug: 0.5,
      grass: 0.5,
      fairy: 0.5,
      psychic: 2,
    },
    ground: {
      water: 2,
      electric: 0,
      grass: 2,
      ice: 2,
      poison: 0.5,
      rock: 0.5,
    },
    rock: {
      fighting: 2,
      ground: 2,
      steel: 2,
      water: 2,
      grass: 2,
      normal: 0.5,
      flying: 0.5,
      poison: 0.5,
      fire: 0.5,
    },
    bug: {
      flying: 2,
      rock: 2,
      fire: 2,
      fighting: 0.5,
      ground: 0.5,
      grass: 0.5,
    },
    ghost: { normal: 0, fighting: 0, poison: 0.5, bug: 0.5, ghost: 2, dark: 2 },
    steel: {
      fighting: 2,
      ground: 2,
      fire: 2,
      normal: 0.5,
      flying: 0.5,
      rock: 0.5,
      bug: 0.5,
      steel: 0.5,
      grass: 0.5,
      psychic: 0.5,
      ice: 0.5,
      dragon: 0.5,
      fairy: 0.5,
    },
    fire: {
      ground: 2,
      rock: 2,
      water: 2,
      bug: 0.5,
      steel: 0.5,
      fire: 0.5,
      grass: 0.5,
      ice: 0.5,
      fairy: 0.5,
    },
    water: {
      water: 2,
      electric: 2,
      steel: 0.5,
      fire: 0.5,
      water: 0.5,
      ice: 0.5,
    },
    grass: {
      flying: 2,
      poison: 2,
      bug: 2,
      fire: 2,
      ice: 2,
      ground: 0.5,
      water: 0.5,
      grass: 0.5,
      electric: 0.5,
    },
    electric: {
      ground: 2,
      flying: 0.5,
      steel: 0.5,
      electric: 0.5,
    },
    psychic: { fighting: 0.5, bug: 2, ghost: 2, psychic: 0.5, dark: 2 },
    ice: {
      fighting: 2,
      fire: 2,
      rock: 2,
      steel: 2,
      ice: 0.5,
    },
    dragon: {
      dragon: 2,
      ice: 2,
      fairy: 2,
      fire: 0.5,
      water: 0.5,
      grass: 0.5,
      electric: 0.5,
    },
    dark: {
      fighting: 2,
      bug: 2,
      fairy: 2,
      ghost: 0.5,
      dark: 0.5,
      psychic: 2,
    },
    fairy: {
      fighting: 0.5,
      poison: 2,
      bug: 0.5,
      steel: 2,
      dark: 0.5,
      dragon: 0,
    },
  };

  const effs = {
    4: "4x",
    2: "2x",
    0.5: "1/2x",
    0.25: "1/4x",
    0: "0x",
  };

  useEffect(() => {
    const weaknessesObj = createWknsObj();

    const grouped = groupByEff(weaknessesObj);

    setWeaknesses(grouped);

    console.log(weaknesses)
  }, []);

  function createWknsObj() {
    let result = {};

    const type1Weaknesses = Object.keys(typeChart[type1]);

    if (type2) {
      const type2Weaknesses = Object.keys(typeChart[type2]);
      const wknsIntersection = type1Weaknesses.filter((value) =>
        type2Weaknesses.includes(value)
      );
      const type1Rest = type1Weaknesses.filter(
        (value) => !wknsIntersection.includes(value)
      );
      const type2Rest = type2Weaknesses.filter(
        (value) => !wknsIntersection.includes(value)
      );
      wknsIntersection.forEach((t) => {
        const eff = typeChart[type1][t] * typeChart[type2][t];
        if (eff !== 1) {
          Object.assign(result, { [t]: eff });
        }
      });
      type1Rest.forEach((t) => {
        Object.assign(result, { [t]: typeChart[type1][t] });
      });
      type2Rest.forEach((t) => {
        Object.assign(result, { [t]: typeChart[type2][t] });
      });
    } else {
      type1Weaknesses.forEach((t) => {
        Object.assign(result, { [t]: typeChart[type1][t] });
      });
    }
      
    return result;
  }

  function groupByEff(obj) {
    const grouped = {};
    for (const key in obj) {
      const value = obj[key];
      if (!grouped[value]) {
        Object.assign(grouped, { [value]: [key] });
      } else {
        grouped[value].push(key);
      }
    }

    return grouped;
  }

  function weaknessesView() {
    return (
      <View>
        {Object.keys(weaknesses).sort().reverse().map((k, i) => {
          return (
            <View key={k}>
              <Text style={styles.weaknessesContainer}>
                {effs[k]}: {
                 weaknesses[k].map(t => <Text>{`${t} `}</Text>)
               }
              </Text>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View>{Object.keys(weaknesses).length ? weaknessesView() : <Text> Loading </Text>}</View>
  );
}

const styles = StyleSheet.create({
  weaknessesContainer: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});
