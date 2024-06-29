/** @format */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapViewDirections from "react-native-maps-directions";
import {
  AntDesign,
  Ionicons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { userConnectedToOrder } from "../ChatBox";
import { ApiRequest } from "../../services/ApiNetwork";
import BottomSheet from "../../components/Bottomsheet/Bottomsheet";
import Verified from "../../assets/icon/verified.svg";
import { colors } from "../../constants/colors";
import { Orders } from "../../models/Orders";
// import { BASE_URL } from "../../constants/Base_urls";
// import { RenderScreenWebView } from "../SingleOrder/components/web-view";
import { GOOGLE_PLACES_API_KEY } from "../../constants/app";

const Tracking = ({ route }: any) => {
  const { request } = ApiRequest();
  const navigation: any = useNavigation();
  const [riderLocation, setRiderLocation] = useState<any>(null);
  const { orders } = useSelector((state: RootState) => state.appReducer);
  const trackingId = route?.params?.trackingId;
  // const webviewValues = { order_id: orderResponse.id, callback_url: BASE_URL };
  const insets = useSafeAreaInsets();
  // const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  // const [userConnectedToOrder, setUserConnectedToOrder] = useState(
  //   {} as userConnectedToOrder
  // );
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const mapRef = useRef<MapView>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState("");
  const bottomSheetRef: any = useRef(null);
  const snapPoints = useMemo(() => ["25%", "35%"], []);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const webViewBack = () => {
    setWebViewUrl("");
  };

  const onMapLayout = () => {
    setIsMapReady(true);
  };

  const closeBottomSheet = () => {
    setOpenBottomSheet(false);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  // const hanldePayment = (item: string) => {
  //   setPaymentMethod(item);
  // };

  const apiKey = GOOGLE_PLACES_API_KEY;

  let orderDetails = null;

  if (trackingId) {
    orderDetails = orders?.find(
      (item: Orders) => item?.tracking_id === trackingId
    );
  }
  // console.log(orderDetails);

  // const orderDetails = orders?.find(
  //   (item: Orders) => item?.tracking_id === trackingId
  // );

  // console.log(orderDetails, trackingId);
  const originLatitude = riderLocation ? riderLocation[0] : null;
  const originLongitude = riderLocation ? riderLocation[1] : null;
  // const originLatitude = orderDetails?.pickup_location_coordinate
  //   ? orderDetails?.pickup_location_coordinate[0]
  //   : null;
  // const originLongitude = orderDetails?.pickup_location_coordinate
  //   ? orderDetails?.pickup_location_coordinate[1]
  //   : null;
  const destinationLatitude = orderDetails?.delivery_point_location_coordinate
    ? orderDetails?.delivery_point_location_coordinate[0]
    : null;
  const destinationLongitude = orderDetails?.delivery_point_location_coordinate
    ? orderDetails?.delivery_point_location_coordinate[1]
    : null;

  const [origin, setOrigin] = useState({
    latitude: originLatitude || 0,
    longitude: originLongitude || 0,
  });
  const [destination, setDestination] = useState({
    latitude: destinationLatitude || 0,
    longitude: destinationLongitude || 0,
  });

  useEffect(() => {
    if (
      originLatitude &&
      originLongitude &&
      destinationLatitude &&
      destinationLongitude &&
      riderLocation
    ) {
      setOrigin({ latitude: originLatitude, longitude: originLongitude });
      setDestination({
        latitude: destinationLatitude,
        longitude: destinationLongitude,
      });
    }
  }, [
    originLatitude,
    originLongitude,
    destinationLatitude,
    destinationLongitude,
    riderLocation,
  ]);

  const fetchRiderLocation = async () => {
    const resp = await request("GET", {
      url: `/user/orders/track?tracking_id=${trackingId}`,
      // payload: {tracking_id: trackingId},
      ignoreError: true,
    });

    if (resp.status === "success") {
      setRiderLocation(resp.data?.data?.rider_current_position);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchRiderLocation, 20000);
    return () => clearInterval(interval);
  }, []);

  // USING SOCKET
  // useEffect(() => {
  //   const ws = new WebSocket('wss://your-websocket-endpoint');

  //   ws.onopen = () => {
  //     ws.send(JSON.stringify({ trackingId }));
  //   };

  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     setRiderLocation(data);
  //   };

  //   return () => ws.close();
  // }, []);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await request("GET", {
  //         url: `/messaging/get-user-connected-to-order?tracking_id=${trackingId}`,
  //         // payload: { tracking_id: trackingId },
  //         ignoreError: true,
  //       });
  //       // console.log("user-conected-to-order", response);

  //       if (response.status === "success") {
  //         setUserConnectedToOrder(response.data.data);
  //         setOpenBottomSheet(true);
  //       } else {
  //         // setOpenBottomSheet(true); // remove later
  //       }
  //     } catch (error) {
  //       // setOpenBottomSheet(true); // remove later
  //     }
  //   })();
  // }, []);

  // useEffect(() => {
  //   if (paymentMethod === "card") {
  //     (async () => {
  //       try {
  //         const response = await request("POST", {
  //           url: "/user/orders/order-checkout",
  //           payload: { ...webviewValues },
  //         });
  //         console.log("confirm-order", response);

  //         if (response.status === "success") {
  //           setWebViewUrl(response.data.data.authorization_url);
  //           closeBottomSheet();
  //         } else {
  //         }
  //       } catch (error) {
  //         console.log("error getting webview", error);
  //       }
  //     })();
  //   } else {
  //     // handle method for transfer here
  //   }
  // }, [paymentMethod]);

  if (
    !destinationLatitude ||
    !destinationLongitude &&
    !orderDetails
  ) {
    return (
      <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
        <Layout.Header />
        <Layout>
          <Layout.Body>
            <View style={[styles.container, { marginTop: 50 }]}>
              <Text style={styles.errorText}>
                No Location data available yet. You can check back later when
                your order is in transit.
              </Text>
            </View>
          </Layout.Body>
        </Layout>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* {webViewUrl ? (
        <View style={{ paddingTop: insets.top }}>
          <RenderScreenWebView url={webViewUrl} goBack={webViewBack} />
        </View>
      ) : ( */}
      {!riderLocation ? (
        <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
          <Layout.Header />
          <Layout>
            <Layout.Body>
              <View style={[styles.container, { marginTop: 50 }]}>
                <Text style={styles.errorText}>
                  Fetching rider's location...
                </Text>
              </View>
            </Layout.Body>
          </Layout>
        </SafeAreaView>
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={[styles.map]}
            region={{
              latitude: (origin?.latitude + destination?.latitude) / 2,
              longitude: (origin?.longitude + destination?.longitude) / 2,
              // latitude: (riderLocation?.latitude + destination?.latitude) / 2,
              // longitude:
              //   (riderLocation?.longitude + destination?.longitude) / 2,
              latitudeDelta:
                Math.abs(origin?.latitude - destination?.latitude) * 2,
              // Math.abs(riderLocation?.latitude - destination?.latitude) * 2,
              longitudeDelta:
                Math.abs(origin?.longitude - destination?.longitude) * 2,
              // Math.abs(riderLocation?.longitude - destination?.longitude) * 2,
            }}
            loadingIndicatorColor="#e21d1d"
            provider={
              Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            }
            scrollEnabled={true}
            rotateEnabled={true}
            showsUserLocation={true}
            loadingEnabled={true}
            pitchEnabled={true}
            showsIndoorLevelPicker={true}
            onMapReady={onMapLayout}
          >
            <Marker coordinate={origin}>
              <MaterialCommunityIcons
                name="motorbike"
                size={24}
                color="black"
              />
            </Marker>
            {origin && <Marker coordinate={origin} />}
            {destination && <Marker coordinate={destination} />}
            {isMapReady && origin && destination && (
              <MapViewDirections
                origin={origin}
                destination={destination}
                apikey={apiKey}
                strokeColor={colors.primary}
                strokeWidth={4}
                onReady={(args) => {
                  setDistance(Number(args?.distance));
                  setDuration(args?.duration);
                }}
                mode="DRIVING"
              />
            )}
            <View
              style={{
                padding: 16,
                position: "absolute",
                top: 150,
                right: 10,
              }}
            ></View>
          </MapView>
          {distance && duration ? (
            <View style={{ position: "absolute", right: 30, top: 100 }}>
              <Text style={{ fontWeight: "800", color: "red" }}>
                Distance: {distance?.toFixed(2)}
              </Text>
              <Text style={{ fontWeight: "800", color: "red" }}>
                Duration:{" "}
                {duration >= 60
                  ? `${Math.floor(duration / 60)} hr ${Math.ceil(
                      duration % 60
                    )} min`
                  : `${Math.ceil(duration)} min`}
              </Text>
            </View>
          ) : null}
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.backButton]}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        </>
      )}
      {/* )} */}
      {openBottomSheet && (
        // <BottomSheet
        //   ref={bottomSheetRef}
        //   index={1}
        //   snapPoints={snapPoints}
        //   style={{ padding: 0 }}
        //   onChange={(index) => {
        //     if (index === -1 || index === 0) {
        //       closeBottomSheet();
        //     }
        //   }}
        // >
        //   <View style={{ marginTop: 20, flex: 1 }}>
        //     <View style={styles.header}>
        //       <View style={styles.headerLeft}>
        //         <View style={styles.riderImageContainer}>
        //           <Image
        //             style={styles.riderImage}
        //             source={
        //               userConnectedToOrder?.profile_picture
        //                 ? { uri: userConnectedToOrder?.profile_picture }
        //                 : require("../../assets/images/rider.jpg")
        //             }
        //             alt="Rider"
        //           />
        //           <View style={styles.verifiedIcon}>
        //             <Verified />
        //           </View>
        //         </View>
        //         <View style={styles.riderInfo}>
        //           <View style={styles.riderNameContainer}>
        //             <Text style={styles.riderName}>
        //               {userConnectedToOrder?.first_name ?? ""}{" "}
        //               {userConnectedToOrder?.last_name ?? ""}
        //             </Text>
        //             <View style={styles.riderBadge}>
        //               <Text style={styles.riderBadgeText}>Rider</Text>
        //             </View>
        //           </View>
        //         </View>
        //       </View>
        //     </View>
        //     {/* <View style={{ paddingHorizontal: 20 }}>
        //       <View
        //         style={{
        //           alignItems: "flex-start",
        //           justifyContent: "flex-start",
        //           marginTop: 10,
        //         }}
        //       >
        //         <TouchableOpacity
        //           onPress={() => hanldePayment("card")}
        //           style={{
        //             flexDirection: "row",
        //             alignItems: "center",
        //             justifyContent: "flex-start",
        //             marginBottom: 15,
        //           }}
        //         >
        //           <View
        //             style={[
        //               styles.circle,
        //               paymentMethod === "card" && styles.selectedCircle,
        //             ]}
        //           />
        //           <Text style={styles.text}>Pay with Card</Text>
        //         </TouchableOpacity>
        //         <TouchableOpacity
        //           onPress={() => hanldePayment("transfer")}
        //           style={{
        //             flexDirection: "row",
        //             alignItems: "center",
        //             justifyContent: "flex-start",
        //             marginBottom: 20,
        //           }}
        //         >
        //           <View
        //             style={[
        //               styles.circle,
        //               paymentMethod === "transfer" && styles.selectedCircle,
        //             ]}
        //           />
        //           <Text style={styles.text}>Pay with Transfer</Text>
        //         </TouchableOpacity>
        //       </View>
        //     </View> */}
        //     <View
        //       style={{
        //         flexDirection: "row",
        //         gap: 12,
        //         paddingHorizontal: 20,
        //         marginTop: 10,
        //       }}
        //     >
        //       <TouchableOpacity
        //         onPress={async () =>
        //           await Linking.openURL(`tel:${userConnectedToOrder?.phone}`)
        //         }
        //         style={[
        //           {
        //             flex: 1,
        //             backgroundColor: "#27AE60",
        //             paddingVertical: 10,
        //             borderRadius: 10,
        //             flexDirection: "row",
        //             alignItems: "center",
        //             gap: 7,
        //             justifyContent: "center",
        //           },
        //         ]}
        //       >
        //         <Feather name="phone" size={20} color="white" />
        //         <Text style={{ color: "white" }}>Call</Text>
        //       </TouchableOpacity>
        //       <TouchableOpacity
        //         onPress={() =>
        //           navigation.navigate("chat-box", { trackingId: trackingId })
        //         }
        //         style={[
        //           {
        //             flex: 1,
        //             backgroundColor: colors.secondary,
        //             paddingVertical: 10,
        //             borderRadius: 10,
        //             flexDirection: "row",
        //             alignItems: "center",
        //             gap: 7,
        //             justifyContent: "center",
        //           },
        //         ]}
        //       >
        //         <Ionicons
        //           name="chatbubbles-outline"
        //           size={24}
        //           color={colors.primary}
        //         />
        //         <Text style={{ color: colors.primary }}>Chat</Text>
        //       </TouchableOpacity>
        //     </View>
        //   </View>
        // </BottomSheet>
        <></>
      )}
    </View>
  );
};

export default Tracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  backButton: {
    backgroundColor: "#0077B6",
    height: 45,
    width: 45,
    position: "absolute",
    left: 30,
    top: 100,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 80,
  },
  errorText: {
    fontSize: 16,
    color: colors.black2,
    textAlign: "center",
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  headerLeft: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  riderImageContainer: {
    position: "relative",
  },
  riderImage: {
    width: 54,
    height: 54,
    borderRadius: 9999,
  },
  verifiedIcon: {
    position: "absolute",
    right: -1,
    top: -1,
  },
  riderInfo: {
    marginLeft: 16,
    alignItems: "flex-start",
  },
  riderNameContainer: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "flex-start",
  },
  riderName: {
    fontSize: 16,
    color: "#344054",
    fontFamily: "bold",
  },
  riderBadge: {
    height: 22,
    width: 46,
    backgroundColor: "#F2C94C",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
  },
  riderBadgeText: {
    fontSize: 12,
    color: "#344054",
    fontFamily: "bold",
  },
  riderDetails: {
    fontSize: 14,
    color: "#344054",
    fontFamily: "medium",
    marginTop: 1,
  },
  riderDetailsContainer: {
    marginBottom: 16,
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
});
