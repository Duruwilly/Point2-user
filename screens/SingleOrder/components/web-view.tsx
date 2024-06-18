import { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import { WebViewProgressEvent } from "react-native-webview/lib/WebViewTypes";
import { StatusBar } from "expo-status-bar";
import Layout from "../../../layouts/layout";
import { colors } from "../../../constants/colors";
import { useNavigation } from "@react-navigation/native";

export const RenderScreenWebView = ({ url, goBack }: { url: string, goBack: () => void }) => {
  const [progress, setProgress] = useState(0);
  const progressAnim = new Animated.Value(0);
  const navigation: any = useNavigation()

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const loadingIndicator = ({ nativeEvent }: WebViewProgressEvent) =>
    setProgress(nativeEvent.progress);
  return (
    <>
      <StatusBar style="dark" />
        <Layout.Header back={goBack} />
        <View style={{ position: "relative", flex: 1 }}>
          <WebView
            source={{ uri: `${url}` }}
            onLoadProgress={loadingIndicator}
            onNavigationStateChange={(state: any) => {
              // console.log("web-view", state);
              
              if (state.url.includes("trxref") || state.url.includes("reference")) {
                goBack();
                navigation.navigate("tab", { isReturn: true });
              }
              }}
          />
          <Animated.View
            style={[
              styles.progressBar,
              {
                top: 0,
                width: progressBarWidth,
              },
            ]}
          />
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    position: "absolute",
    left: 0,
    height: 5,
    backgroundColor: colors.primary,
  },
});
