import { MaterialCommunityIcons, Octicons, Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import DrawerContent from "@/components/DrawerContent";
import colors from "@/constants/colors";
import DrawerHeader, { HeaderContextProvider } from "@/components/DrawerHeader";

export default function TabsLayout() {
  return (
    <HeaderContextProvider>
      <GestureHandlerRootView className="flex-1">
        <Drawer
          initialRouteName="news"
          screenOptions={{
            drawerType: "front",
            drawerActiveTintColor: colors.brand["100"],
            drawerActiveBackgroundColor: colors.secondary["50"],
            drawerInactiveTintColor: colors.brand["600"],
            drawerItemStyle: {
              marginVertical: 0,
              marginHorizontal: 0,
              paddingVertical: 8,
              paddingRight: 8,
              paddingLeft: 12,
              borderRadius: 0,
            },
            drawerLabelStyle: {
              marginLeft: -20,
              fontFamily: "PrimaryMedium",
            },
            drawerStyle: {
              width: "85%",
            },
            headerLeftContainerStyle: {},
            headerTitleContainerStyle: {},
            headerRightContainerStyle: {},
            headerTitleStyle: {},
            headerTitleAlign: "left",
            headerStyle: {},
            headerTransparent: false,
            header: (props) => <DrawerHeader {...props} />,
            sceneContainerStyle: {
              backgroundColor: "#fff",
            },
          }}
          drawerContent={(props) => <DrawerContent {...props} />}
        >
          <Drawer.Screen
            name="news"
            options={{
              drawerLabel: "News",
              title: "News",
              drawerIcon: ({ focused, color, size }) => (
                <Ionicons color={color} size={size} name="newspaper" />
              ),
            }}
          />
          <Drawer.Screen
            name="team"
            options={{
              drawerLabel: "Team",
              title: "Team",
              drawerIcon: ({ focused, color, size }) => (
                <MaterialCommunityIcons
                  color={color}
                  size={size}
                  name="account-multiple-outline"
                />
              ),
            }}
          />
          <Drawer.Screen
            name="locations"
            options={{
              drawerLabel: "Locations",
              title: "Locations",
              drawerIcon: ({ focused, color, size }) => (
                <Octicons color={color} size={size} name="location" />
              ),
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </HeaderContextProvider>
  );
}
