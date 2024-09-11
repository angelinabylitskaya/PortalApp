import { ReactNode, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TextInputProps,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import colors from "@/constants/colors";

import Text from "./Text";

const variants = ["search"] as const;
type SearchProps = {
  [K in (typeof variants)[number]]?: boolean;
};
type IconProps = {
  size: number;
  color: string;
  className: string;
};

const iconProps = {
  size: 24,
  color: "#A3A3A3",
};

type InputProps = TextInputProps &
  SearchProps & {
    PrefixIcon?: (props: IconProps) => ReactNode;
    PostfixIcon?: (props: IconProps) => ReactNode;
    label?: string;
    hint?: string;
    error?: boolean;
  };

export default function InputField({
  secureTextEntry = false,
  search,
  label,
  hint,
  error,
  PrefixIcon,
  PostfixIcon,
  ...props
}: InputProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const style = search
    ? ""
    : `rounded border ${error ? "border-brand-100" : "border-secondary-200"}`;
  const color = search ? "text-brand-100" : "text-brand-600";

  const setInputValue = (text: string) => {
    setValue(text);
    props.onChangeText?.(text);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <Text
          inputLabel
          className={`mb-1 ${error ? "text-brand-100" : "text-secondary-700"} h-4`}
        >
          {label}
        </Text>
        <View
          className={`px-2 h-10 flex flex-row justify-start items-center ${style}`}
        >
          {PrefixIcon && <PrefixIcon {...iconProps} className="mr-2" />}
          <TextInput
            value={value}
            className={`${color} font-PrimaryText grow text-[15px] leading-[18px]`}
            secureTextEntry={secureTextEntry && !visible}
            placeholderTextColor={colors.secondary["400"]}
            selectionColor={search ? colors.danger["300"] : colors.brand["600"]}
            textAlign="left"
            {...props}
            onChangeText={setInputValue}
          />
          {!PostfixIcon && !!value && (
            <MaterialIcons
              name="close"
              {...iconProps}
              onPress={() => setInputValue("")}
            />
          )}
          {secureTextEntry && (
            <MaterialCommunityIcons
              name={visible ? "eye-off" : "eye"}
              {...iconProps}
              className="ml-2"
              onPress={() => setVisible(!visible)}
            />
          )}
          {PostfixIcon && <PostfixIcon {...iconProps} className="ml-2" />}
        </View>
        <Text
          className={`mt-1 ${error ? "text-brand-100" : "text-secondary-700"} h-4`}
          inputLabel
        >
          {hint}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
