import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../constants/colors";
import { Input } from "../../components/common/input";
import { SimpleLineIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { CountryPicker } from "react-native-country-codes-picker";
import { ApiRequest } from "../../services/ApiNetwork";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setAccessToken,
  setAuthId,
  setUser,
} from "../../store/reducers/users-reducer";
import { RootState } from "../../store/store";

type InputType = {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
};

const Register = () => {
  const { expoPushtoken } = useSelector((state: RootState) => state.user);
  const insets = useSafeAreaInsets();
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("" || "+234");
  const [loading, setLoading] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const { request } = ApiRequest();

  const navigation: any = useNavigation();

  const dispatch = useDispatch();

  const [userInput, setUserInput] = useState({} as InputType);

  const authRequest = async () => {
    // navigation.navigate("verify-otp", {
    //   email: userInput?.email,
    //   phone: userInput?.phone,
    //   name: userInput.firstname,
    //   type: "register",
    // });
    try {
      setLoading(true);
      if (
        // !userInput?.phone?.trim() ||
        !userInput?.password?.trim() ||
        // !userInput?.email?.trim() ||
        !userInput?.firstname?.trim() ||
        !userInput?.lastname?.trim() ||
        !userInput?.password_confirmation?.trim()
      ) {
        alert("All input fields are required");
      } else if (userInput?.password !== userInput?.password_confirmation) {
        alert("password must be the same with the confirmation password");
      } else {
        const response = await request("POST", {
          url: "/auth/register",
          payload: { ...userInput, device_token: expoPushtoken},
        });

        if (response.status === "success") {
          await AsyncStorage.setItem(
            "access_token",
            response.data.data.access_token
          );
          dispatch(setAccessToken(response?.data?.data?.access_token));
          dispatch(setAuthId(response?.data.data?.user_data?.id));
          dispatch(setUser(response.data.data.user_data));
          setUserInput(() => ({
            firstname: "",
            lastname: "",
            phone: "",
            email: "",
            password: "",
            password_confirmation: "",
          }));
          setLoading(false);
          navigation.navigate("verify-otp", {
            email: userInput?.email,
            phone: userInput?.phone,
            name: userInput.firstname,
            type: "register",
          });
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.ScrollView>
          <Text style={styles.headerText}>Create your account</Text>
          <View style={styles.accountContainer}>
            <Text style={styles.accountText}>Have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("login")}>
              <Text style={styles.registerText}>Login</Text>
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView>
            <View style={{ position: "relative" }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>
                  Email address or phone number
                </Text>
                {/* <Text style={{ color: colors.primary }}>*</Text> */}
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
                placeholder="Enter email or phone number"
                value={userInput.email}
                state={(text: string) => {
                  setUserInput((state) => ({ ...state, email: text }));
                  const emailRegex = /\S+@\S+\.\S+/;
                  if (emailRegex.test(text)) {
                    setIsEmail(true);
                  } else {
                    setIsEmail(false);
                  }
                }}
                style={{}}
                keyboard="email-address"
              />
            </View>
            {isEmail && (
              <View style={{ position: "relative", marginTop: 20 }}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelContent}>Phone number</Text>
                  <Text style={{ color: colors.primary }}>*</Text>
                </View>
                <Input
                  placeholder="90 0000 0000"
                  value={userInput.phone}
                  state={(text: string) =>
                    setUserInput((state) => ({ ...state, phone: text }))
                  }
                  style={styles.inputField}
                  keyboard="number-pad"
                />
                <TouchableOpacity
                  onPress={() => setShow(true)}
                  style={styles.countryCodeContainer}
                >
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                  <SimpleLineIcons
                    name="arrow-down"
                    size={12}
                    color="#667085"
                  />
                </TouchableOpacity>
              </View>
            )}

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>First Name</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="First Name"
                value={userInput.firstname}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, firstname: text }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Last Name</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                placeholder="Last Name"
                value={userInput.lastname}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, lastname: text }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Password</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                isPassword={true}
                placeholder="YUr123@"
                value={userInput.password}
                state={(text: string) =>
                  setUserInput((state) => ({ ...state, password: text }))
                }
              />
            </View>

            <View style={{ position: "relative", marginTop: 20 }}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelContent}>Confirm Password</Text>
                <Text style={{ color: colors.primary }}>*</Text>
              </View>
              <Input
                isPassword={true}
                placeholder="YUr123@"
                value={userInput.password_confirmation}
                state={(text: string) =>
                  setUserInput((state) => ({
                    ...state,
                    password_confirmation: text,
                  }))
                }
              />
            </View>

            <Button
              style={{ borderRadius: 10, padding: 3, marginTop: 40 }}
              labelStyle={{ fontWeight: "bold", flex: 1 }}
              buttonColor={colors.primary}
              mode="contained"
              textColor="white"
              onPress={authRequest}
              loading={loading}
              disabled={loading}
            >
              Create your account
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
    top: 42,
    left: 16,
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

export default Register;
