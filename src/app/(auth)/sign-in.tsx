import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

import Button from "@/components/Button";
import InputField from "@/components/InputField";
import LoadingView from "@/components/LoadingView";
import { useAuthContext } from "@/contexts/AuthContext";

import Logo from "@/assets/images/logo-sm.png";

export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn } = useAuthContext();
  const router = useRouter();

  const login = async () => {
    try {
      setLoading(true);
      setError("");

      if (!email.trim() || !password.trim()) {
        throw new Error();
      }

      await signIn(email, password);
      router.push("/(root)/(tabs)/news");
    } catch {
      setError("Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingView />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      className="flex-1"
    >
      <SafeAreaView className="px-4 pt-16 pb-2 flex-1 flex-column items-center">
        <Image source={Logo} className="w-[72px]" resizeMode="contain" />

        <View className="grow my-16 w-full">
          <View className="mb-2">
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

        <Button title="Log in" className="w-full" onPress={login} />
        <Link
          replace
          href="/(auth)/sign-up"
          className="font-PrimaryText mt-4 underline"
        >
          Don't have an account?
        </Link>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
