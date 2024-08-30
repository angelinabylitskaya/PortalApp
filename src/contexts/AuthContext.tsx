import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { initializeApp } from "firebase/app";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

import { firebaseConfig } from "@/constants/firebase-config";
import { UserInfo } from "@/models";

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

interface AuthContextValue {
  user: UserInfo | null;
  isAuthenticated: boolean;
  userLoaded: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultContextValue: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  userLoaded: false,

  signIn: async () => {},
  signOut: async () => {},
};

const AuthContext = createContext(defaultContextValue);

export const useAuthContext = () => useContext(AuthContext);

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [value, setValue] =
    useState<Omit<AuthContextValue, "signIn" | "signOut">>(defaultContextValue);

  const signIn = async (email: string, password: string) => {
    if (!email?.trim() || !password?.trim()) {
      throw new Error("Invalid email or password");
    }

    const { user } = await signInWithEmailAndPassword(auth, email, password);
    setValue({
      user: {
        displayName: user.displayName!,
        email: user.email!,
        uid: user.uid!,
      },
      isAuthenticated: !!user.uid,
      userLoaded: true,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setValue({
          user: {
            displayName: user.displayName!,
            email: user.email!,
            uid: user.uid!,
          },
          isAuthenticated: !!user.uid,
          userLoaded: true,
        });
      } else {
        setValue({
          user: null,
          isAuthenticated: false,
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
        signOut: () => signOut(auth),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
