import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Layout from "../../layouts/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPackage from "./components/PackageTracker";
import SendPackage from "./components/SendPackage";
import RecentOrders from "./components/RecentOrder";
import { useFetchOrders } from "../../services/fetchOrders";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setNotifications } from "store/reducers/app-reducer";
import { useFetchNotification } from "services/notificationSystem";

type paramsType = {
  setInputModal: Dispatch<SetStateAction<boolean>>;
  setTab: Dispatch<SetStateAction<string>>;
  location: string;
  tab: string;
};

const Home = ({ setInputModal, setTab, tab }: paramsType) => {
  const insets = useSafeAreaInsets();
  const { fetchOrders } = useFetchOrders();
  const { fetchNotification } = useFetchNotification();
  const isFocused = useIsFocused();
  const dispatch = useDispatch()
  
  useEffect(() => {
    (async () => {
      await fetchOrders();
    })();
  }, [tab, isFocused]);

  useEffect(() => {
    (async () => {
      const res = await fetchNotification(1)
      dispatch(setNotifications({page: 1, notification: res}));
    })()
  }, [tab, isFocused])

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
          {/* Notification */}
          {/* <TouchableOpacity
            onPress={() => setTab("notification")}
            style={styles.notificationContaner}
          >
            <NotificationIcon2 height={24} width={24} />
            
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
  notificationContaner: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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
  redDot: {
    position: "absolute",
    top: -2,
    right: 3,
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
});
export default Home;
