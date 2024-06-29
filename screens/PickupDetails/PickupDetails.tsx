import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Layout from "../../layouts/layout";
import { colors } from "../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Input } from "../../components/common/input";
import { SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CountryPicker } from "react-native-country-codes-picker";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import GooglePlaceInput from "../../components/map-input";
import BottomSheet from "../../components/Bottomsheet/Bottomsheet";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import CustomRadioButton from "../../components/RadioButton/RadioButton";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
// import { GOOGLE_PLACES_API_KEY } from "constants/app";
import { useGeoCodingLocation } from "services/geoCoding";
import AsyncStorage from "@react-native-async-storage/async-storage";

type InputType = {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  pickup_location: string;
  package_name: string;
  package_category: string;
  landmark: string;
  pickup_location_coordinate: number[];
};

const PickupDetails = () => {
  const insets = useSafeAreaInsets();
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("" || "+234");
  const { user, location } = useSelector((state: RootState) => state.user);
  const [origin, setOrigin] = useState<any>(null);
  const [selectedOption, setSelelctedOption] = useState("");
  const [bottomSheetInputToOpen, setBottomSheetInputToOpen] = useState("");
  const [storedLocation, setStoredLocation] = useState<string | null>(null);
  const navigation: any = useNavigation();
  const { getGeocodingData } = useGeoCodingLocation();

  const bottomSheetRef: any = useRef(null);
  const snapPoints = useMemo(() => ["25%", "70%"], []);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const [radioBtnChecked, setRadioBtnChecked] = useState<number | null>(null);

  const closeBottomSheet = () => {
    setOpenBottomSheet(false);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  const userSelection = (data: any) => {
    if (bottomSheetInputToOpen == "category") {
      setUserInput({ ...userInput, package_category: data });
      setRadioBtnChecked(null);
    } else {
      // setUserInput({ ...userInput, category: data.key });
      setRadioBtnChecked(null);
    }
    setOpenBottomSheet(false);
  };

  const setBottomSheetFn = (item: string, index: number) => {
    if (radioBtnChecked !== index) {
      setRadioBtnChecked(index);
      userSelection(item);
    } else {
      setRadioBtnChecked(null);
      userSelection("");
    }
  };

  const openBottomSheetFn = (str: string) => {
    setBottomSheetInputToOpen(str);
    setOpenBottomSheet(true);
  };

  const [userInput, setUserInput] = useState({
    customer_email: user?.email || "",
    customer_name: user?.first_name || "",
    customer_phone: user?.phone || "",
    pickup_location: "",
    pickup_location_coordinate: [location?.latitude, location?.longitude],
    package_name: "",
    landmark: "",
    package_category: "",
  } as InputType);

  const handlePlaceSelection = async (details: any) => {
    // console.log("ab", JSON.stringify(details, null, 2));
    // console.log("cd", details.formatted_address);
    setOrigin(details);
    setUserInput({
      ...userInput,
      pickup_location: details?.formatted_address,
      pickup_location_coordinate: [
        details?.geometry?.location?.lat,
        details?.geometry?.location?.lng,
      ],
    });
    await AsyncStorage.setItem(
      "prev_selected_address",
      details?.formatted_address
    );
  };

  const options = [
    {
      id: 1,
      name: "Computer Accesories",
    },
    {
      id: 2,
      name: "Documents",
    },
    {
      id: 3,
      name: "Electronics",
    },
    {
      id: 4,
      name: "Food",
    },
    {
      id: 5,
      name: "Others",
    },
  ];

  const handleSubmit = () => {
    const combinedData = {
      ...userInput,
      // pickup_location: origin?.formatted_address,
      // pickup_location_coordinate: [
      //   origin?.geometry?.location?.lat,
      //   origin?.geometry?.location?.lng,
      // ],
    };
    // console.log("item in pick up detail comp", combinedData);

    navigation.navigate("create-order", { pickupDetails: combinedData });
    // console.log(combinedData);
  };

  // useEffect(() => {
  //   (async () => {
  //     let res = await getGeocodingData();
  //     setUserInput({ ...userInput, pickup_location: "24 ave, 2024 area" });
  //   })();
  // }, []);

  useEffect(() => {
    const loadStoredLocation = async () => {
      let storedLocation = await AsyncStorage.getItem('prev_selected_address');
      if (storedLocation) {
        setStoredLocation(storedLocation);
        setUserInput((prev) => ({
          ...prev,
          pickup_location: storedLocation,
        }));
      } else {
        let res = await getGeocodingData();
        setUserInput((prev) => ({
          ...prev,
          pickup_location: res,
        }));
        await AsyncStorage.setItem(
          "prev_selected_address",
          res
        );
      }
    };

    loadStoredLocation();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.Header />
        <View style={{ padding: 20 }}>
          <Text style={styles.headerText}>Pickup details</Text>
        </View>
        <Layout.ScrollView>
          <KeyboardAvoidingView>
            <View style={{ position: "relative" }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Customer Name</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="First Name"
                value={userInput.customer_name}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, customer_name: text }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Phone Number</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="90 0000 0000"
                value={userInput.customer_phone}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, customer_phone: text }))
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
                <Text style={{ color: colors.primary }}>*</Text>
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
                value={userInput.customer_email}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, customer_email: text }))
                }
                style={{}}
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
            {/* 
            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Pickup address</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <GooglePlaceInput onSelectPlace={handlePlaceSelection} />
            </View> */}
            <View style={{ marginTop: 12 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Pickup Address</Text>
                <Text style={{ color: colors.primary }}>*</Text>
                <TouchableOpacity style={{marginLeft: 5}}>
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: 15,
                    }}
                  >
                    use previous location?
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => openBottomSheetFn("places-search")}
                style={{
                  borderColor: colors.inputBorder,
                  borderRadius: 8,
                  borderWidth: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 20,
                }}
              >
                <Text style={{ color: "#667085", fontSize: 16 }}>
                  {userInput?.pickup_location
                    ? userInput?.pickup_location
                    : "Search"}
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

            <Text
              style={{
                fontSize: 18,
                color: "#0077B6",
                fontWeight: "bold",
                marginTop: 16,
                marginBottom: 20,
              }}
            >
              Item details
            </Text>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Item Name</Text>
              </View>
              <Input
                placeholder="Item Name"
                value={userInput.package_name}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, package_name: text }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Item Category</Text>
              </View>
              <TouchableOpacity
                onPress={() => openBottomSheetFn("category")}
                style={[
                  styles.selectionInput,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  },
                ]}
              >
                <Text style={{ color: "#667085", fontSize: 16 }}>
                  {userInput.package_category === ""
                    ? "Select Category"
                    : userInput.package_category}
                </Text>
                <TouchableOpacity onPress={() => openBottomSheetFn("category")}>
                  {openBottomSheet ? (
                    <SimpleLineIcons
                      name="arrow-up"
                      size={14}
                      color="#667085"
                    />
                  ) : (
                    <SimpleLineIcons
                      name="arrow-down"
                      size={14}
                      color="#667085"
                    />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            </View>

            {/* <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <View style={{ position: "relative", flex: 1, marginTop: 20 }}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelContent}>Quantity</Text>
                </View>
                <Input
                  keyboard="number-pad"
                  placeholder="Quantity"
                  value={userInput.customer_name}
                  state={(text: string) =>
                    setUserInput((state) => ({ ...state, customer_name: text }))
                  }
                />
              </View>
              <View style={{ position: "relative", flex: 1, marginTop: 20 }}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelContent}>Value</Text>
                </View>
                <Input
                  placeholder="Value (N)"
                  value={userInput.customer_name}
                  state={(text: string) =>
                    setUserInput((state) => ({ ...state, customer_name: text }))
                  }
                />
              </View>
            </View> */}
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
          {bottomSheetInputToOpen === "category" ? (
            <BottomSheetFlatList
              style={{ marginHorizontal: 10 }}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              data={options}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setBottomSheetFn(item?.name, index);
                      setOpenBottomSheet(false);
                    }}
                    style={{
                      marginBottom: 5,
                      paddingVertical: 25,
                      paddingHorizontal: 15,
                      backgroundColor: "#f6f6f6",
                      borderWidth: 1,
                      borderColor: "#ededed",
                      borderRadius: 8,
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 20,
                      }}
                    >
                      <Text
                        style={{ fontWeight: "400", fontSize: 13, flex: 1 }}
                      >
                        {item.name}
                      </Text>
                      <CustomRadioButton
                        value={index}
                        selected={radioBtnChecked === index}
                        onSelect={() => {
                          setBottomSheetFn(item?.name, index);
                          setOpenBottomSheet(false);
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
              alwaysBounceVertical={false}
            />
          ) : (
            <View style={{ marginTop: 20, flex: 1, paddingHorizontal: 20 }}>
              <GooglePlaceInput
                onSelectPlace={handlePlaceSelection}
                closeBottomSheet={setOpenBottomSheet}
              />
            </View>
          )}
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

export default PickupDetails;
