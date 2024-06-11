import React, { Dispatch, SetStateAction } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Send from "../../../assets/icon/send.svg";
import Gift from "../../../assets/icon/giftPackage.svg";
import { useNavigation } from "@react-navigation/native";

const SendPackage = () => {
  const navigation: any = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Send a Package</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("create-order")}
          // onPress={() => navigation.navigate("chat-box")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Request Pickup</Text>
          <View style={styles.iconContainer}>
            <Send />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.giftIconContainer}>
        <Gift />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 100,
    backgroundColor: "#0077B6",
    borderRadius: 10,
    marginTop: 10,
    paddingLeft: 20,
  },
  textContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    paddingVertical: 8,
  },
  title: {
    fontSize: 20,
    color: "#EBF8FF",
    fontWeight: "bold",
    paddingTop: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 135,
    height: 34,
    backgroundColor: "#EBF8FF",
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 12,
    color: "#0077B6",
    fontWeight: "bold",
  },
  iconContainer: {
    marginLeft: 6,
  },
  giftIconContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: -3,
  },
});

export default SendPackage;
