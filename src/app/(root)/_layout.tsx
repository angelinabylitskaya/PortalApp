import { Stack } from "expo-router";

import NavigationHeader from "@/components/NavigationHeader";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
      <Stack.Screen
        name="news/[id]"
        options={{
          title: "All News",
          headerShown: true,
          headerBackButtonMenuEnabled: true,
          header: (props) => <NavigationHeader {...props} />,
        }}
      />
    </Stack>
  );
}
