import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

import { useCreateUserQuery, useUserQuery } from "@/queries/users-query";

import { firebaseConfig } from "@/constants/firebase-config";
import { UserInfo } from "@/models";

try {
  const app = initializeApp(firebaseConfig);
  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  console.log(e);
}

type PushNotificationData = {
  title: string;
  body: string;
};

type AuthContextValue = {
  user: UserInfo | null;
  isAuthenticated: boolean;
  userLoaded: boolean;
  isAdmin: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPushNotification: (data: PushNotificationData) => Promise<void>;
};

const defaultContextValue: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  userLoaded: false,
  isAdmin: false,

  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  sendPushNotification: async () => {},
};

const AuthContext = createContext(defaultContextValue);

export const useAuthContext = () => useContext(AuthContext);

const auth = getAuth();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(
  data: PushNotificationData,
  expoPushToken: string,
) {
  const message = {
    ...data,
    to: expoPushToken,
    sound: "default",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [uid, setUid] = useState<string | undefined>();
  const [value, setValue] =
    useState<Omit<AuthContextValue, "signIn" | "signUp" | "signOut">>(
      defaultContextValue,
    );
  const createMutation = useCreateUserQuery();
  const { data: user } = useUserQuery(uid || "");
  const pushToken = (user as UserInfo)?.pushId || "";

  const signIn = async (email: string, password: string) => {
    if (!email?.trim() || !password?.trim()) {
      throw new Error("Invalid email or password");
    }

    const { user: userInfo } = await signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password.trim(),
    );
    setUid(userInfo.uid);
  };

  const signUp = async (name: string, email: string, password: string) => {
    if (!email?.trim() || !password?.trim() || !name?.trim()) {
      throw new Error("Invalid name, email or password");
    }

    const { user: authUser } = await createUserWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password.trim(),
    );
    const userInfo = {
      displayName: name.trim(),
      email: authUser.email!,
      uid: authUser.uid!,
    } as UserInfo;

    console.log("Device.isDevice", Device.isDevice);
    if (Device.isDevice) {
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;

        console.log("pushTokenString", pushTokenString);
        userInfo.pushId = pushTokenString;
      } catch (e) {
        console.log(e);
      }
    }

    createMutation.mutate(userInfo, {
      onSuccess: () => {
        setUid(userInfo.uid);
      },
    });
  };

  const logOut = async () => {
    setValue({
      ...defaultContextValue,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      userLoaded: true,
    });
    await signOut(auth);
    setUid(undefined);
  };

  useEffect(() => {
    if (!user) return;

    setValue({
      ...value,
      user: {
        displayName: user.displayName!,
        email: user.email!,
        uid: user.uid!,
      },
      isAuthenticated: true,
      userLoaded: true,
      isAdmin: !!user.isAdmin,
    });
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser?.uid) {
        setUid(authUser.uid);
      } else if (!value.userLoaded) {
        setValue({
          ...value,
          userLoaded: true,
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...value,
        signIn,
        signUp,
        signOut: logOut,
        sendPushNotification: (data: PushNotificationData) =>
          sendPushNotification(data, pushToken),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
