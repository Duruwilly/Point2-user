import React, { useEffect, useState } from "react";
import Tabs from "./Tabs";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Layout from "../../../layouts/layout";
import { colors } from "../../../constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScreenContext } from "../context/ScreenContext";
import EmptyBox from "../../../assets/icon/emptyBox.svg";
import Box from "../../../assets/icon/box.svg";
import { ApiRequest } from "../../../services/ApiNetwork";
import { Orders } from "../../../models/Orders";
import { Octicons, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type Pages = {
  data: Orders[];
  links: { first: string; last: string; prev: string; next: string };
  meta: {
    per_page: number;
    to: number;
    total: number;
    from: string;
    last_page: number;
    current_page: number;
  };
};

const ActivityList = () => {
  const insets = useSafeAreaInsets();
  const { selectedTab } = useScreenContext();
  const [orders, setOrders] = useState({} as Pages);
  const { request } = ApiRequest();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState({ state: false, page: 1, more: true });

  let queryStatus = "";
  if (selectedTab === "Delivered") {
    queryStatus = "DELIVERED";
  }

  if (selectedTab === "In Transit") {
    queryStatus = "INTRANSIT";
  }

  if (selectedTab === "Pending") {
    queryStatus = "PENDING";
  }

  if (selectedTab === "Accepted") {
    queryStatus = "ACCEPTED";
  }

  if (selectedTab === "Cancelled") {
    queryStatus = "CANCELLED";
  }

  const tabs = [
    {
      id: 1,
      title: "All",
      // quantity: 5,
      quantityColor: "#9333ea",
      textColor: "#FFFFFF",
    },
    {
      id: 2,
      title: "Pending",
      // quantity: 5,
      quantityColor: "#9333ea",
      textColor: "#FFFFFF",
    },
    {
      id: 3,
      title: "Accepted",
      // quantity: 5,
      quantityColor: "#9333ea",
      textColor: "#FFFFFF",
    },
    {
      id: 4,
      title: "In Transit",
      // quantity: 2,
      quantityColor: "#F2C94C",
      textColor: "#1D2939",
    },
    {
      id: 5,
      title: "Delivered",
      // quantity: 2,
      quantityColor: "#27AE60",
      textColor: "#FFFFFF",
    },
    {
      id: 6,
      title: "Cancelled",
      // quantity: 5,
      quantityColor: "#9333ea",
      textColor: "#FFFFFF",
    },
  ];

  const getorders = async (page: number) => {
    try {
      setLoading({ ...loading, state: true });
      setRefreshing(true);
      let url =
        selectedTab === "All"
          ? `/user/orders/getorders`
          : `/user/orders/getorders?status=${queryStatus}`;
      const response = await request("GET", {
        url,
        ignoreError: true,
      });
      // console.log("activity", response.data.data?.orders);

      if (response.status === "success") {
        setOrders(response?.data?.data?.orders);
        setLoading({
          page,
          state: false,
          more: orders?.data?.length < 10 ? false : true,
        });
      }
    } catch (error) {
      console.log("error fetchinr activities", error);
      setLoading({ ...loading, state: false });
    } finally {
      setLoading({ ...loading, state: false });
      setRefreshing(false);
    }
  };

  const handleRefreshing = async () => {
    try {
      setRefreshing(true);
      await getorders(loading.page);
    } catch (error) {}
    setRefreshing(false);
  };

  const getMore = () => {
    if (orders.links.next != null) {
      setLoading({ ...loading, state: true });
      getorders(loading.page + 1);
    }
  };

  useEffect(() => {
    getorders(loading.page);
  }, [queryStatus, selectedTab]);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Text style={[styles.headerText, { paddingTop: 20 }]}>Activity</Text>
        <View style={[styles.row, styles.container]}>
          <Tabs tabs={tabs} />
        </View>

        {loading.state ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0077B6" />
          </View>
        ) : orders?.data?.length > 0 ? (
          <Layout.FlatList
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            data={orders.data}
            renderItem={({ item }) => {
              return (
                <View style={styles.mainContent}>
                  {<ListData item={item} />}
                </View>
              );
            }}
            alwaysBounceVertical={false}
            onEndReached={getMore}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefreshing}
              />
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyBox}>
              <EmptyBox width={60} height={60} />
            </View>
            <Text style={styles.emptyText}>
              Start sending packages {"\n"}to see activity here
            </Text>
          </View>
        )}

        {/* {orders?.data?.length > 0 ? (
          <Layout.FlatList
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            data={orders.data}
            renderItem={({ item }) => {
              return (
                <View style={styles.mainContent}>
                  {<ListData item={item} />}
                </View>
              );
            }}
            alwaysBounceVertical={false}
            onEndReached={getMore}
            onEndReachedThreshold={0.1}
            keyExtractor={(item, index) => index.toString()}
              refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefreshing}
              />
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyBox}>
              <EmptyBox width={60} height={60} />
            </View>
            <Text style={styles.emptyText}>
              Start sending packages {"\n"}to see activity here
            </Text>
          </View>
        )} */}
      </Layout>
    </SafeAreaView>
  );
};

