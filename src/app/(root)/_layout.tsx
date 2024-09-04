import { Redirect, Stack } from "expo-router";

import LoadingView from "@/components/LoadingView";
import NavigationHeader from "@/components/NavigationHeader";
import { useAuthContext } from "@/contexts/AuthContext";

export default function RootLayout() {
  const { userLoaded, isAuthenticated } = useAuthContext();

  if (!userLoaded) {
    return <LoadingView />;
  }

  if (userLoaded && !isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
      <Stack.Screen
        name="add-news"
        options={{
          title: "Add News",
          presentation: "modal",
          headerShown: true,
          headerBackButtonMenuEnabled: true,
        }}
      />
      <Stack.Screen
        name="news/[id]/index"
        options={{
          title: "All News",
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          header: (props) => <NavigationHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="news/[id]/edit"
        options={{
          title: "Edit News",
          headerShown: true,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
