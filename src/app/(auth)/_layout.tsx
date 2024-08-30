import { Redirect, Stack } from "expo-router";

import { useAuthContext } from "@/contexts/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Redirect href="/(root)/(tabs)/news" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
