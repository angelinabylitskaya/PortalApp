import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import LoadingView from "@/components/LoadingView";
import AuthContextProvider from "@/contexts/AuthContext";

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PrimaryMedium: require("../assets/fonts/EtelkaMedium.otf"),
    PrimaryText: require("../assets/fonts/EtelkaText.otf"),
  });
  const [appLoaded, setAppLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    console.log("process.env");
    console.log(process.env.EXPO_PUBLIC_API_KEY);
    console.log(process.env.EXPO_PUBLIC_AUTH_DOMAIN);
    console.log(process.env.EXPO_PUBLIC_PROJECT_ID);
    console.log(process.env.EXPO_PUBLIC_STORAGE_BUCKET);
    console.log(process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID);
    console.log(process.env.EXPO_PUBLIC_APP_ID);
    console.log("/process.env");

    try {
      const app = initializeApp(
        {
          apiKey: "AIzaSyDImepiNqp0PmorcoIFSvK5GKPRZr2BL6A",
          authDomain: "test-5d8d4.firebaseapp.com",
          projectId: "test-5d8d4",
          storageBucket: "test-5d8d4.appspot.com",
          messagingSenderId: "394441535463",
          appId: "1:394441535463:web:2f42f5a3506dd55a301742",
        },
        "webApp",
      );
      initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });
    } catch (e) {
      console.log(e);
    } finally {
      setAppLoaded(true);
    }
  }, []);

  if (!fontsLoaded) {
    return <LoadingView />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <KeyboardProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(root)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </KeyboardProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
