import { ReactNode } from "react";
import { TouchableOpacityProps, TouchableOpacity } from "react-native";

import colors from "@/constants/colors";

import Text from "./Text";

const variants = ["primary", "secondary", "outline"] as const;
type VariantProps = {
  [K in (typeof variants)[number]]?: boolean;
};
type ButtonProps = TouchableOpacityProps &
  VariantProps & {
    title: string;
    disabled?: boolean;
    Prefix?: (props: { size: number; color: string }) => ReactNode;
  };

const getButtonStyle = ({
  secondary,
  outline,
}: Partial<ButtonProps>): [string, string, { size: number; color: string }] => {
  switch (true) {
    case !!secondary: {
      return [
        `text-transparent`,
        `text-brand-100`,
        { size: 24, color: colors.brand["100"] },
      ];
    }
    case !!outline: {
      return [
        `text-transparent border rounded border-secondary-300`,
        `text-secondary-700`,
        { size: 24, color: colors.brand["100"] },
      ];
    }
    default: {
      return [
        `bg-brand-100`,
        `text-brand-200`,
        { size: 24, color: colors.brand["200"] },
      ];
    }
  }
};

export default function Button({
  title,
  disabled,
  className,
  Prefix,
  ...props
}: ButtonProps) {
  const [buttonStyle, textStyle, iconStyle] = getButtonStyle(props);
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      className={`rounded px-4 py-2 flex flex-row items-center justify-center ${disabled && "opacity-75"} ${buttonStyle} ${className}`}
    >
      {Prefix?.(iconStyle)}
      <Text buttonMedium className={`uppercase text-center ${textStyle}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
