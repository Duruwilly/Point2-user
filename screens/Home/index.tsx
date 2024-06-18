import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Location from "../../assets/icon/location.svg";
import TrackPackage from "./components/PackageTracker";
import SendPackage from "./components/SendPackage";
import RecentOrders from "./components/RecentOrder";
import { useFetchOrders } from "../../services/fetchOrders";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

type paramsType = {
  setInputModal: Dispatch<SetStateAction<boolean>>;
  setTab: Dispatch<SetStateAction<string>>;
  location: string;
  tab: string;
};

const Home = ({ setInputModal, setTab, location, tab }: paramsType) => {
  // const { location } = useSelector((state: RootState) => state.user);
  const insets = useSafeAreaInsets();
  const { fetchOrders } = useFetchOrders();
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      await fetchOrders();
    })();
  }, [tab, isFocused]);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <Layout>
        <Layout.ScrollView>
          {/* LOCATION */}
          {/* <TouchableOpacity
            onPress={() => setInputModal(true)}
            style={styles.locationContaner}
          >
            <TouchableOpacity
              onPress={() => setInputModal(true)}
              style={styles.locationIcon}
            >
              <Location width={20.6} height={26.12} />
            </TouchableOpacity>
            <View style={styles.locationTextContainer}>
              <Text
                style={{ fontSize: 14, color: "#475467", fontWeight: "400" }}
              >
                Locations
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#101828",
                  fontWeight: "bold",
                  paddingTop: 4,
                }}
              >
                {location === "" ? "Set Location" : location}
              </Text>
            </View>
          </TouchableOpacity> */}

          {/* Package tracker */}
          <TrackPackage />

          {/* send package */}
          <SendPackage />

          {/* resend orders */}
          <RecentOrders setTab={setTab} />
        </Layout.ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  locationContaner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    gap: 6,
  },
  locationIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    backgroundColor: "#EBF8FF",
    borderRadius: 8,
  },
  locationTextContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 3,
  },
});
export default Home;
