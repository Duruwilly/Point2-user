import { useCallback, useEffect, useState } from "react";
// import { expo as appName } from './app.json';
import { Alert, Image, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { useCustomFonts } from "./constants/fonts-config";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiRequest } from "./services/ApiNetwork";
import * as Updates from "expo-updates";
import {
  clearErrors,
  clearMessages,
  setUserOrders,
} from "./store/reducers/app-reducer";
import {
  setAccessToken,
  setExpoPushToken,
  setIsAuthentication,
  setLocation,
  setUser,
} from "./store/reducers/users-reducer";
import { RootState } from "./store/store";
import { configurePushNotifications } from "./services/Notification";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./utils/helpers";
import { authNavigation } from "./navigations/auth-navigation";
import { Tab } from "./navigations/tab-navigation";
import { nonTabsNavigation } from "./navigations/non-tabs-navigation";
import { getUserLocation } from "./services/LocationUtil";
import { CLUSTER_NAME, PUSHER_API_KEY } from "./constants/app";
import Pusher from "pusher-js";

export default function Index() {
  useCustomFonts();
  const [appIsReady, setAppIsReady] = useState(false);
  const [retry, setRetry] = useState(false);
  const App = useSelector((state: RootState) => state.appReducer);

  const [fetchedUser, setFetchedUser] = useState(false);
  const [accessTokenIsSet, setAccessTokenIsSet] = useState(false);

  const { isAuthenticated, auth_Id, access_token } = useSelector(
    (state: RootState) => state.user
  );
  // console.log("token",access_token);

  const dispatch = useDispatch();

  const retryFailedRequest = async () => {
    try {
      // Call the request function again to handle the retry logic for network error
      const response = await request("GET", {
        url: `/profile/details`,
        ignoreError: true,
      });
      if (response.status === "success") {
        dispatch(setUser(response.data.data));
        setFetchedUser(true);
        setRetry(!retry);
      } else {
        setRetry(!retry);
        setFetchedUser(true);
      }
      // Handle the successful retry
    } catch (retryError: any) {}
  };

  const { request } = ApiRequest(retryFailedRequest);
  const fetchUser = useCallback(async () => {
    if (accessTokenIsSet) {
      const response = await request("GET", {
        url: "/profile/details",
      });
      // console.log("user", response);

      if (response.status === "success") {
        dispatch(setUser(response.data.data));
        dispatch(setIsAuthentication(true));
        // dispatch(setAccessToken(response.data.access_token));
        setFetchedUser(true);
      } else {
        // console.log("here");
        setFetchedUser(true);
      }
    }
    // setFetchedUser(true); // remove later if api is provided
  }, [accessTokenIsSet]);

  const getUserOrders = useCallback(async () => {
    if (fetchedUser) {
      const response = await request("GET", {
        url: `/user/orders/getorders`,
      });

      if (response.status === "success") {
        dispatch(setUserOrders(response?.data?.data?.orders?.data));
        setAppIsReady(true);
      }
      setAppIsReady(true);
    }
  }, [fetchedUser, retry]);

  // ask for notification permission
  useEffect(() => {
    (async () => {
      // if (!__DEV__) {
        const response = await configurePushNotifications();
        dispatch(setExpoPushToken(response));
      // }
    })();
  }, []);

  useEffect(() => {
    if (appIsReady) {
        (async () => {
            try {
                const location = await getUserLocation();
                dispatch(setLocation(location))
                // console.log('User location:', location);
            } catch (error) {
                console.error('Error:', error);
            }
        })()
    }
}, [appIsReady]);

  useEffect(() => {
    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    };

    if (appIsReady) {
      hideSplashScreen();
    }
  }, [appIsReady]);

  useEffect(() => {
    if (accessTokenIsSet) {
      fetchUser();
    }
  }, [accessTokenIsSet]);

  useEffect(() => {
    if (fetchedUser) {
      getUserOrders();
    }
  }, [fetchedUser, retry]);

  useEffect(() => {
    AsyncStorage.getItem("access_token").then((data: any) => {
      dispatch(setAccessToken(data ?? ""));
      setAccessTokenIsSet(true);
    });
  }, []);

  useEffect(() => {
    if (App.errors.length > 0) {
      Alert.alert("Error!", App.errors.join("\n"), [
        {
          text: "Close",
          style: "cancel",
          onPress: () => dispatch(clearErrors()),
        },
      ]);
    }
  }, [App.errors]);

  useEffect(() => {
    if (App.messages.length > 0) {
      Alert.alert("VTpass!", App.messages.join("\n"), [
        {
          text: "Close",
          style: "cancel",
          onPress: () => dispatch(clearMessages()),
        },
      ]);
    }
  }, [App.messages]);

  useEffect(() => {
    (async () => {
      try {
        const pusher = new Pusher(PUSHER_API_KEY, {
          cluster: CLUSTER_NAME,
        });

        const channel = pusher.subscribe("message");
        channel.bind(`message_received${auth_Id}`, (event: any) => {
          console.log("pusher event", event);
          const eventData = JSON.parse(event.data);

          const { data, type } = eventData.data;
          console.log(JSON.stringify(data, null, 1), data);
        });

        pusher.connect();

        return () => {
          channel.unbind(`message_received${auth_Id}`);
          pusher.unsubscribe("message");
          pusher.disconnect();
        };
      } catch (e) {
        console.log(`ERROR: ${e}`);
      }
    })();
  }, [auth_Id]);

  useEffect(() => {
    // Function to check for updates and reload the app
    async function checkForUpdateAndReload() {
      if (!__DEV__) {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.reloadAsync();
        }
      }
    }
    checkForUpdateAndReload();
  }, []);

  useEffect(() => {
    if (!appIsReady) {
      const timer = setTimeout(() => {
        alert("This is taking longer than usual but kindly be patient");
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [appIsReady]);

  const Stack = createNativeStackNavigator();

  if (!appIsReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Image
          source={require("./assets/images/splashScreen.png")}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer ref={navigationRef as any}>
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            animation: "slide_from_right",
          }}
        >
          {!isAuthenticated &&
            authNavigation.map((route) => {
              return (
                <Stack.Screen
                  key={route.name}
                  name={route.name}
                  options={route.options}
                  component={route.component}
                />
              );
            })}
          <Stack.Screen
            name="tab"
            options={{ headerShown: false }}
            component={Tab}
          />
          {nonTabsNavigation.map((route) => {
            return (
              <Stack.Screen
                key={route.name}
                name={route.name}
                options={route.options}
                component={route.component}
              />
            );
          })}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

// AppRegistry.registerComponent(appName.name, () => Index);
