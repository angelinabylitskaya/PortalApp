import { View, Text } from "react-native";

import Button from "@/components/Button";
import { useAuthContext } from "@/contexts/AuthContext";

export default function Team() {
  const { sendPushNotification, user } = useAuthContext();
  return (
    <View>
      <Text>hi team</Text>

      <Button
        title="Send push notification"
        onPress={() =>
          sendPushNotification({
            title: `Hi ${user?.displayName}`,
            body: "Lorem ipsum",
          })
        }
      />
    </View>
  );
}
