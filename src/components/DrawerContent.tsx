import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, Image } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import profileImage from "@/assets/images/icon.png";

export default function DrawerContent(props: DrawerContentComponentProps) {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View className="border-secondary-100 border-b px-4 pb-4 pt-0 flex flex-row justify-between items-center">
          <View className="flex flex-row items-center gap-4">
            <Image
              source={profileImage}
              className="w-12 h-12 border-secondary-100 border"
            />
            <Text className="text-lg font-PrimaryText">Anton Karpuk</Text>
          </View>
          <MaterialIcons size={24} name="logout" />
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      {/* Drawer footer here */}
    </View>
  );
}
