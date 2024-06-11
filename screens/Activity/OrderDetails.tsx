import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import Box from "../../assets/icon/box3.svg";
import Line from "../../assets/icon/line.svg";
import Copy from "../../assets/icon/copy.svg";
import { Ionicons, Feather, Octicons } from "@expo/vector-icons";
import { copyToClipboard, numberFormat } from "../../utils/helpers";
import { Button } from "react-native-paper";

const OrderDetails = ({ route, navigation }: any) => {
  const data = route?.params?.data;
  const insets = useSafeAreaInsets();

  //   const copyToClipboard = () => {
  //     copyToClipboard(data.package_name);
  //   };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.Header />
        <Layout.ScrollView>
          <Text style={styles.headerText}>Package Details</Text>
          <View style={styles.productContainer}>
            <View style={styles.iconContainer}>
              <Box />
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.packageName}>{data?.package_name}</Text>
              <View style={styles.trackingInfo}>
                <Text style={[styles.trackingId, { flex: 1 }]}>
                  Tracking ID: {data?.tracking_id ?? "Unavailable"}
                </Text>
                {data?.status !== "DELIVERED" && (
                  <TouchableOpacity
                    onPress={() => copyToClipboard(data?.tracking_id)}
                    style={styles.copyButton}
                  >
                    <Copy />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View style={styles.productDetailsContainer}>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Recipient Name</Text>
              <Text style={styles.detailValue}>{data?.recepient_name}</Text>
            </View>
            {/* <View style={[styles.detailColumn, styles.detailColumnSpacing]}>
              <Text style={styles.detailLabel}>Package Weight</Text>
              <Text style={styles.detailValue}>30 KG</Text>
            </View> */}
          </View>

          <View style={styles.productDetailsContainer}>
            {/* <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Expected Delivery Time</Text>
              <Text style={styles.detailValue}>{data?.pickup_time}</Text>
            </View> */}
            <View style={[styles.detailColumn, styles.detailColumnSpacing]}>
              <Text style={styles.detailLabel}>Amount Paid (N)</Text>
              <Text style={styles.detailValue}>
                {numberFormat(Number(data?.amount))}
              </Text>
            </View>
          </View>

          <View style={styles.deliveryContainer}>
            <View style={styles.deliveryRow}>
              <Octicons name="dot-fill" size={20} color="#CCE4F0" />
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryLabel}>From</Text>
                <Text style={styles.deliveryValue}>
                  {data?.pickup_location}
                </Text>
              </View>
            </View>
            <View style={[styles.deliveryRow, styles.deliveryRowSpacing]}>
              <Octicons name="dot-fill" size={20} color="#32D583" />
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryLabel}>Shipped to</Text>
                <Text style={styles.deliveryValue}>
                  {data?.delivery_point_location}
                </Text>
              </View>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusText}>
                Status:{" "}
                {data?.status === "ASSIGNEDTORIDER"
                  ? "Assigned To Rider"
                  : data?.status === "PENDING"
                  ? "Pending"
                  : data?.status === "INTRANSIT"
                  ? "In-Transit"
                  : data?.status === "DELIVERED"
                  ? "Delivered"
                  : data?.status === "ACCEPTED"
                  ? "Accepted"
                  : data?.status === "CANCELLED" && "Cancelled"}
              </Text>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={
                  data?.status === "DELIVERED"
                    ? "#32D583"
                    : data?.status === "CANCELLED"
                    ? "#EB5757"
                    : data?.status === "ASSIGNEDTORIDER"
                    ? "#32D583"
                    : data?.status === "PENDING"
                    ? "#F2994A"
                    : "#F2994A"
                }
              />
            </View>
          </View>

          {data?.status === "INTRANSIT" && (
            <View style={styles.productStatusesContainer}>
              {/* PICKED UP */}
              <View style={styles.statusDetailRow}>
                <View style={styles.statusIcon}>
                  <Octicons name="dot-fill" size={18} color="#0077B6" />
                  <Line />
                </View>
                <View style={styles.statusDetail}>
                  <Text style={styles.statusTitle}>Picked Up</Text>
                  <Text style={styles.statusSubTitle}>
                    {data?.pickup_location}
                  </Text>
                </View>
              </View>
              {/* CONFIRMATION CODE */}
              <View style={styles.statusDetailRow}>
                <View style={styles.statusIcon}>
                  <Octicons name="dot-fill" size={18} color="#0077B6" />
                  <Line />
                </View>
                <View style={styles.statusDetail}>
                  <Text style={styles.statusTitle}>
                    Confirmation Code Generated
                  </Text>
                  <View style={styles.confirmationCodeRow}>
                    <Text style={styles.confirmationCode}>
                      {data?.confirmation_code}
                    </Text>
                    <TouchableOpacity
                      onPress={() => copyToClipboard(data?.confirmation_code)}
                      style={styles.copyButton}
                    >
                      <Copy />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {/* IN TRANSIT */}
              <View style={styles.statusDetailRow}>
                <View style={styles.statusIcon}>
                  <Octicons name="dot-fill" size={18} color="#0077B6" />
                  <Line />
                </View>
                <View style={styles.statusDetail}>
                  <Text style={styles.statusTitle}>In Transit</Text>
                  {/* <Text style={styles.statusSubTitle}>
                  Package picked up by rider
                  <Text style={styles.riderId}> (KJA-884-RM)</Text>
                </Text> */}
                </View>
              </View>
              {/* DELIVERED */}
              <View style={styles.statusDetailRow}>
                <View style={styles.statusIcon}>
                  <Octicons name="dot-fill" size={18} color="#27AE60" />
                </View>
                <View style={styles.statusDetail}>
                  <Text style={styles.statusTitle}>
                    {data?.status === "INTRANSIT"
                      ? "Delivering to"
                      : data?.status === "COMPLETED" && "Delivered to"}
                  </Text>
                  <Text style={styles.statusSubTitle}>
                    {data?.delivery_point_location}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {/* BUTTON */}
          {data?.status !== "DELIVERED" && (
            <Button
              style={{ borderRadius: 10, padding: 3, marginTop: 40 }}
              labelStyle={{ fontWeight: "bold", flex: 1 }}
              buttonColor={colors.primary}
              mode="contained"
              textColor="white"
              onPress={() =>
                navigation.navigate("tracking", {
                  trackingId: data?.tracking_id,
                })
              }
            >
              Live Tracking
            </Button>
          )}
        </Layout.ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
    // textAlign: "center"
  },
  scrollViewContent: {
    width: "100%",
    paddingBottom: 70,
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    marginTop: 32,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EBF8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: {
    flex: 1,
    marginLeft: 20,
  },
  packageName: {
    fontSize: 14,
    color: "#344054",
    fontFamily: "bold",
  },
  trackingInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  trackingId: {
    fontSize: 14,
    color: "#1D2939",
    fontFamily: "regular",
  },
  copyButton: {
    marginLeft: 8,
  },
  productDetailsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    marginTop: 32,
  },
  detailColumn: {
    alignItems: "flex-start",
  },
  detailColumnSpacing: {
    // marginLeft: 48,
  },
  detailLabel: {
    fontSize: 12,
    color: "#475467",
    fontFamily: "medium",
  },
  detailValue: {
    fontSize: 14,
    color: "#344054",
    fontFamily: "bold",
    paddingTop: 4,
  },
  deliveryContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    marginTop: 20,
    padding: 16,
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
  },
  deliveryRowSpacing: {
    marginTop: 20,
  },
  deliveryInfo: {
    flex: 1,
    marginLeft: 8,
    paddingTop: 2,
  },
  deliveryLabel: {
    fontSize: 12,
    color: "#1D2939",
    fontFamily: "medium",
  },
  deliveryValue: {
    fontSize: 14,
    color: "#344054",
    fontFamily: "bold",
    paddingTop: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    paddingBottom: 8,
    paddingLeft: 20,
  },
  statusText: {
    fontSize: 14,
    color: "#344054",
    fontFamily: "bold",
  },
  productStatusesContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    marginTop: 24,
  },
  statusDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    marginTop: -12,
  },
  statusIcon: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: -12,
  },
  statusDetail: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 16,
  },
  statusTitle: {
    fontSize: 16,
    color: "#344054",
    fontFamily: "bold",
  },
  statusSubTitle: {
    fontSize: 14,
    color: "#475467",
    fontFamily: "regular",
  },
  riderId: {
    fontFamily: "medium",
  },
  confirmationCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  confirmationCode: {
    fontSize: 14,
    color: "#475467",
    fontFamily: "medium",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 56,
    width: "100%",
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
    color: "white",
    fontFamily: "bold",
  },
});

export default OrderDetails;
