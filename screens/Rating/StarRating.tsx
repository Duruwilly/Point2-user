import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";
import { colors } from "constants/colors";
import Layout from "layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ApiRequest } from "services/ApiNetwork";

interface StarRatingProps {
  maxStars?: number;
  onRatingSelect?: (rating: number) => void;
}

const Rating = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { request } = ApiRequest();

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
  };

  const submitRating = async () => {
    setLoading(true);
    try {
      const resp = await request("POST", {
        url: "",
        payload: { selectedRating },
      });
      if (resp.status === "success") {
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.Header />
        <Text style={[styles.headerText, { paddingTop: 20 }]}>Rate Rider</Text>
        <Layout.Body>
          <Text style={styles.text}>
            Your order has been completed leave a rating or{" "}
            <TouchableOpacity onPress={() => setShow(!show)}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#0f80bb",
                  textAlign: "center",
                }}
              >
                {" "}
                write a review
              </Text>
            </TouchableOpacity>
          </Text>
          <StarRating onRatingSelect={handleRatingSelect} />
          {show && (
            <View style={{ marginTop: 20, marginBottom: 10 }}>
              <TextInput
                value={rating}
                onChangeText={(text) => setRating(text)}
                multiline={true}
                numberOfLines={3}
                //   placeholder="Please describe the problem"
                outlineColor={colors.inputBorder}
                activeOutlineColor={colors.primary + "99"}
                activeUnderlineColor="#00000000"
                placeholderTextColor="#667085"
                outlineStyle={{ borderRadius: 15 }}
                mode="outlined"
                style={{
                  backgroundColor: colors.inputBackground,
                  color: colors.primary,
                  height: 150,
                }}
              />
            </View>
          )}
          <Button
            style={{ borderRadius: 10, padding: 3 }}
            labelStyle={{ fontWeight: "bold", flex: 1 }}
            buttonColor={colors.primary}
            mode="contained"
            textColor="white"
            onPress={submitRating}
            // disabled={selectedRating === 0}
            loading={loading}
          >
            Leave Review
          </Button>
        </Layout.Body>
      </Layout>
    </SafeAreaView>
  );
};

const StarRating: React.FC<StarRatingProps> = ({
  maxStars = 5,
  onRatingSelect,
}) => {
  const [rating, setRating] = useState(0);

  const handleRating = (rate: number) => {
    setRating(rate);
    if (onRatingSelect) {
      onRatingSelect(rate);
    }
  };

  return (
    <View style={styles.starContainer}>
      {[...Array(maxStars)].map((_, index) => (
        <TouchableOpacity key={index} onPress={() => handleRating(index + 1)}>
          <FontAwesome
            name="star"
            size={32}
            color={index < rating ? "#d8bc27" : "#D3D3D3"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     justifyContent: "center",
  //     alignItems: "center",
  //     backgroundColor: "#f5f5f5",
  //     padding: 20,
  //   },
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  text: {
    marginBottom: 10,
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    alignItems: "center",
    lineHeight: 26,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: colors.primary,
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});

export default Rating;
