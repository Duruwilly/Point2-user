import React, { Dispatch, SetStateAction, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { ApiRequest } from "../../services/ApiNetwork";
import { getDistanceFromLatLonInKm } from "../../utils/helpers";
import { useDispatch } from "react-redux";
import {
  setOrderCharges,
  setOrderResponse,
} from "../../store/reducers/app-reducer";
import OrderSummary from "./components/OrderSummary";
import { RenderScreenWebView } from "../SingleOrder/components/web-view";

const CreateOrder = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [delivery, setDelivery] = useState("STANDARD_DELIVERY");
  const [payee, setPayee] = useState("SENDER");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const { request } = ApiRequest();
  const [coupon, setCoupon] = useState("");
  const [charges, setCharges] = useState(false);
  const dispatch = useDispatch();
  const [webViewUrl, setWebViewUrl] = useState("");
  const pickupDetails = route?.params?.pickupDetails;
  // console.log("item in create order comp 1", pickupDetails);
  // console.log("item in create order comp 2", route?.params);
  
// console.log(route?.params);

  const hanldeDelivery = (item: string) => {
    setDelivery(item);
  };

  const webViewBack = () => {
    setWebViewUrl("");
  };

  const hanldePayment = (item: string) => {
    setPaymentMethod(item);
  };

  const handleWhoPays = (item: string) => {
    setPayee(item);
  };

  const getCharges = async () => {
    try {
      const distanceS = getDistanceFromLatLonInKm(
        route?.params?.pickup_location_coordinate[0],
        route?.params?.pickup_location_coordinate[1],
        route?.params?.delivery_point_location_coordinate[0],
        route?.params?.delivery_point_location_coordinate[1]
      );

      const formattedDistance = distanceS.toFixed(2);

      const response = await request("POST", {
        url: "/user/orders/get-charges",
        payload: { km: formattedDistance.toString(), coupon },
      });
      console.log("get-charges", response);

      if (response.status === "success") {
        setCharges(true);
        dispatch(setOrderCharges(response?.data?.data));
      }
    } catch (error) {}
  };

  const handleSummary = async () => {
    setLoading(true);
    try {
      if (!route.params.hasOwnProperty("delivery_point_location")) {
        alert("Please fill the delivery details section");
        setLoading(false);
      } else if(!route.params.hasOwnProperty("pickup_location")) {
        alert("Kindly fill the pickup details section");
      } else {
        const distanceS = getDistanceFromLatLonInKm(
          route?.params?.pickup_location_coordinate[0],
          route?.params?.pickup_location_coordinate[1],
          route?.params?.delivery_point_location_coordinate[0],
          route?.params?.delivery_point_location_coordinate[1]
        );

        const formattedDistance = distanceS.toFixed(2);

        const combinedData = {
          ...route.params,
          delivery_type: delivery,
          payment_method: paymentMethod,
          payee: payee,
          coupon: coupon,
          km: formattedDistance.toString(),
        };
        const response = await request("POST", {
          url: "/user/orders/create",
          payload: combinedData,
        });

        console.log("create-order", response);

        if (response.status === "success") {
          alert(response?.data?.message);
          setOrderSent(true);
          dispatch(setOrderResponse(response?.data?.data));
          getCharges();
        }
      }
    } catch (error) {
      console.log("Order error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      {/* {webViewUrl ? (
        <RenderScreenWebView url={webViewUrl} goBack={webViewBack} />
      ) : ( */}
      <Layout>
        <Layout.Header />
        <View style={{ padding: 20 }}>
          <Text style={styles.headerText}>New Order</Text>
        </View>
        <Layout.ScrollView>
          <KeyboardAvoidingView>
            <TouchableOpacity
              onPress={() => navigation.navigate("pick-up-details")}
              style={styles.touchableOpacity}
            >
              <View style={styles.textContainer}>
                <Text style={styles.pickupText}>PICKUP</Text>
                <Text style={styles.detailsText}>Enter Pickup Details</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={14} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("delivery-details", {
                  pickupDetails: pickupDetails,
                })
              }
              style={styles.touchableOpacity}
            >
              <View style={styles.textContainer}>
                <Text style={styles.pickupText}>Delivery Location</Text>
                <Text style={styles.detailsText}>Enter Delivery Details</Text>
              </View>
              <MaterialIcons name="arrow-forward-ios" size={14} color="black" />
            </TouchableOpacity>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#344054",
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                Delivery type
              </Text>
              <TouchableOpacity
                onPress={() => hanldeDelivery("STANDARD_DELIVERY")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginBottom: 20,
                }}
              >
                <View
                  style={[
                    styles.circle,
                    delivery === "STANDARD_DELIVERY" && styles.selectedCircle,
                  ]}
                />
                <Text style={styles.text}>Standard Delivery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => hanldeDelivery("EXPRESS_DELIVERY")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginBottom: 20,
                }}
              >
                <View
                  style={[
                    styles.circle,
                    delivery === "EXPRESS_DELIVERY" && styles.selectedCircle,
                  ]}
                />
                <Text style={styles.text}>Express Delivery</Text>
              </TouchableOpacity>
            </View>

            {/* SENDER AND RECEIVER PAY */}
            {/* {paymentMethod === "transfer" && ( */}
            <View style={styles.WhotoPayContainer}>
              <TouchableOpacity
                onPress={() => handleWhoPays("SENDER")}
                style={[styles.optionContainer, styles.marginBottom]}
              >
                <View
                  style={[
                    styles.circle,
                    payee === "SENDER" && styles.selectedCircle,
                  ]}
                />
                <Text style={styles.optionText}>Sender Pay</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleWhoPays("RECEIVER")}
                style={styles.optionContainer}
              >
                <View
                  style={[
                    styles.circle,
                    payee === "RECEIVER" && styles.selectedCircle,
                  ]}
                />
                <Text style={styles.optionText}>Receiver Pay</Text>
              </TouchableOpacity>
            </View>
            {/* )} */}

            {/* paymentMethod method */}
            {payee === "SENDER" && (
              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#344054",
                    fontWeight: "bold",
                    marginBottom: 20,
                  }}
                >
                  Payment Method
                </Text>
                <TouchableOpacity
                  onPress={() => hanldePayment("card")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={[
                      styles.circle,
                      paymentMethod === "card" && styles.selectedCircle,
                    ]}
                  />
                  <Text style={styles.text}>Card Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => hanldePayment("transfer")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={[
                      styles.circle,
                      paymentMethod === "transfer" && styles.selectedCircle,
                    ]}
                  />
                  <Text style={styles.text}>Pay with Transfer</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.container}>
              <TextInput
                style={styles.textInput}
                placeholder="Apply Coupon Code"
                placeholderTextColor="#98A2B3"
                value={coupon}
                onChangeText={(text) => setCoupon(text)}
              />
              {/* <TouchableOpacity
                disabled={coupon === ""}
                style={[styles.button, coupon === "" && styles.buttonDisabled]}
              >
                <Text style={styles.buttonText}>Apply</Text>
              </TouchableOpacity> */}
            </View>

            <Button
              style={{ borderRadius: 10, padding: 3, marginTop: 12 }}
              labelStyle={{ fontWeight: "bold", flex: 1 }}
              buttonColor={colors.primary}
              mode="contained"
              textColor="white"
              onPress={handleSummary}
              disabled={loading || orderSent || !route.params}
              loading={loading}
            >
              Order Summary
            </Button>

            {charges && (
              <OrderSummary
                setWebViewUrl={setWebViewUrl}
                webViewUrl={webViewUrl}
              />
            )}
          </KeyboardAvoidingView>
        </Layout.ScrollView>
      </Layout>
      {/* )} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
  },
  touchableOpacity: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    height: 58,
    padding: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    // borderWidth: 1,
    // borderColor: '#0077B6',
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  pickupText: {
    fontSize: 14,
    color: "#344054",
    fontWeight: "bold",
  },
  detailsText: {
    fontSize: 12,
    color: "#667085",
    fontWeight: "medium",
    paddingTop: 1,
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 9999,
    backgroundColor: "#D9D9D9",
    marginRight: 10,
  },
  selectedCircle: {
    backgroundColor: "#EBF8FF",
    borderWidth: 2,
    borderColor: "#0077B6",
  },
  text: {
    fontSize: 14,
    color: "#344054",
    fontWeight: "medium",
    marginLeft: 2,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 13,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    height: 40,
    // paddingVertical: 14,
    borderRadius: 8,
    paddingLeft: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#003B5B",
    height: 36,
    paddingHorizontal: 16,
    marginLeft: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  WhotoPayContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    height: 82,
    width: "100%",
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  optionText: {
    fontSize: 14,
    color: "#344054",
    fontWeight: "500",
    marginLeft: 8,
  },
  marginBottom: {
    marginBottom: 16,
  },
});

export default CreateOrder;
