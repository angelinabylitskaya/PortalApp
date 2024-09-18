import { useRef, useState } from "react";
import { View, Linking, Platform, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { MaterialIcons } from "@expo/vector-icons";

import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import Map from "@/components/Map";
import Tabs from "@/components/Tabs";
import Text from "@/components/Text";

import colors from "@/constants/colors";
import { locations } from "@/constants/locations";

export default function Locations() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [location, setLocation] = useState(locations[0]);

  return (
    <GestureHandlerRootView className="flex-1">
      <View
        className="flex flex-col h-screen bg-secondary-50"
        style={{ height: "70%" }}
      >
        <View className="shrink-0">
          <Tabs
            data={locations}
            keyExtractor={(_, index) => `${index}`}
            renderTabItemLabel={(item) => item.title}
            onTabChange={(item) => setLocation(item)}
          />
        </View>
        <Map
          region={{
            latitude: location.coords[0],
            longitude: location.coords[1],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          markers={[
            {
              latitude: location.coords[0],
              longitude: location.coords[1],
              title: location.title,
            },
          ]}
        />
      </View>

      <BottomSheet ref={bottomSheetRef} snapPoints={["30%", "60%"]} index={0}>
        <BottomSheetScrollView style={{ padding: 16 }}>
          <View className="flex gap-y-4">
            <View className="flex flex-row gap-x-3">
              <MaterialIcons
                size={24}
                color={colors.secondary[400]}
                name="place"
              />
              <Text subtitle2>{location.address}</Text>
            </View>

            <View className="flex flex-row gap-x-3">
              <MaterialIcons
                size={24}
                name="phone"
                color={colors.secondary[400]}
              />
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`mailto:${location.email}`);
                }}
              >
                <Text link subtitle2>
                  {location.email}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex flex-row gap-x-3">
              <MaterialIcons
                size={24}
                color={colors.secondary[400]}
                name="email"
              />
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    `${Platform.OS ? "tel" : "telprompt"}:${location.phoneNumber}`,
                  );
                }}
              >
                <Text link subtitle2>
                  {location.phoneNumber}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
