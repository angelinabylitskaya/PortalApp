import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
} from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import { getHeaderTitle } from "@react-navigation/elements";

import colors from "@/constants/colors";
import InputField from "./InputField";

interface DrawerHeaderContextValue {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

const defaultContextValue: DrawerHeaderContextValue = {
  search: "",
  setSearch: () => {},
};

const HeaderContext = React.createContext(defaultContextValue);

export const useHeaderContext = () =>
  useContext<DrawerHeaderContextValue>(HeaderContext);

const getShowSearch = (routeName: string): boolean => routeName === "news";

export const HeaderContextProvider = ({ children }: PropsWithChildren) => {
  const [search, setSearch] = React.useState<string>("");

  return (
    <HeaderContext.Provider
      value={{
        search,
        setSearch,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

const iconStyle = "flex m-3 h-[48px] w-[48px] items-center justify-center m-0";

export default function DrawerHeader(props: DrawerHeaderProps) {
  const { top } = useSafeAreaInsets();
  const [searchActive, setSearchActive] = React.useState<boolean>(false);
  const { search, setSearch } = useHeaderContext();
  const title = getHeaderTitle(props.options, props.route.name);
  const showSearch = getShowSearch(props.route.name);

  return (
    <View className="bg-secondary-100" style={{ height: top + 64 }}>
      <View
        className="flex flex-row items-center h-[64px] bg-secondary-50 p-[8px]"
        style={{ marginTop: top }}
      >
        {showSearch && searchActive ? (
          <TouchableOpacity
            className={iconStyle}
            onPress={() => {
              setSearch("");
              setSearchActive(false);
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
            onPress={props.navigation.toggleDrawer}
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
            <Text className="font-PrimaryMedium text-[20px] text-left">
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
              onPress={() => setSearchActive(true)}
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
      </View>
    </View>
  );
}
