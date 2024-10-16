import type { Apa, FastDefinition } from "../type.d.ts";

export function Println(
  ...args: (string | number | object | FastDefinition | Apa)[]
) {
  const colorMap: { [key: string]: string } = {
    r: "\x1b[1;31m", // Bold Red
    g: "\x1b[1;32m", // Bold Green
    b: "\x1b[1;34m", // Bold Blue
    y: "\x1b[1;33m", // Bold Yellow
    default: "\x1b[0m", // Reset to default (no bold)
  };

  const formattedArgs = args.map((arg) => {
    if (typeof arg === "string") {
      return arg.replace(/<([a-z])>|<\/>/g, (match, p1) => {
        if (match === "</>") {
          return colorMap["default"]; // Reset to default
        } else {
          return colorMap[p1] || colorMap["default"]; // Set the bold color
        }
      });
    }
    return arg; // For numbers or other non-string values, return as is
  });

  console.log(...formattedArgs);
}
