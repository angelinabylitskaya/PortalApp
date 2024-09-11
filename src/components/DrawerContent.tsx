import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, Image } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useAuthContext } from "@/contexts/AuthContext";

import profileImage from "@/assets/images/icon.png";

export default function DrawerContent(props: DrawerContentComponentProps) {
  const { user } = useAuthContext();
  const { signOut } = useAuthContext();
  const router = useRouter();

  const logOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View className="border-secondary-100 border-b px-4 pb-4 pt-0 flex flex-row justify-between items-center">
          <View className="flex flex-row items-center gap-4">
            <Image
              source={profileImage}
              className="w-12 h-12 border-secondary-100 border"
              resizeMode="contain"
            />
            <Text className="text-lg font-PrimaryText">
              {user?.displayName}
            </Text>
          </View>
          <MaterialIcons size={24} name="logout" onPress={() => logOut()} />
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      {/* Drawer footer here */}
    </View>
  );
}
