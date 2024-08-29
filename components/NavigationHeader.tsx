import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { getHeaderTitle } from "@react-navigation/elements";
import { usePathname, useRouter } from "expo-router";

import colors from "@/constants/colors";
import InputField from "./InputField";
import Text from "./Text";

interface NavigationHeaderContextValue {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;

  searchActive: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const defaultContextValue: NavigationHeaderContextValue = {
  search: "",
  setSearch: () => {},

  searchActive: false,
  openSearch: () => {},
  closeSearch: () => {},
};

const HeaderContext = React.createContext(defaultContextValue);

export const useHeaderContext = () =>
  useContext<NavigationHeaderContextValue>(HeaderContext);

const getShowSearch = (routeName: string): boolean => routeName === "news";

export const HeaderContextProvider = ({ children }: PropsWithChildren) => {
  const [search, setSearch] = React.useState<string>("");
  const [searchActive, setSearchActive] = React.useState<boolean>(false);
  const pathname = usePathname();

  const openSearch = () => setSearchActive(true);

  const closeSearch = () => {
    setSearchActive(false);
    setSearch("");
  };

  useEffect(() => {
    closeSearch();
  }, [pathname]);

  return (
    <HeaderContext.Provider
      value={{
        search,
        setSearch,
        searchActive,
        openSearch,
        closeSearch,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

const iconStyle = "flex m-3 h-[48px] w-[48px] items-center justify-center m-0";

export default function NavigationHeader(
  props: DrawerHeaderProps | NativeStackHeaderProps,
) {
  const { top } = useSafeAreaInsets();
  const { search, setSearch, searchActive, openSearch, closeSearch } =
    useHeaderContext();
  const title = getHeaderTitle(props.options, props.route.name);
  const showSearch = getShowSearch(props.route.name);
  const router = useRouter();

  const RightComponent = props.options.headerRight;

  return (
    <View className="bg-secondary-100" style={{ height: top + 64 }}>
      <View
        className="flex flex-row items-center h-[64px] bg-secondary-50 p-[8px]"
        style={{ marginTop: top }}
      >
        {(showSearch && searchActive) ||
        (props as NativeStackHeaderProps).options
          .headerBackButtonMenuEnabled ? (
          <TouchableOpacity
            className={iconStyle}
            onPress={() => {
              if (showSearch && searchActive) {
                closeSearch();
              } else {
                router.back();
              }
            }}
          >
            <MaterialIcons
              color={colors.brand["700"]}
              size={24}
              name="arrow-back"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className={iconStyle}
            onPress={(props as DrawerHeaderProps).navigation.toggleDrawer}
          >
            <MaterialIcons color={colors.brand["700"]} size={24} name="menu" />
          </TouchableOpacity>
        )}

        <View className="grow">
          {showSearch && searchActive ? (
            <InputField
              placeholder="Search"
              value={search}
              onChangeText={(value) => setSearch(value)}
            />
          ) : (
            <Text h5Medium className="text-left">
              {title}
            </Text>
          )}
        </View>

        {showSearch ? (
          search.trim().length ? (
            <TouchableOpacity
              className={iconStyle}
              onPress={() => setSearch("")}
            >
              <MaterialIcons
                color={colors.brand["700"]}
                size={24}
                name="close"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className={iconStyle}
              onPress={() => openSearch()}
            >
              <MaterialIcons
                color={colors.brand["700"]}
                size={24}
                name="search"
              />
            </TouchableOpacity>
          )
        ) : (
          <></>
        )}

        {RightComponent && <RightComponent canGoBack={false} />}
      </View>
    </View>
  );
}