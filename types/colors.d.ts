const colorGroups = [
  "brand",
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
] as const;
const shades = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
] as const;

declare type Colors = {
  [G in (typeof colorGroups)[number]]: {
    [S in (typeof shades)[number]]: string;
  };
};
