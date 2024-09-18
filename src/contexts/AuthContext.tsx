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

import { getApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { useCreateUserQuery, useUserQuery } from "@/queries/users-query";

import { UserInfo } from "@/models";

type PushNotificationData = {
  title: string;
  body: string;
};

type AuthContextValue = {
  user: UserInfo | null;
  isAuthenticated: boolean;
  userLoaded: boolean;
  isAdmin: boolean;
  notificationsAvailable: boolean;

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
  notificationsAvailable: false,

  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  sendPushNotification: async () => {},
};

const AuthContext = createContext(defaultContextValue);

export const useAuthContext = () => useContext(AuthContext);

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

  try {
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (e) {
    console.log(e);
  }
}

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [uid, setUid] = useState<string | undefined>();
  const [value, setValue] =
    useState<Omit<AuthContextValue, "signIn" | "signUp" | "signOut">>(
      defaultContextValue,
    );
  const createMutation = useCreateUserQuery();
  const { data: user } = useUserQuery(uid || "");
  const [pushToken, setPushToken] = useState<string>("");
  const auth = getAuth(getApp("webApp"));

  const signIn = async (email: string, password: string) => {
    if (!email?.trim() || !password?.trim()) {
      throw new Error("Invalid email or password");
    }

    setValue({
      ...value,
      userLoaded: false,
    });
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

    setValue({
      ...value,
      userLoaded: false,
    });
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
      userLoaded: false,
    });
    await signOut(auth);
    setUid(undefined);
    setValue({
      ...defaultContextValue,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      userLoaded: true,
    });
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

    if (!pushToken) {
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

      if (Device.isDevice) {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId;
        Notifications.getExpoPushTokenAsync({
          projectId,
        })
          .then(({ data }) => {
            setPushToken(data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
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
        notificationsAvailable: !!pushToken,
        sendPushNotification: (data: PushNotificationData) =>
          sendPushNotification(data, pushToken),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
