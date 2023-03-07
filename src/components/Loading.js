import { Easing, View, Animated } from "react-native";
import { useEffect } from "react";

export default function Loading() {
    useEffect(() => {
        startImageRotateFunction()
    })
  let rotateValueHolder = new Animated.Value(0);
  const startImageRotateFunction = () => {
    rotateValueHolder.setValue(0);
    Animated.timing(rotateValueHolder, {
      toValue: 3,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => startImageRotateFunction());
  };
  const RotateData = rotateValueHolder.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Animated.Image
        style={{
          width: 50,
          height: 50,
          alignSelf: "center",
          transform: [
            {
              rotate: RotateData,
            },
          ],
        }}
        source={require("../../assets/pokeball_icon.png")}
      />
    </View>
  );
}
