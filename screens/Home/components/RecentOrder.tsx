import React, { Dispatch, SetStateAction, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons, Octicons, MaterialIcons } from "@expo/vector-icons";
import EmptyBox from "../../../assets/icon/emptyBox.svg";
import Box from "../../../assets/icon/box.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Orders } from "../../../models/Orders";
import { ApiRequest } from "services/ApiNetwork";
import { useNavigation } from "@react-navigation/native";
import { copyToClipboard } from "utils/helpers";
import Copy from "../../../assets/icon/copy.svg";

const RecentOrders = ({
  setTab,
}: {
  setTab: Dispatch<SetStateAction<string>>;
}) => {
  const { orders } = useSelector((state: RootState) => state.appReducer);

  const data = orders?.slice(0, 2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Recent Orders</Text>
        <TouchableOpacity onPress={() => setTab("activity")}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>

      {/* {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0077B6" />
        </View>
      )} */}

      {data.length === 0 && (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyBoxContainer}>
            <EmptyBox width={150} height={150} />
          </View>
          <Text style={styles.emptyText}>
            Start sending packages {"\n"}to see activity here
          </Text>
        </View>
      )}

      {orders.length > 0 &&
        data.map((item: Orders, index: number) => (
          <OrdersList key={item.id} item={item} />
        ))}
    </View>
  );
};

const OrdersList = ({ item }: { item: Orders }) => {
  const { request } = ApiRequest();
  const navigation: any = useNavigation();

  const handleSingleItem = async (item: Orders) => {
    const itemId = item?.id;

    const response = await request("GET", {
      url: `/user/orders/getorders?id=${itemId}`,
    });
    const { data, status } = response;

    if (status === "success") {
      navigation.navigate("order-details", { data: data.data });
    }
    // navigation.navigate("order-details");
  };

  return (
    <View key={item.id} style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <Box />
        <View style={styles.orderInfo}>
          <Text style={styles.packageName}>{item.package_name}</Text>
          <View style={styles.trackingInfo}>
            <Text style={styles.trackingId}>
              Tracking ID: {item.tracking_id ?? "Unavailable"}
            </Text>
            {item.status !== "DELIVERED" && (
              <TouchableOpacity
                onPress={() =>
                  copyToClipboard(item?.tracking_id ? item?.tracking_id : "")
                }
                style={styles.copyButton}
              >
                <Copy />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <View style={styles.orderDetail}>
        <Octicons name="dot-fill" size={20} color="#CCE4F0" />
        <View style={styles.orderDetailText}>
          <Text style={styles.detailLabel}>From</Text>
          <Text style={styles.detailValue}>{item.pickup_location}</Text>
        </View>
      </View>

      <View style={styles.orderDetail}>
        <Octicons name="dot-fill" size={20} color="#32D583" />
        <View style={styles.orderDetailText}>
          <Text style={styles.detailLabel}>Shipped to</Text>
          <Text style={styles.detailValue}>{item.delivery_point_location}</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusDetails}>
          <Text style={styles.statusText}>
            Status: {getStatus(item.status)}
          </Text>
          <View style={styles.statusIcon}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={getStatusColor(item.status)}
            />
          </View>
        </View>
        <Pressable
          onPress={() => handleSingleItem(item)}
          style={styles.viewDetails}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
          <MaterialIcons name="arrow-forward-ios" size={12} color="#0077B6" />
        </Pressable>
      </View>
    </View>
  );
};

const getStatus = (status: string) => {
  switch (status) {
    case "ASSIGNEDTORIDER":
      return "Assigned To Rider";
    case "PENDING":
      return "Pending";
    case "INTRANSIT":
      return "In-Transit";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    case "ACCEPTED":
      return "Accepted";
    default:
      return "Unknown";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "#32D583";
    case "CANCELLED":
      return "#EB5757";
    case "ASSIGNEDTORIDER":
      return "#F2994A";
    case "INTRANSIT":
      return "#F2994A";
    case "PENDING":
      return "#F2994A";
    case "ACCEPTED":
      return "#F2994A";
    default:
      return "#000";
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  headerText: {
    fontSize: 14,
    color: "#1D2939",
    fontWeight: "500",
  },
  viewAllText: {
    fontSize: 14,
    color: "#0077B6",
    fontWeight: "500",
  },
  loadingContainer: {
    marginTop: 36,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 60,
  },
  emptyBoxContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "#f4fbff",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    color: "#1D2939",
    // fontWeight: "500",
    marginTop: 30,
  },
  orderContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#F3FBFF",
    marginTop: 20,
    padding: 16,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  orderInfo: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: 16,
  },
  packageName: {
    fontSize: 14,
    color: "#344054",
    fontWeight: "bold",
  },
  trackingInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  trackingId: {
    fontSize: 12,
    color: "#1D2939",
    fontWeight: "400",
    paddingTop: 6,
    flex: 1,
  },
  copyButton: {
    // marginLeft: 8,
  },
  orderDetail: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 20,
  },
  orderDetailText: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: 8,
    paddingTop: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: "#1D2939",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#344054",
    fontWeight: "bold",
    paddingTop: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 36,
    marginLeft: 36,
  },
  statusDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  statusText: {
    fontSize: 14,
    color: "#344054",
    fontWeight: "bold",
  },
  statusIcon: {
    marginLeft: 4,
  },
  viewDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  viewDetailsText: {
    fontSize: 14,
    color: "#0077B6",
    fontFamily: "bold",
  },
});

export default RecentOrders;
