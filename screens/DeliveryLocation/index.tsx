import React, { useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Layout from "../../layouts/layout";
import { Input } from "../../components/common/input";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CountryPicker } from "react-native-country-codes-picker";
import BottomSheet from "../../components/Bottomsheet/Bottomsheet";
import GooglePlaceInput from "../../components/map-input";
import { Button } from "react-native-paper";

type InputType = {
  delivery_point_name: string;
  delivery_point_phone: string;
  landmark: string;
  delivery_point_email: string;
};

const DeliveryLocation = ({ navigation, route }: any) => {
  const [userInput, setUserInput] = useState({} as InputType);
  const insets = useSafeAreaInsets();
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("" || "+234");
  const [destination, setDestination] = useState<any>(null);
  const [radioBtnChecked, setRadioBtnChecked] = useState<number | null>(null);
  const { pickupDetails } = route.params;
// console.log("item in delivery location comp", pickupDetails);

  const bottomSheetRef: any = useRef(null);
  const snapPoints = useMemo(() => ["25%", "70%"], []);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const handlePlaceSelection = (details: any) => {
    // console.log("ab", JSON.stringify(details, null, 2));
    // console.log("cd", details.formatted_address);
    setDestination(details);
  };

  const closeBottomSheet = () => {
    setOpenBottomSheet(false);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  const handleSubmit = () => {
    const combinedData = {
      ...pickupDetails,
      ...userInput,
      // delivery_point_name: destination?.formatted_address,
      delivery_point_location: destination?.formatted_address,
      delivery_point_location_coordinate: [
        destination?.geometry?.location?.lat,
        destination?.geometry?.location?.lng,
      ],
    };
    navigation.navigate("create-order", { ...combinedData });
    // console.log(combinedData);
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.Header />
        <View style={{ padding: 20 }}>
          <Text style={styles.headerText}>Delivery Location</Text>
        </View>
        <Layout.ScrollView>
          <KeyboardAvoidingView>
            <View style={{ position: "relative" }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Receiver's Name</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="Enter Receiver's name"
                value={userInput.delivery_point_name}
                state={(text: string) =>
                  setUserInput((state) => ({
                    ...state,
                    delivery_point_name: text,
                  }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Receiver Phone number</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="90 0000 0000"
                value={userInput.delivery_point_phone}
                state={(text: string) =>
                  setUserInput((state) => ({
                    ...state,
                    delivery_point_phone: text,
                  }))
                }
                style={styles.inputField}
                keyboard="number-pad"
              />
              <TouchableOpacity
                onPress={() => setShow(true)}
                style={styles.countryCodeContainer}
              >
                <Text style={styles.countryCodeText}>{countryCode}</Text>
                <SimpleLineIcons name="arrow-down" size={12} color="#667085" />
              </TouchableOpacity>
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Email Address</Text>
                <Text style={{ color: colors.primary }}>(optional)</Text>
              </View>
              <Input
                hasIcon={true}
                Icon={
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={20}
                    color="#667085"
                  />
                }
                placeholder="example@gmail.com"
                value={userInput.delivery_point_email}
                state={(text: string) =>
                  setUserInput((state) => ({
                    ...state,
                    delivery_point_email: text,
                  }))
                }
                style={{ }}
                keyboard="email-address"
              />
              {/* <View style={styles.countryCodeContainer}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color="#667085"
                />
              </View> */}
            </View>

            <View style={{ marginTop: 12 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Receiver's Address</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <TouchableOpacity
                onPress={() => setOpenBottomSheet(true)}
                style={{
                  borderColor: colors.inputBorder,
                  borderRadius: 8,
                  borderWidth: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 20,
                }}
              >
                <Text style={{ color: "#667085", fontSize: 16 }}>
                  {destination
                    ? destination?.formatted_address
                    : "Search Address"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Landmark or B/stop</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="Enter b/stop (optional)"
                value={userInput.landmark}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, landmark: text }))
                }
              />
            </View>

            <Button
              style={{ borderRadius: 10, padding: 3, marginTop: 40 }}
              labelStyle={{ fontWeight: "bold", flex: 1 }}
              buttonColor={colors.primary}
              mode="contained"
              textColor="white"
              onPress={handleSubmit}
            >
              Save
            </Button>
          </KeyboardAvoidingView>
        </Layout.ScrollView>
      </Layout>

      <CountryPicker
        lang="en"
        onBackdropPress={() => setShow(false)}
        style={{
          modal: {
            height: 500,
          },
        }}
        show={show}
        pickerButtonOnPress={(item) => {
          setCountryCode(item.dial_code);
          setShow(false);
        }}
      />

      {openBottomSheet && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          style={{ padding: 0 }}
          onChange={(index) => {
            if (index === -1 || index === 0) {
              closeBottomSheet();
            }
          }}
        >
          <View style={{ marginTop: 20, flex: 1, paddingHorizontal: 20 }}>
            <GooglePlaceInput
              onSelectPlace={handlePlaceSelection}
              closeBottomSheet={setOpenBottomSheet}
            />
          </View>
        </BottomSheet>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
  },
  accountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 25,
  },
  accountText: {
    color: "#475467",
    fontSize: 15,
    fontWeight: "500",
  },
  registerText: {
    color: "#0077B6",
    fontSize: 15,
    fontWeight: "500",
  },
  selectionInput: {
    marginTop: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    height: 50,
  },
  labelContainer: {
    marginBottom: 7,
    flexDirection: "row",
  },
  labelContent: {
    fontWeight: "bold",
  },
  inputField: {
    paddingLeft: 60,
  },
  countryCodeContainer: {
    position: "absolute",
    top: 40,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  countryCodeText: {
    color: "#101828",
    fontSize: 16,
    marginRight: 1,
  },
});

export default DeliveryLocation;
