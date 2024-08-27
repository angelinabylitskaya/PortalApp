import { PropsWithChildren } from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  TextStyle,
} from "react-native";

import { typography } from "../constants/typography";

const typographyTypes = [...Object.keys(typography)] as const;
type TextProps = PropsWithChildren &
  RNTextProps & {
    // eslint-disable-next-line no-unused-vars
    [K in (typeof typographyTypes)[number]]: any;
  };

export default function Text({ children, className, ...allProps }: TextProps) {
  const { style, props } = Object.keys(allProps).reduce(
    ({ style, props }, prop) => {
      if (typographyTypes.includes(prop)) {
        return {
          props,
          style: {
            ...(style as any),
            ...(typography as any)[prop],
          },
        };
      }
      return {
        style,
        props: {
          ...props,
          [prop]: allProps[prop],
        },
      };
    },
    {
      style: {} as StyleProp<TextStyle>,
      props: {} as RNTextProps,
    },
  );
  return (
    <RNText {...props} style={[style, props.style || {}]} className={className}>
      {children}
    </RNText>
  );
}
