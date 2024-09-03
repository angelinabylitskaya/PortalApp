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

interface AuthContextValue {
  user: UserInfo | null;
  isAuthenticated: boolean;
  userLoaded: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultContextValue: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  userLoaded: false,

  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
};

const AuthContext = createContext(defaultContextValue);

export const useAuthContext = () => useContext(AuthContext);

const auth = getAuth();

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [uid, setUid] = useState<string | undefined>();
  const [value, setValue] =
    useState<Omit<AuthContextValue, "signIn" | "signUp" | "signOut">>(
      defaultContextValue,
    );
  const createMutation = useCreateUserQuery();
  const { data: user } = useUserQuery(uid || "");

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
    };
    createMutation.mutate(userInfo, {
      onSuccess: () => {
        setUid(userInfo.uid);
      },
    });
  };

  const logOut = async () => {
    setValue({
      user: null,
      isAuthenticated: false,
      userLoaded: true,
    });
    await signOut(auth);
    setUid(undefined);
  };

  useEffect(() => {
    if (!user) return;

    setValue({
      user: {
        displayName: user.displayName!,
        email: user.email!,
        uid: user.uid!,
      },
      isAuthenticated: true,
      userLoaded: true,
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
