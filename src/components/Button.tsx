import { TouchableOpacityProps, TouchableOpacity } from "react-native";

import Text from "./Text";

const variants = ["primary", "secondary"] as const;
type VariantProps = {
  [K in (typeof variants)[number]]?: boolean;
};
type ButtonProps = TouchableOpacityProps &
  VariantProps & {
    title: string;
    disabled?: boolean;
  };

export default function Button({ title, disabled, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      className="bg-brand-100 rounded px-4 py-2 w-full"
    >
      <Text buttonMedium className="uppercase text-brand-200 text-center">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
