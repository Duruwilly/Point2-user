import React, { Dispatch, SetStateAction, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Button } from "react-native-paper";
import { colors } from "../../../constants/colors";
import { ApiRequest } from "../../../services/ApiNetwork";
import { BASE_URL } from "../../../constants/Base_urls";
import { useNavigation } from "@react-navigation/native";
import { numberFormat } from "utils/helpers";

const OrderSummary = ({setWebViewUrl, webViewUrl}: {setWebViewUrl: Dispatch<SetStateAction<string>>, webViewUrl: string}) => {
  const { orderCharges, orderResponse } = useSelector((state: RootState) => state.appReducer);
  const [loading, setLoading] = useState(false)
  const {request} = ApiRequest()
const navigation: any = useNavigation()
  // const values = {"order_id": orderResponse.id, "callback_url": BASE_URL} // USE THIS LATER

  const prices = [
    {
      id: 1,
      title: "Delivery fee",
      price: `N${orderCharges.delivery_fee}`,
    },
    {
      id: 2,
      title: `VAT (${orderCharges.vat_percentage}%)`,
      price: `N${orderCharges.vat}`,
    },
    {
      id: 3,
      title: "Discount",
      price: `N${orderCharges.discount}`,
    },
  ];

  // USE THIS LATER
  // const handleConfirm = async () => {
  //   try {
  //     setLoading(true)
  //       const response = await request("POST", {
  //           url: "/user/orders/order-checkout",
  //           payload: {...values}
  //       })
  //       console.log("confirm-order", response);
        
  //       if(response.status === "success") {
  //           setWebViewUrl(response.data.data.authorization_url)
  //           setLoading(false)
  //       }
  //   } catch (error) {
        
  //   }
  // }

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Schedule pick-up date</Text>
        <Calendar />
      </View> */}

      {/* Prices List */}
      <View style={styles.pricesContainer}>
        {/* {prices?.map((item) => (
          <View key={item?.id} style={styles.priceItem}>
            <Text style={styles.priceTitle}>{item?.title}</Text>
            <Text style={styles.price}>{item?.price}</Text>
          </View>
        ))} */}
        <View style={styles.priceItem}>
          <Text style={styles.priceTitle}>Delivery fee</Text>
          <Text style={styles.price}>{numberFormat(Number(orderCharges.delivery_fee))}</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={styles.priceTitle}>VAT({orderCharges.vat_percentage}%)</Text>
          <Text style={styles.price}>{numberFormat(Number(orderCharges.vat))}</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={styles.priceTitle}>Discount</Text>
          <Text style={styles.price}>{numberFormat(Number(orderCharges.discount))}</Text>
        </View>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>TOTAL</Text>
        <Text style={styles.totalAmount}>{numberFormat(Number(orderCharges?.amount_to_pay))}</Text>
      </View>

      {/* Error Message */}
      {/* {error ? <Text style={styles.errorText}>{error}</Text> : null} */}

      <Button
        style={{ borderRadius: 10, padding: 3, marginTop: 20 }}
        labelStyle={{ fontWeight: "bold", flex: 1 }}
        buttonColor={colors.primary}
        mode="contained"
        textColor="white"
        onPress={() => navigation.navigate("package-sent", {trackingId: orderResponse?.tracking_id})}
        disabled={loading}
        loading={loading}
      >
        Confirm Order
      </Button>

      {/* Terms and Conditions */}
      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By continuing, you agree to Point2
          <Text style={styles.termsHighlight}> Terms & Condition</Text>
          <Text style={styles.termsText}>
            {" "}
            and my package align with Point 2 Guidelines
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "flex-start",
    // width: "100%",
    // marginTop: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  headerText: {
    fontSize: 16,
    color: "#475467",
    fontWeight: "500",
  },
  pricesContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 32,
  },
  priceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  priceTitle: {
    fontSize: 16,
    color: "#475467",
    fontWeight: "500",
  },
  price: {
    fontSize: 16,
    color: "#1D2939",
    fontWeight: "500",
  },
  totalContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: "#F9FAFB",
  },
  totalText: {
    fontSize: 16,
    color: "#475467",
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 18,
    color: "#1D2939",
    fontWeight: "700",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    fontWeight: "500",
    width: "100%",
    textAlign: "left",
    marginTop: 24,
  },
  confirmButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#0077B6",
    marginTop: 12,
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 8,
  },
  termsContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
    marginTop: 44,
  },
  termsText: {
    fontSize: 12,
    color: "#98A2B3",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 20,
  },
  termsHighlight: {
    fontSize: 12,
    color: "#344054",
    fontWeight: "500",
    lineHeight: 20,
  },
});

export default OrderSummary;
