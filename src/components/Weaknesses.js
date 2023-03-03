import { View, Text } from "react-native";

export const types = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
];

const _ = 1;
const h = 1 / 2;
const x = NaN;

const typesMap = [
  [_, _, _, _, _, _, _, _, _, _, _, _, h, 0, _, _, h, _],
  [_, h, h, _, 2, 2, _, _, _, _, _, 2, h, _, h, _, 2, _],
  [_, 2, h, _, h, _, _, _, 2, _, _, _, 2, _, h, _, _, _],
  [_, _, 2, h, h, _, _, _, 0, 2, _, _, _, _, h, _, _, _],
  [_, h, 2, _, h, _, _, h, 2, h, _, h, 2, _, h, _, h, _],
  [_, h, h, _, 2, h, _, _, 2, 2, _, _, _, _, 2, _, h, _],
  [2, _, _, _, _, 2, _, h, _, h, h, h, 2, 0, _, 2, 2, h],
  [_, _, _, _, 2, _, _, h, h, _, _, _, h, h, _, _, 0, 2],
  [_, 2, _, 2, h, _, _, 2, _, 0, _, h, 2, _, _, _, 2, _],
  [_, _, _, h, 2, _, 2, _, _, _, _, 2, h, _, _, _, h, _],
  [_, _, _, _, _, _, 2, 2, _, _, h, _, _, _, _, 0, h, _],
  [_, h, _, _, 2, _, h, h, _, h, 2, _, _, h, _, 2, h, h],
  [_, 2, _, _, _, 2, h, _, h, 2, _, 2, _, _, _, _, h, _],
  [0, _, _, _, _, _, _, _, _, _, 2, _, _, 2, _, h, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, 2, _, h, 0],
  [_, _, _, _, _, _, h, _, _, _, 2, _, _, 2, _, h, _, h],
  [_, h, h, h, _, 2, _, _, _, _, _, _, 2, _, _, _, h, 2],
  [_, h, _, _, _, _, 2, h, _, _, _, _, _, _, 2, 2, h, _],
];

function createMatchupMap() {
  const map = new Map();
  const data = typesMap;
  for (const [r, row] of data.entries()) {
    for (const [c, col] of row.entries()) {
      const t1 = types[r];
      const t2 = types[c];
      const key = getKey(t1, t2);
      map.set(key, col);
    }
  }
  return map;
}

function getKey(t1, t2) {
  return `${t1} > ${t2}`;
}

function matchupForPair(defenseType, offenseType) {
  const map = createMatchupMap();
  const key = getKey(offenseType, defenseType);
  const val = map.get(key);
  if (val === undefined) {
    throw new Error(`matchupForPair: ${key}`);
  }
  return val;
}

export function matchupFor(defenseTypes, offenseType) {
  return defenseTypes
    .filter((t) => t !== "none")
    .map((t) => matchupForPair(t, offenseType))
    .reduce((a, b) => a * b, 1);
}

export class GroupedMatchups {
  constructor(matchups) {
    this.matchups = matchups;
  }

  typesFor(effectivenes) {
    return this.matchups
      .filter((m) => m.effectiveness === effectivenes)
      .map((m) => m.type);
  }
}

export function defensiveMatchups(defenseTypes) {
  const matchups = types.map((t) => {
    const eff = matchupFor(defenseTypes, t);
    return { t, eff };
  });
  return new GroupedMatchups(matchups);
}

const effectivenessLevels = [8, 4, 2, 1, 1 / 2, 1 / 4, 1 / 8, 0];

export function Matchups({ DefTypes }) {
  const matchups = defensiveMatchups(DefTypes);
  return (
    <View>
      {effectivenessLevels.map((eff) => {
        return (
          <Weaknesses
            key={eff}
            title={`Takes ${eff} from`}
            types={matchups.typesFor(eff)}
          />
        );
      })}
    </View>
  );
}

function Weaknesses({ title, types }) {
  if (types.length === 0) {
    return null;
  }
  return (
    <View>
      <Text>{title}</Text>
      <View>
        {types.map((t) => (
          <Text key={`type-${t}`} type={t} />
        ))}
      </View>
    </View>
  );
}
