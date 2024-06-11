import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Box from "../../../assets/icon/box.svg";
import Scan from "../../../assets/icon/scan.svg";
import { useNavigation } from "@react-navigation/native";

const TrackPackage = () => {
  const navigation: any = useNavigation();
  const [userInput, setUserInput] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track your package</Text>
      <Text style={styles.subtitle}>Please enter your Package Tracking ID</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tracking ID"
          placeholderTextColor="#98A2B3"
          value={userInput}
          onChangeText={(text) => setUserInput(text)}
        />
        <View style={styles.iconContainer}>
          <Box width={24.1} height={28.12} />
        </View>
        <TouchableOpacity
          onPress={() =>
            userInput &&
            navigation.navigate("tracking", { trackingId: userInput })
            // navigation.navigate("rating")
          }
          style={styles.scanButton}
        >
          <Scan height={24} width={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#EBF8FF",
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 14,
    color: "#1D2939",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#1D2939",
    fontWeight: "normal",
    paddingTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    height: 42,
    paddingLeft: 56, // Adjust to make space for the icon
    fontSize: 14,
    color: "#98A2B3",
    fontWeight: "normal",
  },
  iconContainer: {
    position: "absolute",
    left: 16,
  },
  scanButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    width: 42,
    borderRadius: 10,
    backgroundColor: "#0077B6",
    marginLeft: 12,
  },
});

export default TrackPackage;
