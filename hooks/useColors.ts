import { darkTheme, lightTheme } from "@/constants/colors";
import { useColorScheme } from "react-native";

export default function useColors() {
  const theme = useColorScheme() || "light";

  return { colors: theme === "light" ? lightTheme : darkTheme };
}
