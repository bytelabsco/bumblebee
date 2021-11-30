import { STYLE_SEPARATOR, TOKEN_SEPARATOR } from "../constants";
import { Formatter } from "./formatter.interface";

export const tokenToStyleSeparatorFormatter: Formatter<string> = (value: string) : string => {
    return value.replaceAll(TOKEN_SEPARATOR, STYLE_SEPARATOR);
}