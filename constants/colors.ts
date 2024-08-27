export const colors = {
  brand: "#D61F26",
};

export type ThemeColors = {
  brand: string;
  bgPrimary: string;
  bgSecondary: string;
  textPrimary: string;
};

export const lightTheme: ThemeColors = {
  ...colors,
  bgPrimary: "#fff",
  bgSecondary: "#F2F2F2",
  textPrimary: "#1C1C1C",
};

export const darkTheme: ThemeColors = {
  ...lightTheme,
};
