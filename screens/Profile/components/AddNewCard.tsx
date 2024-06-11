import React, { Dispatch, SetStateAction, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import { Input } from '../../../components/common/input'
import { colors } from '../../../constants/colors'
import { Button } from 'react-native-paper'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MasterCard from '../../../assets/icon/logos_mastercard.svg'

const AddNewCard = ({
    setPages,
  }: {
    setPages: Dispatch<SetStateAction<number>>;
  }) => {

    const [userInput, setUserInput] = useState({
        name: "",
        last_name: "",
        card_number: "",
        ccv_number: "",
        expiration_date: "",
        phone: "",
      });

  return (
    <KeyboardAvoidingView style={{}}>
    <View style={{ position: "relative" }}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelContent}>Card Holder's Name</Text>
      </View>
      <Input
        placeholder="enter name on card"
        value={userInput.name}
        state={(text: string) =>
          setUserInput((state) => ({ ...state, name: text }))
        }
      />
    </View>

    <View style={{ position: "relative", marginTop: 20 }}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelContent}>Card Number</Text>
        <Text style={{ color: colors.primary }}>*</Text>
      </View>
      <Input
        placeholder="3265 5956 23**"
        value={userInput.card_number}
        state={(text: string) =>
          setUserInput((state) => ({ ...state, card_number: text }))
        }
      />
      <View style={styles.countryCodeContainer}>
      <MasterCard />
      </View>
    </View>

    <View style={{flexDirection: "row", alignItems: "center", gap: 15, marginTop: 20}}>
    <View style={{ position: "relative", flex: 1 }}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelContent}>CCV</Text>
      </View>
      <Input
        placeholder="123"
        value={userInput.ccv_number}
        state={(text: string) =>
          setUserInput((state) => ({ ...state, ccv_number: text }))
        }
      />
    </View>
    <View style={{ position: "relative", flex: 1 }}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelContent}>Expiration</Text>
      </View>
      <Input
        placeholder="12/28"
        value={userInput.expiration_date}
        state={(text: string) =>
          setUserInput((state) => ({ ...state, expiration_date: text }))
        }
      />
    </View>
    </View>

    <Button
      style={{ borderRadius: 10, padding: 3, marginTop: 30 }}
      labelStyle={{ fontWeight: "bold", flex: 1 }}
      buttonColor={colors.primary}
      mode="contained"
      textColor="white"
    //   onPress={handleSubmit}
    >
      Save
    </Button>
  </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    headerText: {
      color: colors.darkGrey,
      fontWeight: "bold",
      fontSize: 24,
      //   textAlign: "center",
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      marginTop: 32,
    },
    inputContainer: {
      position: "relative",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      width: "100%",
      marginTop: 12,
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
    label: {
      fontSize: 14,
      color: "#101828",
      fontWeight: "bold",
      marginTop: 12,
    },
    input: {
      marginTop: 12,
      borderWidth: 1,
      borderColor: "#D0D5DD",
      borderRadius: 8,
      height: 48,
      width: "100%",
      fontSize: 16,
      fontWeight: "400",
      color: "#344054",
      paddingLeft: 20,
    },
    phoneInput: {
      paddingLeft: 87,
    },
    countryCodeContainer: {
      position: "absolute",
      top: 42,
      right: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    countryCodeText: {
      fontSize: 16,
      color: "#101828",
      fontWeight: "400",
      marginRight: 4,
    },
    emailInput: {
      paddingLeft: 56,
    },
    emailIconContainer: {
      position: "absolute",
      bottom: 13,
      left: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    buttonContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      marginTop: 48,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
      height: 48,
      width: "100%",
      borderRadius: 8,
      backgroundColor: "#0077B6",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#ffffff",
    },
  });

export default AddNewCard