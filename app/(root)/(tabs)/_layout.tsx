import { MaterialIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import useColors from "@/hooks/useColors";

export default function TabsLayout() {
  const { colors } = useColors();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="news"
        screenOptions={{
          drawerType: "front",
          drawerActiveTintColor: colors.brand,
          drawerActiveBackgroundColor: colors.bgSecondary,
          drawerInactiveTintColor: colors.textPrimary,
          drawerItemStyle: {
            marginVertical: 0,
            marginHorizontal: 0,
            paddingVertical: 8,
            paddingRight: 8,
            paddingLeft: 12,
            borderRadius: 0,
          },
          drawerLabelStyle: {},
          drawerContentContainerStyle: {},
          drawerContentStyle: {},
          drawerStyle: {
            width: "85%",
          },
        }}
      >
        <Drawer.Screen
          name="news"
          options={{
            drawerLabel: "News",
            title: "News",
            drawerIcon: ({ focused, color, size }) => (
              <MaterialIcons color={color} size={size} name="email" />
            ),
          }}
        />
        <Drawer.Screen
          name="team"
          options={{
            drawerLabel: "Team",
            title: "Team",
            drawerIcon: ({ focused, color, size }) => (
              <MaterialIcons color={color} size={size} name="people" />
            ),
          }}
        />
        <Drawer.Screen
          name="locations"
          options={{
            drawerLabel: "Locations",
            title: "Locations",
            drawerIcon: ({ focused, color, size }) => (
              <MaterialIcons color={color} size={size} name="place" />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