const ListData = ({ item }: { item: Orders }) => {
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
    <View key={item?.id} style={styles.orderContainer}>
      <View style={styles.orderDetailsContainer}>
        <Box />
        <View style={styles.orderDetails}>
          <Text style={styles.orderTitle}>{item?.package_name}</Text>
          <Text style={styles.orderTracking}>
            Tracking ID: {item?.tracking_id ?? "Unavailable"}
          </Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <Octicons name="dot-fill" size={20} color="#CCE4F0" />
        <View style={styles.locationDetails}>
          <Text style={styles.locationTitle}>From</Text>
          <Text style={styles.locationText}>{item?.pickup_location}</Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <Octicons name="dot-fill" size={20} color="#32D583" />
        <View style={styles.locationDetails}>
          <Text style={styles.locationTitle}>Shipped to</Text>
          <Text style={styles.locationText}>
            {item?.delivery_point_location}
          </Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusDetails}>
          <Text style={styles.statusText}>
            Status:{" "}
            {item?.status === "ASSIGNEDTORIDER"
              ? "Assigned To Rider"
              : item?.status === "PENDING"
              ? "Pending"
              : item?.status === "INTRANSIT"
              ? "In-Transit"
              : item?.status === "DELIVERED"
              ? "Delivered"
              : item?.status === "ACCEPTED"
              ? "Accepted"
              : item?.status === "CANCELLED" && "Cancelled"}
          </Text>
          <View style={styles.statusIcon}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={
                item?.status === "DELIVERED"
                  ? "#32D583"
                  : item?.status === "CANCELLED"
                  ? "#EB5757"
                  : item?.status === "ASSIGNEDTORIDER"
                  ? "#32D583"
                  : item?.status === "PENDING"
                  ? "#F2994A"
                  : "#F2994A"
              }
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

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  container: {
    width: "100%",
    marginTop: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  scrollViewContent: {
    // Additional styling if needed
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 9999,
    marginHorizontal: 7,
  },
  activeTab: {
    opacity: 1,
  },
  inactiveTab: {
    opacity: 0.4,
  },
  tabText: {
    fontSize: 14,
    color: "#344054",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 9999,
    marginLeft: 6,
  },
  quantityText: {
    fontSize: 12,
  },
  mainContent: {
    position: "relative",
    paddingVertical: 2,
    // paddingHorizontal: 20
  },
  txt: {
    // paddingHorizontal: 20,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    // height: '70vh',
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 176,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f4fbff",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    color: "#1D2939",
    marginTop: 5,
    fontFamily: "medium",
  },
  orderContainer: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    marginTop: 5,
    padding: 16,
  },
  orderDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  orderDetails: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: 14,
  },
  orderTitle: {
    fontSize: 14,
    color: "#344054",
    fontFamily: "bold",
  },
  orderTracking: {
    fontSize: 14,
    color: "#1D2939",
    fontFamily: "regular",
    paddingTop: 6,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  locationDetails: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: 10,
  },
  locationTitle: {
    fontSize: 12,
    color: "#475467",
    fontFamily: "medium",
  },
  locationText: {
    fontSize: 14,
    color: "#344054",
    fontFamily: "bold",
    paddingTop: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 32,
    paddingBottom: 2,
  },
  statusDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  statusText: {
    fontSize: 14,
    color: "#344054",
    fontFamily: "bold",
  },
  statusIcon: {
    marginLeft: 1,
  },
  viewDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  viewDetailsText: {
    fontSize: 14,
    color: "#0077B6",
    fontFamily: "bold",
  },
});

export default ActivityList;
