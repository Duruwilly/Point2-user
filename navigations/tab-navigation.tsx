import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import Home from "../screens/Home";
import HomeIcon from "../assets/icon/home.svg";
import HomeIcon2 from "../assets/icon/home2.svg";
import ActivityIcon from "../assets/icon/activity.svg";
import ActivityIcon2 from "../assets/icon/activity2.svg";
import NotificationIcon from "../assets/icon/notification.svg";
import NotificationIcon2 from "../assets/icon/notification2.svg";
import ProfileIcon from "../assets/icon/profile.svg";
import ProfileIcon2 from "../assets/icon/profile2.svg";
import { Ionicons, AntDesign, Fontisto } from "@expo/vector-icons";
import CloseModal from "../components/bottom-modal/CloseModal";
import NotificationsPage from "../screens/Notifications";
import Activity from "../screens/Activity";
import { useNavigation } from "@react-navigation/native";
import ProfilePage from "../screens/Profile";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

export function Tab() {
  const { notifications} = useSelector((state: RootState) => state.appReducer);
  const [tab, setTab] = useState("home");
  const [inputModal, setInputModal] = useState(false);
  const [deleteCard, setDeleteCard] = useState(false);
  const [location, setLocation] = useState("");
  const [hasUnRead, setHasUnread] = useState(false)
  const navigation: any = useNavigation()

  const handleTab = (active: string) => {
    setTab(active);
  };

  const checkUnreadNotifications = () => {
    return notifications?.data?.some(notification => notification.status === "UNREAD");
  };

  useEffect(() => {
    if(notifications?.data) {
      setHasUnread(checkUnreadNotifications());
    }
  }, [notifications?.data]);
  
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#EBF8FF" barStyle="dark-content" />
      <View style={styles.content}>
        {tab === "home" ? (
          <Home
            setInputModal={setInputModal}
            setTab={setTab}
            location={location}
            tab={tab}
          />
        ) : tab === "activity" ? (
          <Activity />
        ) : tab === "notification" ? (
          <NotificationsPage />
        ) : (
          tab === "profile" && (
            <ProfilePage />
          )
        )}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => handleTab("home")}
          style={styles.tabButton}
        >
          {tab === "home" ? (
            <HomeIcon height={24} width={24} />
          ) : (
            <HomeIcon2 height={24} width={24} />
          )}
          <Text
            style={[
              styles.tabText,
              { color: tab === "home" ? "#0077B6" : "#475467" },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTab("activity")}
          style={styles.tabButton}
        >
          {tab === "activity" ? (
            <ActivityIcon2 height={24} width={24} />
          ) : (
            <ActivityIcon height={24} width={24} />
          )}
          <Text
            style={[
              styles.tabText,
              { color: tab === "activity" ? "#0077B6" : "#475467" },
            ]}
          >
            Activity
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("create-order")}
          style={styles.packageButton}
        >
          <View style={styles.packageIconContainer}>
            <Ionicons name="add-outline" size={18} color="#CCE4F0" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTab("notification")}
          style={[styles.tabButton, {position: "relative"}]}
        >
          {tab === "notification" ? (
            <NotificationIcon2 height={24} width={24} />
          ) : (
            <NotificationIcon height={24} width={24} />
          )}
          <Text
            style={[
              styles.tabText,
              { color: tab === "notification" ? "#0077B6" : "#475467" },
            ]}
          >
            Notification
          </Text>
          {hasUnRead && <View style={styles.redDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleTab("profile")}
          style={styles.tabButton}
        >
          {tab === "profile" ? (
            <ProfileIcon2 height={24} width={24} />
          ) : (
            <ProfileIcon height={24} width={24} />
          )}
          <Text
            style={[
              styles.tabText,
              { color: tab === "profile" ? "#0077B6" : "#475467" },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {inputModal && (
        <Pressable
          onPress={() => setInputModal(false)}
          style={styles.overlay}
        />
      )}

      {deleteCard && (
        <Pressable
          onPress={() => setDeleteCard(false)}
          style={styles.overlay}
        />
      )}

      {deleteCard && <CloseModal setDeleteCard={setDeleteCard} />}

      {inputModal && (
        <View style={styles.inputModal}>
          <View style={styles.inputModalHeader}>
            <Text style={styles.inputModalTitle}>Input your address below</Text>
            <AntDesign
              onPress={() => setInputModal(false)}
              name="closecircleo"
              size={24}
              color="#475467"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                location ? styles.inputActive : styles.inputInActive,
              ]}
              placeholder="street no, b/stop"
              placeholderTextColor="#667085"
              value={location}
              onChangeText={(text) => setLocation(text)}
            />
            <View style={styles.inputIcon}>
              <Fontisto
                name="search"
                size={20}
                color={location ? "#0077B6" : "#98A2B3"}
              />
            </View>
          </View>

          <Text style={styles.inputHint}>
            Kindly enter the most accurate address to find you
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    backgroundColor: "white",
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "white",
    paddingTop: 4,
    paddingBottom: 12,
    shadowColor: "#475467",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "20%",
  },
  tabText: {
    fontSize: 12,
    fontFamily: "regular",
    marginTop: 2,
  },
  packageButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 55,
    width: 55,
    borderRadius: 9999,
    backgroundColor: "#CCE4F0",
    padding: 3,
    marginBottom: 36,
  },
  packageIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    borderRadius: 9999,
    backgroundColor: "#0077B6",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#A4A4A4",
    opacity: 0.6,
  },
  inputModal: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "83%",
    backgroundColor: "white",
    zIndex: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#475467",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    paddingTop: 6,
    paddingHorizontal: 20,
  },
  inputModalHeader: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  inputModalTitle: {
    fontSize: 16,
    color: "#1D2939",
    fontFamily: "medium",
  },
  inputContainer: {
    position: "relative",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 5,
  },
  input: {
    marginTop: 3,
    // borderWidth: 1,
    // borderColor: "#D0D5DD",
    borderRadius: 10,
    height: 48,
    width: "100%",
    fontSize: 14,
    fontFamily: "regular",
    color: "#1D2939",
    paddingLeft: 40,
  },
  inputActive: {
    borderColor: "#0077B6",
    // borderRadius: 10,
    borderWidth: 1,
  },
  inputInActive: {
    borderWidth: 1,
    // borderRadius: 10,
    borderColor: "#D0D5DD",
  },
  inputIcon: {
    position: "absolute",
    bottom: 13,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  inputHint: {
    fontSize: 14,
    textAlign: "left",
    width: "100%",
    marginTop: 3,
    color: "#475467",
    fontFamily: "regular",
  },
  redDot: {
    position: 'absolute',
    top: -2,
    right: 30,
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});
