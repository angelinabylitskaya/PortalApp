import { useEffect } from "react";
import "react-native-reanimated";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import LoadingView from "@/components/LoadingView";
import AuthContextProvider from "@/contexts/AuthContext";

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    PrimaryMedium: require("../assets/fonts/EtelkaMedium.otf"),
    PrimaryText: require("../assets/fonts/EtelkaText.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <LoadingView />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(root)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
