import { useState } from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

import Button from "@/components/Button";
import InputField from "@/components/InputField";
import LoadingView from "@/components/LoadingView";
import { useAuthContext } from "@/contexts/AuthContext";

import Logo from "@/assets/images/logo-sm.png";

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { signUp } = useAuthContext();

  const register = async () => {
    try {
      setLoading(true);
      setError("");

      if (!email.trim() || !password.trim() || !name.trim()) {
        throw new Error();
      }

      await signUp(name, email, password);
    } catch {
      setError("Invalid Field Value");
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingView />;
  }

  return (
    <SafeAreaView className="px-4 pt-16 pb-2 flex-1 flex-column items-center">
      <Image source={Logo} className="w-[72px]" resizeMode="contain" />

      <View className="grow my-16 w-full">
        <View className="mb-2">
          <InputField
            value={name}
            placeholder="Display Name"
            label="Display Name"
            PrefixIcon={(props) => <MaterialIcons name="person" {...props} />}
            onChangeText={setName}
            hint={error}
            error={!!error}
            autoCapitalize="none"
          />
          <InputField
            value={email}
            placeholder="Email"
            label="Email"
            PrefixIcon={(props) => (
              <MaterialIcons name="mail-outline" {...props} />
            )}
            onChangeText={setEmail}
            autoComplete="email"
            inputMode="email"
            keyboardType="email-address"
            hint={error}
            error={!!error}
            autoCapitalize="none"
          />
        </View>

        <View>
          <InputField
            value={password}
            placeholder="Password"
            label="Password"
            secureTextEntry
            PrefixIcon={(props) => <MaterialIcons name="key" {...props} />}
            onChangeText={setPassword}
            hint={error}
            error={!!error}
          />
        </View>
      </View>

      <Button className="w-full" title="Register" onPress={register} />
      <Link
        replace
        href="/(auth)/sign-in"
        className="font-PrimaryText mt-4 underline"
      >
        Already a user?
      </Link>
    </SafeAreaView>
  );
}
